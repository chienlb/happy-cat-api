import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import type { GenerateContentConfig } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { Conversation, ConversationDocument } from './schema/conversation.schema';
import { ChatDto } from './dto/chat.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';
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
1. **Ngôn ngữ đơn giản**: Dùng từ dễ hiểu, câu ngắn gọn
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
}
