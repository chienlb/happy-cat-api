// pronunciation.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { envSchema } from 'src/app/configs/env/env.config';
import { CreatePronunciationExerciseDto } from './dto/create-pronunciation-exercise.dto';
import {
  PronunciationExercise,
  PronunciationExerciseDocument,
} from './schema/pronunciation-exercise.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { UsersService } from '../users/users.service';
import { LessonsService } from '../lessons/lessons.service';
import { UnitsService } from '../units/units.service';
import { UpdatePronunciationExerciseDto } from './dto/update-pronunciation-exercise.dto';
import { SubmitPronunciationAttemptDto } from './dto/submit-pronunciation-attempt.dto';
import {
  PronunciationAttempt,
  PronunciationAttemptDocument,
  PronunciationAttemptStatus,
} from './schema/pronunciation-attempt.schema';
import { GoogleGenAI } from '@google/genai';

const env = envSchema.parse(process.env);

type AssessInput = {
  audioBuffer: Buffer;
  referenceText: string;
  language: string; // e.g. en-US
  contentType?: string;
};

@Injectable()
export class PronunciationService {
  private genAI: GoogleGenAI;

  constructor(
    @InjectModel(PronunciationExercise.name)
    private pronunciationExerciseModel: Model<PronunciationExerciseDocument>,
    @InjectModel(PronunciationAttempt.name)
    private pronunciationAttemptModel: Model<PronunciationAttemptDocument>,
    private cloudflareService: CloudflareService,
    private usersService: UsersService,
    private lessonService: LessonsService,
    private unitsService: UnitsService,
  ) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async assessShortAudio(
    input: AssessInput,
    userId: string,
    exerciseId: string,
  ) {
    console.log('env');
    console.log(env.AZURE_SPEECH_REGION);
    console.log(env.AZURE_SPEECH_KEY);
    if (!env.AZURE_SPEECH_REGION || !env.AZURE_SPEECH_KEY) {
      throw new InternalServerErrorException(
        'Missing AZURE_SPEECH_REGION / AZURE_SPEECH_KEY in env',
      );
    }

    const { audioBuffer, referenceText, language, contentType } = input;

    // Validate WAV format
    const isRIFF = audioBuffer.toString('ascii', 0, 4) === 'RIFF';
    const isWAVE = audioBuffer.toString('ascii', 8, 12) === 'WAVE';
    
    console.log('Audio debug:', {
      size: audioBuffer.length,
      contentType,
      first4Bytes: audioBuffer.toString('hex', 0, 4),
      isRIFF,
      isWAVE,
    });

    if (!isRIFF || !isWAVE) {
      throw new BadRequestException(
        'Audio must be WAV PCM format (RIFF/WAVE). Current file is not valid WAV. Please convert audio to WAV PCM 16kHz mono on client before uploading.',
      );
    }

    // Pronunciation Assessment header (Base64 JSON)
    const pronParams = {
      ReferenceText: referenceText,
      GradingSystem: 'HundredMark', // FivePoint | HundredMark
      Granularity: 'Word', // Phoneme | Word | FullText
      Dimension: 'Comprehensive', // Basic | Comprehensive
      EnableMiscue: 'True', // bắt lỗi thiếu/thừa từ
      EnableProsodyAssessment: 'True', // prosody (stress/intonation/rhythm)
    };

    console.log(env.AZURE_SPEECH_KEY);
    console.log(env.AZURE_SPEECH_REGION);

    const pronHeader = Buffer.from(JSON.stringify(pronParams), 'utf8').toString(
      'base64',
    );

    const url =
      `https://${env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1` +
      `?language=${encodeURIComponent(language)}&format=detailed`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type':
          contentType || 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY,
        'Pronunciation-Assessment': pronHeader,
      },
      body: new Uint8Array(audioBuffer),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      // In ra message rõ ràng để debug 401/403/400
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        throw new BadRequestException(
          `Azure Speech API error ${res.status}: ${bodyText}`,
        );
      }
      throw new InternalServerErrorException(
        `Azure Speech API error ${res.status}: ${bodyText}`,
      );
    }

    let json;
    try {
      json = JSON.parse(bodyText);
    } catch (parseError) {
      const errorMessage =
        parseError instanceof Error ? parseError.message : String(parseError);
      throw new InternalServerErrorException(
        `Failed to parse Azure Speech API response: ${errorMessage}`,
      );
    }

    const best = json?.NBest?.[0];

    // Analyze with Gemini AI
    const aiAnalysis = await this.analyzeWithGemini(best, referenceText);

    // Prepare word-level feedback
    const wordLevelFeedback = best?.Words?.map((w: any) => ({
      word: w.Word,
      score: w.AccuracyScore || 0,
      issues: w.ErrorType !== 'None' ? [w.ErrorType] : [],
    })) || [];

    // Calculate scores
    const pronScore = best?.PronScore || 0;
    const accuracy = best?.AccuracyScore || 0;
    const fluency = best?.FluencyScore || 0;
    const completeness = best?.CompletenessScore || 0;
    const overallScore = Math.round((pronScore + accuracy + fluency + completeness) / 4);

    // Create and save pronunciation attempt
    const pronunciationAttempt = await this.pronunciationAttemptModel.create({
      userId: new Types.ObjectId(userId),
      exerciseId: new Types.ObjectId(exerciseId),
      userAudio: '',
      audioDuration: json?.Duration ? json.Duration / 10000000 : 0, // Convert to seconds
      score: pronScore,
      accuracy: accuracy,
      fluency: fluency,
      completeness: completeness,
      overallScore: overallScore,
      feedback: aiAnalysis,
      wordLevelFeedback: wordLevelFeedback,
      phonemeFeedback: [],
      status: PronunciationAttemptStatus.SCORED,
      attemptNumber: 1,
      isPassed: overallScore >= 60, // Pass threshold
      timeSpent: 0,
    });

    return {
      attemptId: pronunciationAttempt._id,
      status: json?.RecognitionStatus,
      recognizedText: best?.Display ?? json?.DisplayText ?? '',
      scores: best
        ? {
            pronScore: best.PronScore,
            accuracy: best.AccuracyScore,
            fluency: best.FluencyScore,
            prosody: best.ProsodyScore,
            completeness: best.CompletenessScore,
            confidence: best.Confidence,
            overallScore: overallScore,
          }
        : null,
      words: best?.Words ?? [],
      aiAnalysis,
      raw: json,
    };
  }

  /**
   * Analyze pronunciation results with Gemini AI
   */
  private async analyzeWithGemini(
    pronunciationData: any,
    referenceText: string,
  ): Promise<string> {
    try {
      const prompt = `Bạn là Happy Cat - trợ lý AI đánh giá phát âm tiếng Anh thân thiện trên nền tảng Happy Cat. Hãy phân tích kết quả phát âm và đưa ra nhận xét chi tiết, dễ hiểu:

**Văn bản chuẩn:** "${referenceText}"
**Văn bản nhận diện:** "${pronunciationData?.Display || 'N/A'}"

**Điểm số:**
- Tổng điểm phát âm: ${pronunciationData?.PronScore || 0}/100
- Độ chính xác: ${pronunciationData?.AccuracyScore || 0}/100
- Độ trôi chảy: ${pronunciationData?.FluencyScore || 0}/100
- Ngữ điệu: ${pronunciationData?.ProsodyScore || 0}/100
- Độ hoàn chỉnh: ${pronunciationData?.CompletenessScore || 0}/100

**Chi tiết từng từ:**
${pronunciationData?.Words?.map((w: any) => `- "${w.Word}": ${w.AccuracyScore}/100 (${w.ErrorType})`).join('\n') || 'Không có dữ liệu'}

YÊU CẦU QUAN TRỌNG:
- XƯNG HÔ: Luôn dùng "bạn", "mình" (như bạn bè). KHÔNG dùng "con", "em", "cháu", "cô/thầy"
- TÊN: Gọi mình là "Happy Cat" hoặc "mình"
- ĐỘ DÀI: Luôn viết 12-15 câu, đầy đủ cấu trúc dưới đây

**CẤU TRÚC BẮT BUỘC (12-15 câu):**

**1. Lời chào (2 câu):**
- Chào thân thiện từ Happy Cat
- Động viên và tổng quan điểm số

**2. Phân tích chi tiết (6-7 câu):**
- Độ chính xác (${pronunciationData?.AccuracyScore || 0}/100): Nhận xét cụ thể, giải thích ý nghĩa
- Độ trôi chảy (${pronunciationData?.FluencyScore || 0}/100): Đánh giá tốc độ nói
- Ngữ điệu (${pronunciationData?.ProsodyScore || 0}/100): Đánh giá cao trầm, nhấn giọng
- Độ hoàn chỉnh (${pronunciationData?.CompletenessScore || 0}/100): Đánh giá đọc đủ từ

**3. Phân tích từng từ (3-4 câu):**
- Khen từ phát âm tốt (${pronunciationData?.Words?.filter((w: any) => w.AccuracyScore >= 90).map((w: any) => w.Word).join(', ') || 'các từ'})
- Chỉ ra từ cần cải thiện (nếu có)
- Gợi ý cách phát âm đúng

**4. Kết thúc (2-3 câu):**
- Gợi ý rèn luyện tiếp
- Động viên và khích lệ
- Lời chào cuối từ Happy Cat

Sử dụng emoji: 😊 🎉 ⭐ 👍 💪 🌟 và giọng văn thân thiện như bạn bè.`;

      const chat = this.genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage({ message: prompt });
      return result.text || 'Không thể tạo phân tích.';
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return 'Phân tích tự động tạm thời không khả dụng.';
    }
  }

  async createPronunciationExercise(
    input: CreatePronunciationExerciseDto,
    userId: string,
  ) {
    try {
      const {
        text,
        ipa,
        translation,
        description,
        referenceAudio,
        referenceAudioDuration,
        lessonId,
        unitId,
        level,
        difficulty,
        topic,
        tags,
        minScore,
        maxAttempts,
      } = input;
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const lesson = await this.lessonService.findLessonById(
        lessonId as string,
      );
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      const unit = await this.unitsService.findUnitById(unitId as string);
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
      const pronunciationExercise =
        await this.pronunciationExerciseModel.create({
          text,
          ipa,
          translation,
          description,
          referenceAudio,
          referenceAudioDuration,
          lessonId,
          unitId,
          level,
          difficulty,
          topic,
          tags,
          minScore,
          maxAttempts,
          createdBy: userId,
          updatedBy: userId,
        });
      return pronunciationExercise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPronunciationExercises(lessonId: string, unitId: string) {
    try {
      const pronunciationExercises = await this.pronunciationExerciseModel.find(
        { lessonId, unitId },
      );
      return pronunciationExercises;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPronunciationExerciseById(id: string) {
    try {
      const pronunciationExercise =
        await this.pronunciationExerciseModel.findById(id);
      return pronunciationExercise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatePronunciationExercise(
    id: string,
    input: UpdatePronunciationExerciseDto,
    userId: string,
  ) {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const pronunciationExercise =
        await this.pronunciationExerciseModel.findByIdAndUpdate(id, input, {
          new: true,
        });
      if (!pronunciationExercise) {
        throw new NotFoundException('Pronunciation exercise not found');
      }
      pronunciationExercise.updatedBy = user._id;
      await pronunciationExercise.save();
      return pronunciationExercise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePronunciationExercise(id: string) {
    try {
      const pronunciationExercise =
        await this.pronunciationExerciseModel.findByIdAndDelete(id);
      return pronunciationExercise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
