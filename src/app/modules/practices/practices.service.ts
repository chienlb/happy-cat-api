import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practice, PracticeDocument, ParcticeTypes } from './schema/practice.schema';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { SubmitPracticeDto } from './dto/submit-practice.dto';
import { UsersService } from '../users/users.service';
import { PackageType } from '../packages/schema/package.schema';

@Injectable()
export class PracticesService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenAI({ apiKey });
  }

  private genAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';
  private readonly promptSentence = `
    Bạn đang tạo các bài tập dịch tiếng Anh cho học sinh lớp 1 (6–7 tuổi).

    ========================
    QUY TẮC RẤT QUAN TRỌNG
    ========================

    - Học sinh là người mới bắt đầu (A0–A1)
    - Sử dụng câu tiếng Việt RẤT ĐƠN GIẢN
    - Tiếng Anh phải RẤT DỄ HIỂU
    - Câu phải DÀI HƠN (6–10 từ)
    - Sử dụng từ vựng cơ bản
    - Không sử dụng ngữ pháp phức tạp

    ========================
    CHỦ ĐỀ
    ========================

    Bạn PHẢI tự động chọn các chủ đề ĐƠN GIẢN phù hợp với trẻ em, ví dụ:
    - động vật
    - thức ăn
    - trường học
    - gia đình
    - đồ chơi
    - màu sắc
    - các hành động hàng ngày

    Không sử dụng các chủ đề khó hoặc trừu tượng.

    ========================
    YÊU CẦU ĐẦU RA
    ========================

    Tạo {COUNT} bài tập.

    Mỗi bài tập phải bao gồm:
    - câu tiếng Việt (sentence_vi)
    - câu tiếng Anh (sentence_en)
    - câu trả lời đúng (correct_answer)
    - gợi ý (1–2 từ khóa đơn giản)
    - độ khó: luôn là "dễ"

    ========================
    ĐỊNH DẠNG ĐẦU RA (JSON CHUẨN)
    ========================

    Chỉ trả về JSON:

    {
      "items": [
        {
          "sentence_vi": "Bạn có thể giúp tôi không?",
          "sentence_en": "Can you help me?",
          "correct_answer": "Can you help me?",
          "hint": ["help"],
          "difficulty": "dễ"
        }
      ]
    }

    ========================
    QUAN TRỌNG
    ========================

    - Tiếng Việt phải tự nhiên và đơn giản
    - Tiếng Anh phải khớp chính xác
    - Sử dụng các mẫu câu lặp lại:
      - Tôi thấy...
      - Tôi có...
      - Đây là...
      - Tôi thích...
    - KHÔNG trả về văn bản ngoài JSON
    - KHÔNG tạo câu dài dòng
    - Giữ mọi thứ RẤT DỄ HIỂU

    Nếu không chắc chắn, hãy làm đơn giản hơn.

    Bây giờ hãy tạo kết quả.
    `;

private readonly promptDiscussion = `
    Bạn đang tạo các bài tập viết đoạn văn tiếng Anh cho học sinh lớp 1 (6–7 tuổi).

    ========================
    MỤC TIÊU CHÍNH
    ========================
    Tạo MỘT bài tập yêu cầu học sinh viết một đoạn văn ngắn mô tả một chủ đề đơn giản.

    ========================
    QUY TẮC RẤT QUAN TRỌNG
    ========================
    - Học sinh là người mới bắt đầu (A0–A1)
    - Sử dụng tiếng Việt RẤT ĐƠN GIẢN
    - Sử dụng câu ngắn (6–10 từ nếu có thể)
    - Không sử dụng ngữ pháp phức tạp
    - Không sử dụng từ khó
    - Không hướng dẫn dài dòng

    ========================
    CẤU TRÚC BÀI TẬP
    ========================

    Mỗi bài tập PHẢI bao gồm:

    1. tình huống (situation)
    - đơn giản và rõ ràng
    - 1–2 câu ngắn
    - mô tả tình huống thực tế cho trẻ em

    2. yêu cầu (requirements)
    - 3–4 gạch đầu dòng
    - rất ngắn và dễ hiểu

    3. hướng dẫn (instruction)
    - một câu đơn giản

    4. gợi ý (hints)
    - các mẫu câu đơn giản

    ========================
    CHỦ ĐỀ
    ========================

    Chỉ sử dụng các chủ đề thân thiện với trẻ em:
    - thú cưng
    - đồ chơi
    - trường học
    - bạn bè
    - giáo viên
    - gia đình
    - thức ăn

    ========================
    YÊU CẦU ĐẦU RA
    ========================

    Trả về:
    - tiêu đề (title)
    - tình huống (situation)
    - yêu cầu (requirements)
    - hướng dẫn (instruction)
    - gợi ý (hints)
    - từ khóa chủ đề bắt buộc (required_topic_keywords)
    - số câu tối thiểu (minimum_sentences)
    - đoạn văn mẫu (sample_paragraph_vi, sample_paragraph_en)
    - độ khó (difficulty)

    ========================
    ĐỊNH DẠNG ĐẦU RA (JSON CHUẨN)
    ========================

    Chỉ trả về JSON:

    {
      "title": "Mô tả trường học của bạn",
      "situation": "Bạn đi học mỗi ngày. Bạn muốn kể cho bạn bè về trường của mình.",
      "requirements": [
        "Nói tên trường của bạn",
        "Nói trường của bạn lớn hay nhỏ",
        "Nói bạn thích gì ở trường",
        "Nói bạn học gì ở trường"
      ],
      "instruction": "Viết một đoạn văn ngắn mô tả trường học của bạn.",
      "hints": [
        "Trường của tôi tên là ABC.",
        "Nó lớn và đẹp.",
        "Tôi học tiếng Anh ở đó.",
        "Tôi thích bạn bè của tôi."
      ],
      "required_topic_keywords": ["trường học", "mô tả"],
      "minimum_sentences": 7,
      "sample_paragraph_vi": "Tôi đi học mỗi ngày. Trường của tôi tên là An Binh. Nó lớn và có nhiều phòng học. Tôi học tiếng Anh và Toán. Tôi thích bạn bè và giáo viên của mình ở trường. Trường của tôi rất đẹp và tôi yêu nó.",
      "sample_paragraph_en": "I go to school every day. My school is called An Binh. It is big and has many classrooms. I study English and Math. I like my friends and teachers at school. My school is very beautiful and I love it.",
      "difficulty": "dễ"
    }

    ========================
    QUAN TRỌNG
    ========================

    - Mọi thứ phải bằng TIẾNG VIỆT và TIẾNG ANH
    - Giữ mọi thứ RẤT ĐƠN GIẢN
    - Tình huống phải rõ ràng và thực tế
    - Đoạn văn mẫu phải từ 7–10 câu ngắn
    - Sử dụng từ dễ hiểu
    - KHÔNG trả về văn bản ngoài JSON
    - KHÔNG giải thích bất kỳ điều gì

    Nếu không chắc chắn, hãy làm đơn giản hơn.

    Bây giờ hãy tạo kết quả.
    `;

private readonly promptLetter = `
    Bạn đang tạo các bài tập viết thư tiếng Anh cho học sinh lớp 1 (6–7 tuổi).

    ========================
    MỤC TIÊU CHÍNH
    ========================
    Tạo MỘT bài tập viết thư chi tiết nhưng dễ dàng bằng TIẾNG VIỆT THÂN THIỆN.

    ========================
    QUY TẮC RẤT QUAN TRỌNG
    ========================
    - Học sinh là người mới bắt đầu (A0–A1)
    - Sử dụng tiếng Việt RẤT ĐƠN GIẢN
    - Sử dụng câu ngắn (6–10 từ nếu có thể)
    - Không sử dụng ngữ pháp phức tạp
    - Không sử dụng từ khó
    - Không hướng dẫn dài dòng

    ========================
    CẤU TRÚC BÀI TẬP
    ========================

    Mỗi bài tập PHẢI bao gồm:

    1. tình huống (situation)
    - đơn giản và rõ ràng
    - 1–2 câu ngắn
    - mô tả tình huống thực tế cho trẻ em

    2. yêu cầu (requirements)
    - 4–5 gạch đầu dòng
    - rất ngắn và dễ hiểu

    3. hướng dẫn (instruction)
    - một câu đơn giản

    4. gợi ý (hints)
    - các mẫu câu đơn giản

    ========================
    CHỦ ĐỀ
    ========================

    Chỉ sử dụng các chủ đề thân thiện với trẻ em:
    - thú cưng
    - đồ chơi
    - trường học
    - bạn bè
    - giáo viên
    - gia đình
    - thức ăn

    ========================
    YÊU CẦU ĐẦU RA
    ========================

    Trả về:
    - tiêu đề (title)
    - tình huống (situation)
    - yêu cầu (requirements)
    - hướng dẫn (instruction)
    - gợi ý (hints)
    - từ khóa chủ đề bắt buộc (required_topic_keywords)
    - số câu tối thiểu (minimum_sentences)
    - câu trả lời mẫu (sample_answer)
    - độ khó (difficulty)

    ========================
    ĐỊNH DẠNG ĐẦU RA (JSON CHUẨN)
    ========================

    Chỉ trả về JSON:

    {
      "title": "Viết về con mèo của bạn",
      "situation": "Bạn có một con mèo mới. Bạn rất vui và muốn kể cho bạn bè.",
      "requirements": [
        "Nói bạn có gì",
        "Nói bạn thích nó",
        "Nói màu sắc của nó",
        "Nói nó có thể làm gì",
        "Hỏi một câu đơn giản"
      ],
      "instruction": "Viết một bức thư ngắn cho bạn bè.",
      "hints": [
        "Thân gửi ... ,",
        "Tôi có một con mèo.",
        "Nó nhỏ và màu trắng.",
        "Nó có thể chạy nhanh.",
        "Tôi thích nó.",
        "Bạn có thích mèo không?"
      ],
      "required_topic_keywords": ["mèo", "bạn bè"],
      "minimum_sentences": 8,
      "sample_answer": "Thân gửi Nam,\nTôi có một con mèo mới. Nó nhỏ và màu trắng. Nó có thể chạy nhanh. Tôi chơi với nó mỗi ngày. Tôi rất thích con mèo của mình. Bạn có thích mèo không?\nThân ái, Lan",
      "difficulty": "dễ"
    }

    ========================
    QUAN TRỌNG
    ========================

    - Mọi thứ phải bằng TIẾNG VIỆT
    - Giữ mọi thứ RẤT ĐƠN GIẢN
    - Tình huống phải rõ ràng và thực tế
    - Câu trả lời mẫu phải từ 8–10 câu ngắn
    - Sử dụng từ dễ hiểu
    - KHÔNG trả về văn bản ngoài JSON
    - KHÔNG giải thích bất kỳ điều gì

    Nếu không chắc chắn, hãy làm đơn giản hơn.

    Bây giờ hãy tạo kết quả.
    `;

private buildFeedbackPrompt(practice: Practice, studentWriting: string): string {
    return `
      Bạn là một giáo viên tiếng Anh. Hãy chấm điểm bài viết của học sinh dựa trên các tiêu chí sau:

      ========================
      TIÊU CHÍ CHẤM ĐIỂM
      ========================

      1. Độ phù hợp với chủ đề (relevance_score):
         - 10: Hoàn toàn phù hợp
         - 5: Phần lớn phù hợp
         - 0: Không phù hợp

      2. Ngôn ngữ (language_score):
         - 10: Không có lỗi ngữ pháp, từ vựng phong phú
         - 5: Một vài lỗi nhỏ, từ vựng cơ bản
         - 0: Nhiều lỗi nghiêm trọng

      3. Độ đầy đủ (completeness_score):
         - 10: Đầy đủ ý, rõ ràng
         - 5: Thiếu một vài ý
         - 0: Thiếu nhiều ý

      ========================
      YÊU CẦU ĐẦU RA
      ========================

      Trả về JSON với định dạng sau:

      {
        "score": <Tổng điểm>,
        "relevance_score": <Điểm độ phù hợp>,
        "language_score": <Điểm ngôn ngữ>,
        "completeness_score": <Điểm độ đầy đủ>,
        "off_topic": <true | false>,
        "comments": "<Nhận xét chi tiết>",
        "corrections": [<Các chỉnh sửa cần thiết>],
        "encouragement": "<Lời động viên>"
      }

      ========================
      BÀI VIẾT CỦA HỌC SINH
      ========================

      Bài viết của học sinh bao gồm nhiều câu, mỗi câu được phân tách bằng \n. Hãy đánh giá từng câu riêng biệt và đảm bảo rằng:
      - Mỗi câu được so sánh với bài tập tương ứng.
      - Nếu đánh giá là "không sát chủ đề", hãy giải thích lý do cụ thể.

      ${studentWriting}

      ========================
      BÀI TẬP
      ========================

      ${JSON.stringify(practice.exercise)}

      Hãy chấm điểm và đưa ra nhận xét chi tiết, lời động viên để học sinh cải thiện.
    `;
  }

  async create(createPracticeDto: CreatePracticeDto): Promise<Practice> {
    const hasExercise =
      createPracticeDto.exercise !== undefined && createPracticeDto.exercise !== null;

    if (!hasExercise) {
      return this.createSentenceWithAI(createPracticeDto);
    }

    const createdPractice = new this.practiceModel({
      studentId: createPracticeDto.studentId,
      type: createPracticeDto.type,
      exercise: createPracticeDto.exercise,
      studentWriting: createPracticeDto.studentWriting,
    });
    return createdPractice.save();
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }
    return practice;
  }

  async update(id: string, updatePracticeDto: UpdatePracticeDto): Promise<Practice> {
    const updatedPractice = await this.practiceModel
      .findByIdAndUpdate(id, updatePracticeDto, { new: true })
      .exec();

    if (!updatedPractice) {
      throw new NotFoundException('Practice not found');
    }
    return updatedPractice;
  }

  async submit(id: string, submitPracticeDto: SubmitPracticeDto): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    await this.assertVipForAiWriting(practice.studentId);

    const aiFeedback = await this.generateFeedbackByType(practice, submitPracticeDto.studentWriting);

    practice.studentWriting = submitPracticeDto.studentWriting;
    practice.AIFeedback = aiFeedback;

    return practice.save();
  }

  private async assertVipForAiWriting(studentId: string): Promise<void> {
    const user = await this.usersService.findUserById(studentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.accountPackage !== PackageType.PREMIUM) {
      throw new ForbiddenException(
        'Tinh nang luyen viet voi AI chi danh cho tai khoan PREMIUM.',
      );
    }
  }

  async remove(id: string): Promise<Practice> {
    const deletedPractice = await this.practiceModel.findByIdAndDelete(id).exec();
    if (!deletedPractice) {
      throw new NotFoundException('Practice not found');
    }
    return deletedPractice;
  }

  async createSentenceWithAI(practiceData: Partial<Practice>): Promise<Practice> {
    const chat = this.genAI.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: this.getPromptByType(practiceData.type).replace('{COUNT}', '5'),
        maxOutputTokens: 99999,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const exerciseGuide =
      typeof practiceData.exercise === 'string' ? practiceData.exercise.trim() : '';
    const result = await chat.sendMessage({
      message: exerciseGuide
        ? `Generate beginner English practice items. Student request: ${exerciseGuide}`
        : 'Generate beginner English practice items automatically. Choose kid-friendly topics yourself.',
    });

    let aiResult: { items: unknown[] };
    try {
      aiResult = this.extractJsonFromResult(result.text || '');
    } catch {
      const retryResult = await chat.sendMessage({
        message:
          'Return strict JSON only. No markdown. Use this exact shape: {"items":[...]}',
      });

      try {
        aiResult = this.extractJsonFromResult(retryResult.text || '');
      } catch {
        aiResult = this.getFallbackExerciseItems(practiceData.type);
      }
    }

    const createdPractice = new this.practiceModel({
      studentId: practiceData.studentId,
      type: practiceData.type,
      exercise: aiResult,
      studentWriting: practiceData.studentWriting,
    });

    return createdPractice.save();
  }

  private getPromptByType(type?: string): string {
    switch (type) {
      case ParcticeTypes.LETTER:
        return this.promptLetter;
      case ParcticeTypes.DISCUSSION:
        return this.promptDiscussion;
      case ParcticeTypes.SENTENCES:
      default:
        return this.promptSentence;
    }
  }

  private async generateFeedbackByType(
    practice: Practice,
    studentWriting: string,
  ): Promise<Record<string, unknown>> {
    const feedbackPrompt = this.buildFeedbackPrompt(practice, studentWriting);

    const chat = this.genAI.chats.create({
      model: this.modelName,
      config: {
        maxOutputTokens: 90000, // Tăng giới hạn token để đảm bảo đầu ra dài hơn
        temperature: 0.7, // Tăng tính ngẫu nhiên để nhận xét đa dạng hơn
        responseMimeType: 'application/json',
      },
    });

    try {
      const result = await chat.sendMessage({ message: feedbackPrompt });
      const parsed = this.extractJsonObject(result.text || '');

      if (!('score' in parsed) || !('comments' in parsed)) {
        throw new BadRequestException('Invalid feedback structure from Gemini');
      }

      // Chuyển đổi thang điểm sang 100 và đảm bảo nhận xét dài hơn
      parsed.score = (Number(parsed.score) || 0) * 10;
      parsed.relevance_score = (Number(parsed.relevance_score) || 0) * 10;
      parsed.language_score = (Number(parsed.language_score) || 0) * 10;
      parsed.completeness_score = (Number(parsed.completeness_score) || 0) * 10;

      // Ensure all scores are numbers before summing
      parsed.total_score = (Number(parsed.score) || 0) + (Number(parsed.relevance_score) || 0) + (Number(parsed.language_score) || 0) + (Number(parsed.completeness_score) || 0);

      // Ensure comments are split into multiple sentences for clarity
      parsed.comments = parsed.comments || 'Bài viết của bạn cần sát với chủ đề hơn.\nHãy cố gắng viết đúng yêu cầu và sử dụng các câu đơn giản.\nVí dụ: "Tôi thấy một con mèo lớn màu đen."';
      parsed.comments += '\nBài viết cần thêm chi tiết và ví dụ cụ thể để làm rõ ý hơn.\nHãy thử viết thêm về cảm xúc hoặc lý do bạn thích các hoạt động này.';

      parsed.encouragement = parsed.encouragement || 'Bạn đã làm tốt khi cố gắng viết.\nHãy tiếp tục luyện tập và sử dụng các câu ngắn, đơn giản để cải thiện bài viết của mình.';
      parsed.encouragement += '\nĐừng ngại thử thêm các câu mô tả chi tiết hơn để làm bài viết sinh động hơn.';

      return this.normalizeFeedbackScore(parsed, practice, studentWriting);
    } catch {
      return {
        score: 30,
        relevance_score: 10,
        language_score: 10,
        completeness_score: 10,
        off_topic: true,
        comments: 'Bài viết của bạn không sát với chủ đề. Hãy trả lời đúng yêu cầu của bài tập. Bài viết cần thêm chi tiết và ví dụ cụ thể để làm rõ ý hơn.',
        corrections: [],
        encouragement: 'Hãy thử lại. Bạn có thể làm được với các câu ngắn và đơn giản. Đừng ngại thử thêm các câu mô tả chi tiết hơn để làm bài viết sinh động hơn.',
      };
    }
  }

  private normalizeFeedbackScore(
    parsed: Record<string, unknown>,
    practice: Practice,
    studentWriting: string,
  ): Record<string, unknown> {
    const normalized = { ...parsed };

    const rawScore = Number(normalized.score);
    const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(10, Math.round(rawScore))) : 0;
    normalized.score = score;

    const exerciseText = this.collectExerciseText(practice.exercise).toLowerCase();
    const writingText = studentWriting.toLowerCase();
    const topicKeywords = this.extractKeywords(exerciseText);
    const keywordHit = topicKeywords.filter((word) => writingText.includes(word)).length;
    const offTopic = topicKeywords.length > 0 && keywordHit === 0;

    if (offTopic) {
      normalized.off_topic = true;
      normalized.score = Math.min(score, 3);
      normalized.relevance_score = 0;

      const existingComments =
        typeof normalized.comments === 'string' && normalized.comments.trim().length > 0
          ? normalized.comments
          : 'Your writing is not on the exercise topic.';
      normalized.comments = `${existingComments} Please write about the required topic.`;
    }

    const words = writingText.split(/\s+/).filter(Boolean).length;
    if (words < 8) {
      normalized.score = Math.min(Number(normalized.score) || 0, 5);
      if (!normalized.comments) {
        normalized.comments = 'Your answer is too short. Add more simple sentences.';
      }
    }

    return normalized;
  }

  private collectExerciseText(exercise: unknown): string {
    const parts: string[] = [];

    const visit = (node: unknown): void => {
      if (typeof node === 'string') {
        parts.push(node);
        return;
      }

      if (Array.isArray(node)) {
        for (const item of node) {
          visit(item);
        }
        return;
      }

      if (node && typeof node === 'object') {
        for (const value of Object.values(node as Record<string, unknown>)) {
          visit(value);
        }
      }
    };

    visit(exercise);
    return parts.join(' ');
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'this', 'that', 'have', 'your', 'about', 'write', 'short',
      'letter', 'easy', 'say', 'you', 'are', 'was', 'is', 'to', 'a', 'an', 'of', 'in', 'on',
      'my', 'it', 'do', 'what', 'one', 'new', 'very', 'today', 'want', 'tell', 'friend',
    ]);

    const words = text.match(/[a-z]{3,}/g) ?? [];
    const unique = Array.from(new Set(words.filter((word) => !stopWords.has(word))));
    return unique.slice(0, 15);
  }

  private extractJsonFromResult(rawText: string): { items: unknown[] } {
    const clean = rawText.trim();
    const blockMatch = clean.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = blockMatch?.[1]?.trim() || clean;

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new BadRequestException('Gemini response does not include a valid items array');
      }
      return parsed;
    } catch {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new BadRequestException('Gemini response is not valid JSON');
      }

      const slicedJson = jsonText.slice(start, end + 1);
      const parsed = JSON.parse(slicedJson);
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new BadRequestException('Gemini response does not include a valid items array');
      }
      return parsed;
    }
  }

  private extractJsonObject(rawText: string): Record<string, unknown> {
    const clean = rawText.trim();
    const blockMatch = clean.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = blockMatch?.[1]?.trim() || clean;

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        throw new BadRequestException('Gemini response is not a valid JSON object');
      }
      return parsed as Record<string, unknown>;
    } catch {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new BadRequestException('Gemini response is not valid JSON');
      }

      const slicedJson = jsonText.slice(start, end + 1);
      const parsed = JSON.parse(slicedJson);
      if (!parsed || typeof parsed !== 'object') {
        throw new BadRequestException('Gemini response is not a valid JSON object');
      }
      return parsed as Record<string, unknown>;
    }
  }

  private getFallbackExerciseItems(type?: string): { items: unknown[] } {
    if (type === ParcticeTypes.LETTER) {
      return {
        items: [
          {
            title: 'Write a letter about your dad',
            situation: 'Your dad helped you at home. You want to write a letter to thank him.',
            requirements: [
              'Say your name',
              'Say why you are happy',
              'Say one thing your dad does',
              'Say thank you',
              'Ask one simple question',
            ],
            instruction: 'Write a short letter to your dad using 6 simple sentences.',
            hints: [
              'Dear Dad,',
              'My name is ...',
              'You help me ...',
              'I am happy because ...',
              'Thank you for ...',
              'Love, ...',
            ],
            required_topic_keywords: ['dad', 'thank', 'help'],
            minimum_sentences: 6,
            sample_answer:
              'Dear Dad,\nMy name is Lan. You help me with homework. You cook food for me. I am happy today. Thank you for your help. Do you like my letter?\nLove, Lan',
            difficulty: 'easy',
          },
        ],
      };
    }

    return {
      items: [
        {
          sentence_vi: 'Toi thay mot con meo',
          correct_answer: 'I see a cat',
          hint: ['cat'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Toi co mot qua tao',
          correct_answer: 'I have an apple',
          hint: ['apple'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Day la mau do',
          correct_answer: 'This is red',
          hint: ['red'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Toi thich sua',
          correct_answer: 'I like milk',
          hint: ['milk'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Day la me toi',
          correct_answer: 'This is my mom',
          hint: ['mom'],
          difficulty: 'easy',
        },
      ],
    };
  }

  async getAllPracticesByStudentId(studentId: string): Promise<Practice[]> {
    try {
      return await this.practiceModel.find({ studentId }).populate('studentId', 'fullname email').exec();
    } catch (error) {
      throw new Error('Failed to get practices by student id: ' + error.message);
    }
  }

}