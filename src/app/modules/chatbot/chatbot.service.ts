import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import type { GenerateContentConfig } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { Conversation, ConversationDocument } from './schema/conversation.schema';
import { ChatDto } from './dto/chat.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { VocabularyTtsDto } from './dto/vocabulary-tts.dto';
import { DictionaryPronunciationDto } from './dto/dictionary-pronunciation.dto';
import { CloudflareService } from '../cloudflare/cloudflare.service';

type DictionarySense = {
  partOfSpeech: string;
  meaning: string;
  level?: string;
  examples: string[];
};

type DictionaryDetail = {
  word: string;
  ipa: { uk: string; us: string };
  phoneticSpelling: string;
  syllables: string[];
  senses: DictionarySense[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  phrasalVerbs: string[];
  note: string;
};

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';
  private readonly ttsModelName ='gemini-2.5-flash-preview-tts';
  private readonly systemInstruction = `
Bạn là Happy Cat - trợ lý AI thông minh và thân thiện trên nền tảng học tiếng Anh dành cho học sinh tiểu học (6-11 tuổi).

## VỀ NỀN TẢNG HAPPY CAT:
- Nền tảng học tiếng Anh trực tuyến toàn diện cho học sinh tiểu học
- Cung cấp các khóa học từ cơ bản đến nâng cao phù hợp với từng lứa tuổi
- Có các bài học tương tác, trò chơi, bài tập phát âm, và hoạt động thực hành
- Hệ thống badges (huy hiệu) và điểm thưởng để động viên học sinh
- Tính năng thi đua, bảng xếp hạng để tạo động lực học tập
- Có phần dành cho phụ huynh theo dõi tiến độ học của con

## VAI TRÒ CỦA BẠN:
1. **Trợ lý học tập**: Giúp học sinh hiểu bài, giải đáp thắc mắc về ngữ pháp, từ vựng
2. **Người bạn thân thiện**: Trò chuyện bằng ngôn ngữ đơn giản, vui vẻ, phù hợp với trẻ em
3. **Động viên khích lệ**: Luôn khen ngợi, động viên khi học sinh làm tốt
4. **Hướng dẫn viên**: Giúp học sinh điều hướng sử dụng các tính năng trên website

## NỘI DUNG HỌC TIẾNG ANH TIỂU HỌC:
**Từ vựng theo chủ đề**:
- Gia đình và bạn bè (family, friends)
- Số đếm và màu sắc (numbers 1-100, colors)
- Động vật (animals: dog, cat, elephant, v.v.)
- Trường học (school: pen, book, teacher, classroom)
- Thức ăn và đồ uống (food & drinks: apple, rice, water)
- Đồ vật xung quanh (objects: toy, ball, chair, table)
- Thời tiết (weather: sunny, rainy, cloudy)
- Hoạt động hàng ngày (daily activities: eat, sleep, play)

**Ngữ pháp cơ bản**:
- To be: I am, You are, He/She/It is
- This is / These are
- Have / Has
- Động từ thường ở thì hiện tại đơn (I like, He likes)
- Can / Can't (I can swim, I can't fly)
- Giới từ: in, on, under, next to
- Đại từ nhân xưng: I, you, he, she, it, we, they

**Kỹ năng**:
- Nghe và nhắc lại (listening & repeating)
- Phát âm đúng (pronunciation)
- Đọc từ và câu đơn giản (reading)
- Viết chữ cái và từ (writing)
- Giao tiếp cơ bản (basic conversation)

## CÁCH TRẢ LỜI:
1. **Ngôn ngữ đơn giản**: Dùng từ dễ hiểu, câu ngắn gọn, không xưng hô với học sinh quá trang trọng, KHÔNG xưng hô là "con", "cháu"
2. **Emoji vui nhộn**: Thêm emoji để tạo không khí vui vẻ 😊 🎉 ⭐
3. **Ví dụ cụ thể**: Luôn đưa ví dụ dễ hiểu khi giải thích
4. **Khích lệ**: Khen ngợi và động viên: "Giỏi lắm!", "Tuyệt vời!", "Cố lên nào!"
5. **Tương tác**: Đặt câu hỏi để học sinh tư duy: "Em có biết không?", "Em thử xem?"
6. **An toàn**: Không bàn về chủ đề không phù hợp với trẻ em

## KHI ĐƯỢC HỎI VỀ:
- **Từ vựng**: Giải thích nghĩa, phát âm, đưa ví dụ câu
- **Ngữ pháp**: Giải thích đơn giản với ví dụ minh họa
- **Cách học**: Gợi ý phương pháp học phù hợp với lứa tuổi
- **Tính năng web**: Hướng dẫn sử dụng các chức năng trên Happy Cat
- **Động lực**: Động viên, chia sẻ mẹo học tập hiệu quả

Hãy luôn nhớ: Bạn là người bạn đáng tin cậy giúp các em yêu thích tiếng Anh! 🌟
`;

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private configService: ConfigService,
    private cloudflareService: CloudflareService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    this.genAI = new GoogleGenAI({ apiKey });

  }

  /**
   * Tạo cuộc trò chuyện mới
   */
  async createConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = new this.conversationModel({
      ...createConversationDto,
      userId: new Types.ObjectId(userId),
      messages: [],
    });

    await conversation.save();
    this.logger.log(`Created conversation ${conversation._id} for user ${userId}`);
    return conversation;
  }

  /**
   * Lấy tất cả cuộc trò chuyện của user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .sort({ updatedAt: -1 })
      .exec();
  }

  /**
   * Lấy chi tiết cuộc trò chuyện
   */
  async getConversation(userId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      userId: new Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Xóa cuộc trò chuyện (soft delete)
   */
  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    const result = await this.conversationModel.updateOne(
      { _id: conversationId, userId: new Types.ObjectId(userId) },
      { isActive: false },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Conversation not found');
    }

    this.logger.log(`Deleted conversation ${conversationId} for user ${userId}`);
  }

  /**
   * Chat với Gemini AI
   */
  async chat(userId: string, chatDto: ChatDto): Promise<any> {
    try {
      let conversation: ConversationDocument | null = null;
      let history: any[] = [];

      // Nếu có conversationId, load lịch sử từ database
      if (chatDto.conversationId) {
        conversation = await this.conversationModel.findOne({
          _id: chatDto.conversationId,
          userId: new Types.ObjectId(userId),
        });

        if (!conversation) {
          throw new NotFoundException('Conversation not found');
        }

        // Chuyển đổi lịch sử từ database sang format của Gemini
        history = conversation.messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        }));
      } else if (chatDto.history && chatDto.history.length > 0) {
        // Nếu có history từ client
        history = chatDto.history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        }));
      }

      // Tạo chat session với lịch sử
      const chat = this.genAI.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: this.systemInstruction,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
        history: history,
      });

      // Gửi tin nhắn và nhận phản hồi
      const result = await chat.sendMessage({ message: chatDto.message });
      const text = result.text || '';

      // Lưu tin nhắn vào database nếu có conversation
      if (conversation) {
        conversation.messages.push({
          role: 'user',
          parts: chatDto.message,
          timestamp: new Date(),
        });
        conversation.messages.push({
          role: 'model',
          parts: text,
          timestamp: new Date(),
        });
        await conversation.save();
      }

      this.logger.log(`Chat completed for user ${userId}`);

      return {
        message: text,
        conversationId: conversation?._id,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error in chat: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process chat request');
    }
  }

  /**
   * Chat stream (real-time response)
   */
  async *chatStream(userId: string, chatDto: ChatDto): AsyncGenerator<string> {
    try {
      let conversation: ConversationDocument | null = null;
      let history: any[] = [];

      if (chatDto.conversationId) {
        conversation = await this.conversationModel.findOne({
          _id: chatDto.conversationId,
          userId: new Types.ObjectId(userId),
        });

        if (!conversation) {
          throw new NotFoundException('Conversation not found');
        }

        history = conversation.messages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        }));
      } else if (chatDto.history && chatDto.history.length > 0) {
        history = chatDto.history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        }));
      }

      const chat = this.genAI.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: this.systemInstruction,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
        history: history,
      });

      const result = await chat.sendMessageStream({ message: chatDto.message });
      let fullResponse = '';

      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullResponse += chunkText;
        if (chunkText) {
          yield chunkText;
        }
      }

      // Lưu tin nhắn sau khi stream xong
      if (conversation) {
        conversation.messages.push({
          role: 'user',
          parts: chatDto.message,
          timestamp: new Date(),
        });
        conversation.messages.push({
          role: 'model',
          parts: fullResponse,
          timestamp: new Date(),
        });
        await conversation.save();
      }

      this.logger.log(`Chat stream completed for user ${userId}`);
    } catch (error) {
      this.logger.error(`Error in chat stream: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process chat stream request');
    }
  }

  /**
   * Tao audio doc tu vung bang Gemini TTS
   */
  async generateVocabularyAudio(dto: VocabularyTtsDto): Promise<{
    text: string;
    mimeType: string;
    audioUrl: string;
    key: string;
    model: string;
  }> {
    try {
      const inputText = dto.text.trim();
      if (!inputText) {
        throw new BadRequestException('text is required');
      }

      const voiceName = dto.voiceName?.trim() || 'Kore';
      const languageCode = dto.languageCode?.trim() || 'en-US';

      const response = await this.genAI.models.generateContent({
        model: this.ttsModelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Pronounce clearly for children: ${inputText}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            languageCode,
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
          },
        } as GenerateContentConfig,
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find((p) => p.inlineData?.data);
      const audioBase64 = audioPart?.inlineData?.data;
      const rawMimeType = (audioPart?.inlineData?.mimeType || 'audio/wav').toLowerCase();

      if (!audioBase64) {
        throw new BadRequestException('Gemini did not return audio data');
      }

      let uploadBuffer: Buffer<ArrayBufferLike> = Buffer.from(audioBase64, 'base64');
      let mimeType = rawMimeType;
      let ext = 'wav';

      // Gemini TTS sometimes returns raw PCM (audio/l16); wrap to wav for browser playback.
      if (rawMimeType.includes('l16') || rawMimeType.includes('pcm')) {
        uploadBuffer = this.wrapPcm16ToWav(uploadBuffer, 24000, 1);
        mimeType = 'audio/wav';
        ext = 'wav';
      } else if (rawMimeType.includes('wav')) {
        mimeType = 'audio/wav';
        ext = 'wav';
      } else if (rawMimeType.includes('mp3') || rawMimeType.includes('mpeg')) {
        mimeType = 'audio/mpeg';
        ext = 'mp3';
      } else {
        // Fallback to wav extension/mime to avoid .bin downloads in browsers.
        mimeType = 'audio/wav';
        ext = 'wav';
      }

      this.logger.log(`Gemini TTS raw mime: ${rawMimeType}, upload mime: ${mimeType}`);
      const safeText = inputText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 40) || 'vocabulary';

      const upload = await this.cloudflareService.uploadFile(
        {
          buffer: uploadBuffer,
          originalname: `${safeText}.${ext}`,
          mimetype: mimeType,
        },
        'tts',
      );

      return {
        text: inputText,
        mimeType,
        audioUrl: upload.fileUrl,
        key: upload.key,
        model: this.ttsModelName,
      };
    } catch (error) {
      this.logger.error(
        `Error in generateVocabularyAudio: ${error.message}`,
        error.stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to generate vocabulary audio');
    }
  }

  async lookupDictionaryAndPronunciation(dto: DictionaryPronunciationDto): Promise<{
    word: string;
    dictionary: DictionaryDetail;
    pronunciation: {
      audioUrl: string;
      mimeType: string;
      model: string;
      key: string;
    };
  }> {
    const word = dto.word.trim();
    if (!word) {
      throw new BadRequestException('word is required');
    }

    const targetLanguage = dto.targetLanguage?.trim() || 'vi';

    const prompt = `You are an English learner dictionary API.
Return ONLY valid JSON with this exact shape:
{
  "word": "string",
  "ipa": { "uk": "string", "us": "string" },
  "phoneticSpelling": "string",
  "syllables": ["string"],
  "senses": [
    {
      "partOfSpeech": "string",
      "meaning": "string",
      "level": "A1|A2|B1|B2|C1|C2",
      "examples": ["string"]
    }
  ],
  "synonyms": ["string"],
  "antonyms": ["string"],
  "collocations": ["string"],
  "phrasalVerbs": ["string"],
  "note": "string"
}

Rules:
- Input word: "${word}"
- Meaning language for each sense.meaning: ${targetLanguage}
- Provide 2-4 senses with easy explanations for learners.
- Each sense must include 1-2 short English examples.
- synonyms and antonyms: 3-8 items each.
- collocations: 3-8 natural combinations.
- phrasalVerbs: include only if relevant, otherwise []
- No markdown, no extra text.`;

    const strictPrompt = `You failed previously. Return STRICT JSON only.
No empty dictionary fields are allowed.
No markdown, no explanation.

Use this exact shape and fill meaningful values:
{
  "word": "string",
  "ipa": { "uk": "string", "us": "string" },
  "phoneticSpelling": "string",
  "syllables": ["string"],
  "senses": [
    {
      "partOfSpeech": "string",
      "meaning": "string",
      "level": "A1|A2|B1|B2|C1|C2",
      "examples": ["string"]
    }
  ],
  "synonyms": ["string"],
  "antonyms": ["string"],
  "collocations": ["string"],
  "phrasalVerbs": ["string"],
  "note": "string"
}

Rules:
- Input word: "${word}"
- Meaning language: ${targetLanguage}
- senses must contain at least 2 items
- each sense must include examples with at least 1 sentence`;

    let dictionaryData: DictionaryDetail;

    try {
      dictionaryData = await this.generateDictionaryDataFromPrompt(prompt, word);

      if (!this.isDictionaryDetailUseful(dictionaryData)) {
        this.logger.warn(
          `Dictionary data is too empty for word "${word}", retrying with strict prompt`,
        );
        dictionaryData = await this.generateDictionaryDataFromPrompt(
          strictPrompt,
          word,
        );
      }

      if (!this.isDictionaryDetailUseful(dictionaryData)) {
        const fallbackData = await this.fetchDictionaryFromPublicApi(
          word,
          targetLanguage,
        );
        if (fallbackData) {
          this.logger.warn(
            `Using dictionaryapi.dev fallback for word "${word}"`,
          );
          dictionaryData = fallbackData;
        } else {
          throw new BadRequestException('Dictionary data is empty after retry');
        }
      }
    } catch (error) {
      this.logger.error(`Error in dictionary generation: ${error.message}`, error.stack);
      const fallbackData = await this.fetchDictionaryFromPublicApi(
        word,
        targetLanguage,
      );
      if (fallbackData) {
        this.logger.warn(`Recovered dictionary data from fallback for "${word}"`);
        dictionaryData = fallbackData;
      } else {
        throw new BadRequestException('Failed to generate dictionary data');
      }
    }

    const pronunciation = await this.generateVocabularyAudio({
      text: word,
      voiceName: dto.voiceName,
      languageCode: dto.languageCode,
    });

    return {
      word,
      dictionary: dictionaryData,
      pronunciation: {
        audioUrl: pronunciation.audioUrl,
        mimeType: pronunciation.mimeType,
        model: pronunciation.model,
        key: pronunciation.key,
      },
    };
  }

  private wrapPcm16ToWav(
    pcmBuffer: Buffer<ArrayBufferLike>,
    sampleRate: number,
    channels: number,
  ): Buffer<ArrayBufferLike> {
    const bitsPerSample = 16;
    const byteRate = (sampleRate * channels * bitsPerSample) / 8;
    const blockAlign = (channels * bitsPerSample) / 8;
    const wavHeader = Buffer.alloc(44);

    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16); // PCM fmt chunk size
    wavHeader.writeUInt16LE(1, 20); // PCM format
    wavHeader.writeUInt16LE(channels, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(byteRate, 28);
    wavHeader.writeUInt16LE(blockAlign, 32);
    wavHeader.writeUInt16LE(bitsPerSample, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);

    return Buffer.concat([wavHeader, pcmBuffer]);
  }

  private async generateDictionaryDataFromPrompt(
    prompt: string,
    fallbackWord: string,
  ): Promise<DictionaryDetail> {
    const dictResponse = await this.genAI.models.generateContent({
      model: this.modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 700,
      } as GenerateContentConfig,
    });

    const rawText = (dictResponse.text || '{}').trim();
    const parsed = await this.parseGeminiJson(rawText);

    const sensesRaw = Array.isArray(parsed?.senses) ? parsed.senses : [];
    const senses: DictionarySense[] = sensesRaw.map((s: any) => ({
      partOfSpeech: String(s?.partOfSpeech || ''),
      meaning: String(s?.meaning || ''),
      level: s?.level ? String(s.level) : undefined,
      examples: Array.isArray(s?.examples)
        ? s.examples.map((e: unknown) => String(e))
        : [],
    }));

    return {
      word: String(parsed?.word || fallbackWord),
      ipa: {
        uk: String(parsed?.ipa?.uk || ''),
        us: String(parsed?.ipa?.us || ''),
      },
      phoneticSpelling: String(parsed?.phoneticSpelling || ''),
      syllables: Array.isArray(parsed?.syllables)
        ? parsed.syllables.map((x: unknown) => String(x))
        : [],
      senses,
      synonyms: Array.isArray(parsed?.synonyms)
        ? parsed.synonyms.map((x: unknown) => String(x))
        : [],
      antonyms: Array.isArray(parsed?.antonyms)
        ? parsed.antonyms.map((x: unknown) => String(x))
        : [],
      collocations: Array.isArray(parsed?.collocations)
        ? parsed.collocations.map((x: unknown) => String(x))
        : [],
      phrasalVerbs: Array.isArray(parsed?.phrasalVerbs)
        ? parsed.phrasalVerbs.map((x: unknown) => String(x))
        : [],
      note: String(parsed?.note || ''),
    };
  }

  private isDictionaryDetailUseful(data: DictionaryDetail): boolean {
    const hasIpa = Boolean(data.ipa.uk || data.ipa.us);
    const validSenses = data.senses.filter(
      (s) => s.partOfSpeech.trim() && s.meaning.trim(),
    );
    const hasExamples = validSenses.some((s) => s.examples.length > 0);
    return hasIpa || (validSenses.length > 0 && hasExamples);
  }

  private async fetchDictionaryFromPublicApi(
    word: string,
    targetLanguage: string,
  ): Promise<DictionaryDetail | null> {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      );

      if (!res.ok) {
        return null;
      }

      const payload = (await res.json()) as any[];
      const entry = Array.isArray(payload) ? payload[0] : null;
      if (!entry) {
        return null;
      }

      const phonetics = Array.isArray(entry.phonetics) ? entry.phonetics : [];
      const textPhonetics = phonetics
        .map((p: any) => String(p?.text || '').trim())
        .filter(Boolean);
      const ipaText = textPhonetics[0] || '';

      const meaningBlocks = Array.isArray(entry.meanings) ? entry.meanings : [];
      const senses: DictionarySense[] = [];
      const synonymsSet = new Set<string>();
      const antonymsSet = new Set<string>();

      for (const block of meaningBlocks) {
        const pos = String(block?.partOfSpeech || '').trim();
        const definitions = Array.isArray(block?.definitions)
          ? block.definitions
          : [];

        for (const def of definitions.slice(0, 2)) {
          const meaning = String(def?.definition || '').trim();
          const example = String(def?.example || '').trim();
          if (!meaning) continue;

          const sense: DictionarySense = {
            partOfSpeech: pos || 'unknown',
            meaning,
            examples: example ? [example] : [],
          };
          senses.push(sense);

          const syns = Array.isArray(def?.synonyms) ? def.synonyms : [];
          const ants = Array.isArray(def?.antonyms) ? def.antonyms : [];
          for (const s of syns) {
            const v = String(s || '').trim();
            if (v) synonymsSet.add(v);
          }
          for (const a of ants) {
            const v = String(a || '').trim();
            if (v) antonymsSet.add(v);
          }
        }
      }

      const limitedSenses = senses.slice(0, 4);
      if (limitedSenses.length === 0) {
        return null;
      }

      return {
        word: String(entry.word || word),
        ipa: {
          uk: ipaText,
          us: ipaText,
        },
        phoneticSpelling: ipaText.replace(/[\/]/g, ''),
        syllables: [],
        senses: limitedSenses,
        synonyms: Array.from(synonymsSet).slice(0, 8),
        antonyms: Array.from(antonymsSet).slice(0, 8),
        collocations: [],
        phrasalVerbs: [],
        note:
          targetLanguage.toLowerCase() === 'en'
            ? 'Fallback dictionary source: dictionaryapi.dev'
            : 'Fallback dictionary source: dictionaryapi.dev (definitions may be in English).',
      };
    } catch (error) {
      this.logger.warn(
        `Fallback dictionary fetch failed for "${word}": ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  private async parseGeminiJson(rawText: string): Promise<any> {
    const directText = rawText.trim();

    try {
      return JSON.parse(directText);
    } catch {
      // Continue with normalization steps below.
    }

    // Remove markdown fences if model accidentally returns them.
    let cleaned = directText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Normalize smart quotes and invisible control chars.
    cleaned = cleaned
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u0000-\u0019]+/g, ' ')
      .trim();

    // Keep only the JSON object body if extra text is present.
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    // Convert single-quoted keys/values and remove trailing commas.
    cleaned = cleaned
      // Quote unquoted keys: { word: "x" } -> { "word": "x" }
      .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_\-]*)(\s*:)/g, '$1"$2"$3')
      .replace(/([{,]\s*)'([^'\\]+)'\s*:/g, '$1"$2":')
      .replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ': "$1"')
      .replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(cleaned);
    } catch {
      // Fallback: ask Gemini to repair malformed JSON into strict JSON.
      const repaired = await this.repairJsonWithGemini(cleaned);
      try {
        return JSON.parse(repaired);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new BadRequestException(`Failed to parse dictionary JSON: ${message}`);
      }
    }
  }

  private async repairJsonWithGemini(brokenJson: string): Promise<string> {
    const prompt = `Convert the following malformed JSON into valid strict JSON.
Rules:
- Return JSON only.
- Use double-quoted property names.
- Do not add explanation.

Malformed JSON:
${brokenJson}`;

    const repaired = await this.genAI.models.generateContent({
      model: this.modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0,
        maxOutputTokens: 800,
      } as GenerateContentConfig,
    });

    return (repaired.text || '{}').trim();
  }
}
