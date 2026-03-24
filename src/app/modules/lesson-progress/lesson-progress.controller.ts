import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LessonProgressDocument } from './schema/lesson-progress.schema';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { logger } from 'handlebars';

@Controller('lesson-progress')
@ApiTags('Lesson Progress')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lesson progress' })
  @ApiBody({
    type: CreateLessonProgressDto,
    description: 'Create lesson progress data',
    examples: {
      example: {
        value: {
          userId: '123',
          lessonId: '123',
          progress: 50,
          status: 'completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lesson progress created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        lessonId: { type: 'string' },
        progress: { type: 'number' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createLessonProgress(
    @Body() createLessonProgressDto: CreateLessonProgressDto,
  ): Promise<LessonProgressDocument> {
    return await this.lessonProgressService.createLessonProgress(
      createLessonProgressDto,
    );
  }

    @Get('user/:lessonId')
  async getProgressByUserIdAndLessonId(
    @Req() req,
    @Param('lessonId') lessonId: string,
  ): Promise<LessonProgressDocument> {

    console.log('User ID:', req.user.userId);
    return await this.lessonProgressService.getProgressByUserIdAndLessonId(
      req.user.userId,
      lessonId,
    );
  }

  @Get('user/lessons/:userId')
  @ApiOperation({ summary: 'Get all lesson progress by user id' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit number',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress fetched successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              lessonId: { type: 'string' },
              progress: { type: 'number' },
              status: { type: 'string' },
            },
          },
        },
        total: { type: 'number' },
        totalPages: { type: 'number' },
        currentPage: { type: 'number' },
        hasNextPage: { type: 'boolean' },
        hasPreviousPage: { type: 'boolean' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getLessonProgressByUserId(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    data: LessonProgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    return await this.lessonProgressService.findLessonProgressByUserId(
      userId,
      paginationDto,
    );
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all lesson progress by lesson id' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit number',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress fetched successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              lessonId: { type: 'string' },
              progress: { type: 'number' },
              status: { type: 'string' },
            },
          },
        },
        total: { type: 'number' },
        totalPages: { type: 'number' },
        currentPage: { type: 'number' },
        hasNextPage: { type: 'boolean' },
        hasPreviousPage: { type: 'boolean' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getLessonProgressByLessonId(
    @Req() req,
    @Param('lessonId') lessonId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    data: LessonProgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    return await this.lessonProgressService.findLessonProgressByLessonId(
      lessonId,
      req.user.id,
      paginationDto,
    );
  }

  @Put(':lessonId')
  @ApiOperation({ summary: 'Update a lesson progress' })
  @ApiBody({
    type: UpdateLessonProgressDto,
    description: 'Update lesson progress data',
    examples: {
      example: {
        value: {
          progress: 50,
          status: 'completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        lessonId: { type: 'string' },
        progress: { type: 'number' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateLessonProgress(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonProgressDto: UpdateLessonProgressDto,
  ): Promise<LessonProgressDocument> {
    return await this.lessonProgressService.updateLessonProgress(
      lessonId,
      updateLessonProgressDto,
    );
  }


  @Delete(':lessonId')
  @ApiOperation({ summary: 'Delete a lesson progress' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteLessonProgress(
    @Param('lessonId') lessonId: string,
  ): Promise<void> {
    return await this.lessonProgressService.deleteLessonProgress(lessonId);
  }
}
