import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LessonPrgressService } from './lesson-progress.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateLessonPrgressDto } from './dto/create-lesson-progress.dto';
import { LessonPrgressDocument } from './schema/lesson-progress.schema';
import { UpdateLessonPrgressDto } from './dto/update-lesson-progress.dto';
import { PaginationDto } from '../pagination/pagination.dto';

@Controller('lesson-prgress')
@ApiTags('Lesson Prgress')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LessonPrgressController {
  constructor(private readonly lessonPrgressService: LessonPrgressService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson prgress' })
  @ApiBody({
    type: CreateLessonPrgressDto,
    description: 'Create lesson prgress data',
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
    description: 'Lesson prgress created successfully',
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
  async createLessonPrgress(
    @Body() createLessonPrgressDto: CreateLessonPrgressDto,
  ): Promise<LessonPrgressDocument> {
    return await this.lessonPrgressService.createLessonPrgress(createLessonPrgressDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all lesson prgress by user id' })
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
    description: 'Lesson prgress fetched successfully',
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
  async getLessonPrgressByUserId(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    data: LessonPrgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    return await this.lessonPrgressService.findLessonPrgressByUserId(userId, paginationDto);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all lesson prgress by lesson id' })
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
    description: 'Lesson prgress fetched successfully',
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
  async getLessonPrgressByLessonId(
    @Param('lessonId') lessonId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    data: LessonPrgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    return await this.lessonPrgressService.findLessonPrgressByLessonId(lessonId, paginationDto);
  }

  @Put(':lessonId')
  @ApiOperation({ summary: 'Update a lesson prgress' })
  @ApiBody({
    type: UpdateLessonPrgressDto,
    description: 'Update lesson prgress data',
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
    description: 'Lesson prgress updated successfully',
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
  async updateLessonPrgress(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonPrgressDto: UpdateLessonPrgressDto,
  ): Promise<LessonPrgressDocument> {
    return await this.lessonPrgressService.updateLessonPrgress(lessonId, updateLessonPrgressDto);
  }

  @Delete(':lessonId')
  @ApiOperation({ summary: 'Delete a lesson prgress' })
  @ApiResponse({
    status: 200,
    description: 'Lesson prgress deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteLessonPrgress(
    @Param('lessonId') lessonId: string,
  ): Promise<void> {
    return await this.lessonPrgressService.deleteLessonPrgress(lessonId);
  }
}