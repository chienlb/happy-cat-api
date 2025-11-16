import {
  Controller,
  Delete,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Body, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/schema/user.schema';
import {
  LessonStatus,
  LessonLevel,
  LessonSkill,
  LessonType,
} from './schema/lesson.schema';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiBody({
    description: 'Create a new lesson',
    type: CreateLessonDto,
    examples: {
      normal: {
        summary: 'Example of a normal lesson',
        value: {
          title: 'Lesson 1',
          slug: 'lesson-1',
          description: 'Description of the lesson',
          type: LessonType.VOCABULARY,
          level: LessonLevel.A1,
          orderIndex: 1,
          unit: 'unit-1',
          topic: 'Topic 1',
          skillFocus: LessonSkill.VOCABULARY,
          content: {
            vocabulary: {
              words: ['word-1', 'word-2'],
              definitions: ['definition-1', 'definition-2'],
              images: ['image-1', 'image-2'],
              audioFiles: ['audio-file-1', 'audio-file-2'],
            },
          },
          locked: false,
          estimatedDuration: 10,
          materials: ['material-1', 'material-2'],
          thumbnail: 'thumbnail-1',
          audioIntro: 'audio-intro-1',
          videoIntro: 'video-intro-1',
          tags: ['tag-1', 'tag-2'],
          isActive: LessonStatus.ACTIVE,
          createdBy: '669340000000000000000000',
          updatedBy: '669340000000000000000000',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The lesson has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createLessonDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getLessonById(@Param('id') id: string) {
    return this.lessonsService.findLessonById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'The lessons have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getAllLessons(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.lessonsService.findAllLessons();
  }

  @Get(':id/unit')
  @ApiOperation({ summary: 'Get a lesson by unit ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getLessonByUnitId(@Param('id') id: string) {
    return this.lessonsService.findLessonsByUnitId(id);
  }

  @Get(':id/user')
  @ApiOperation({ summary: 'Get a lesson by user ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getLessonByUserId(@Param('id') id: string) {
    return this.lessonsService.findLessonsByUserId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lesson by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiBody({ description: 'Update a lesson', type: UpdateLessonDto })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  updateLessonById(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(id, updateLessonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  deleteLessonById(@Param('id') id: string) {
    return this.lessonsService.deleteLesson(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a lesson by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson',
    type: String,
    example: '669340000000000000000000',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully restored.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  restoreLessonById(@Param('id') id: string) {
    return this.lessonsService.restoreLesson(id);
  }
}
