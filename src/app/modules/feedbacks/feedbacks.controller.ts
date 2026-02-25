import {
  Controller,
  HttpException,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { Feedback } from './schema/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackType } from './schema/feedback.schema';

@ApiTags('Feedbacks')
@ApiBearerAuth()
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiBody({
    type: CreateFeedbackDto,
    description: 'The feedback to create',
    examples: {
      example1: {
        value: {
          userId: '1234567890',
          type: FeedbackType.GENERAL,
          title: 'Feedback title',
          content: 'Feedback content',
          rating: 5,
          relatedId: '1234567890',
          isResolved: false,
          resolvedBy: '1234567890',
          resolvedAt: new Date(),
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The feedback has been successfully created.',
    type: CreateFeedbackDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async createFeedback(
    @Req() req,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const userId = req.user.userId;
    if (!userId) {
      throw new Error("UserId is empty")
    }
    createFeedbackDto.userId = userId;
    return this.feedbacksService.createFeedback(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiQuery({
    name: 'page',
    description: 'The page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of feedbacks per page',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'The feedbacks have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async findAllFeedbacks(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{
    data: Feedback[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    return this.feedbacksService.findAllFeedbacks(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feedback',
    type: String,
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The feedback has been successfully retrieved.',
    type: Feedback,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async findFeedbackById(@Param('id') id: string): Promise<Feedback> {
    return this.feedbacksService.findFeedbackById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a feedback by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feedback',
    type: String,
    example: '1234567890',
  })
  @ApiBody({
    type: UpdateFeedbackDto,
    description: 'The feedback to update',
    examples: {
      example1: {
        value: {
          type: FeedbackType.GENERAL,
          title: 'Feedback title',
          content: 'Feedback content',
          rating: 5,
          relatedId: '1234567890',
          isResolved: false,
          resolvedBy: '1234567890',
          resolvedAt: new Date(),
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The feedback has been successfully updated.',
    type: UpdateFeedbackDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async updateFeedbackById(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbacksService.updateFeedback(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feedback by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feedback',
    type: String,
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The feedback has been successfully deleted.',
    type: Feedback,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async deleteFeedback(@Param('id') id: string): Promise<Feedback> {
    return this.feedbacksService.deleteFeedback(id);
  }
}
