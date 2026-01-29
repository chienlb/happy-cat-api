import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse as ApiResponseSwagger, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chat.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ok } from '../../common/response/api-response';

@ApiTags('Chatbot')
@Controller('chatbot')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Uncomment nếu bạn có JwtAuthGuard
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện mới' })
  @ApiResponseSwagger({ status: 201, description: 'Cuộc trò chuyện đã được tạo' })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req: any,
  ) {
    // Lấy userId từ req.user (từ JWT token)
    const userId = req.user?.id || req.user?._id || 'test-user-id'; // Fallback cho test
    
    const conversation = await this.chatbotService.createConversation(
      userId,
      createConversationDto,
    );

    return ok(
      conversation,
      'Conversation created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Lấy danh sách cuộc trò chuyện' })
  @ApiResponseSwagger({ status: 200, description: 'Danh sách cuộc trò chuyện' })
  async getConversations(@Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'test-user-id';
    
    const conversations = await this.chatbotService.getConversations(userId);

    return ok(
      conversations,
      'Conversations retrieved successfully',
    );
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Lấy chi tiết cuộc trò chuyện' })
  @ApiResponseSwagger({ status: 200, description: 'Chi tiết cuộc trò chuyện' })
  async getConversation(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'test-user-id';
    
    const conversation = await this.chatbotService.getConversation(userId, id);

    return ok(
      conversation,
      'Conversation retrieved successfully',
    );
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Xóa cuộc trò chuyện' })
  @ApiResponseSwagger({ status: 200, description: 'Cuộc trò chuyện đã được xóa' })
  async deleteConversation(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'test-user-id';
    
    await this.chatbotService.deleteConversation(userId, id);

    return ok(null, 'Conversation deleted successfully');
  }

  @Post('chat')
  @ApiOperation({ summary: 'Gửi tin nhắn và nhận phản hồi từ AI' })
  @ApiResponseSwagger({ status: 200, description: 'Phản hồi từ AI' })
  async chat(@Body() chatDto: ChatDto, @Req() req: any) {
    const userId = req.user?.id || req.user?._id || 'test-user-id';
    
    const result = await this.chatbotService.chat(userId, chatDto);

    return ok(result, 'Chat completed successfully');
  }

  @Post('chat/stream')
  @ApiOperation({ summary: 'Chat với streaming response (real-time)' })
  @ApiResponseSwagger({ status: 200, description: 'Streaming response từ AI' })
  async chatStream(
    @Body() chatDto: ChatDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user?.id || req.user?._id || 'test-user-id';

    // Set headers cho Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = this.chatbotService.chatStream(userId, chatDto);

      for await (const chunk of stream) {
        // Gửi chunk theo format SSE
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      // Kết thúc stream
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ error: error.message })}\n\n`,
      );
      res.end();
    }
  }
}
