import {
  Controller,
  Delete,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Post,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
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
import { PaginationDto } from '../pagination/pagination.dto';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    summary:
      'Create a new lesson (form-data + thumbnail, audioIntro, videoIntro, materials, content files)',
  })
  @ApiBody({
    description: 'Create a new lesson',
    type: CreateLessonDto,
    examples: {
      normal: {
        summary: 'Example of a normal lesson',
        value: {
          title: 'Lesson 1: Greetings',
          slug: 'lesson-1-greetings',
          description: 'Learn basic greetings and introductions',
          type: LessonType.VOCABULARY,
          level: LessonLevel.A1,
          orderIndex: 1,
          unit: '507f1f77bcf86cd799439011',
          content: {
            vocabulary: {
              description: 'Basic greetings vocabulary',
              words: [
                { word: 'hello', definition: 'xin chào' },
                { word: 'hi', definition: 'chào' },
                { word: 'goodbye', definition: 'tạm biệt' },
              ],
              tags: ['greetings', 'basic'],
            },
            grammar: {
              description: 'Present simple tense',
              rule: 'Subject + Verb (s/es) + Object',
              examples: [
                {
                  example: 'I play football.',
                  translation: 'Tôi chơi bóng đá.',
                },
                { example: 'She reads books.', translation: 'Cô ấy đọc sách.' },
              ],
              tags: ['grammar', 'tenses'],
            },
          },
          skillFocus: LessonSkill.VOCABULARY,
          estimatedDuration: 30,
          materials: ['https://example.com/worksheet.pdf'],
          thumbnail: 'https://example.com/thumbnail.jpg',
          audioIntro: 'https://example.com/intro.mp3',
          videoIntro: 'https://example.com/intro.mp4',
          tags: ['A1', 'greetings', 'vocabulary'],
          isActive: LessonStatus.ACTIVE,
          createdBy: '507f1f77bcf86cd799439011',
          updatedBy: '507f1f77bcf86cd799439011',
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
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFiles() files?: any[],
  ) {
    const thumbnail = files?.find((f) => f.fieldname === 'thumbnail');
    const audioIntro = files?.find((f) => f.fieldname === 'audioIntro');
    const videoIntro = files?.find((f) => f.fieldname === 'videoIntro');
    const materialsFiles =
      files?.filter((f) => f.fieldname === 'materials') ?? [];
    const contentSongsAudio = files?.find(
      (f) => f.fieldname === 'content_songs_audio',
    );
    const contentSongsVideo = files?.find(
      (f) => f.fieldname === 'content_songs_video',
    );
    const contentSongsVocabularyImage =
      files?.filter((f) => f.fieldname === 'content_songs_vocabulary_image') ??
      [];
    const contentSongsVocabularyAudio =
      files?.filter((f) => f.fieldname === 'content_songs_vocabulary_audio') ??
      [];
    return this.lessonsService.createLesson(createLessonDto, undefined, {
      thumbnail,
      audioIntro,
      videoIntro,
      materialsFiles,
      contentSongsAudio,
      contentSongsVideo,
      contentSongsVocabularyImage,
      contentSongsVocabularyAudio,
    });
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
  getAllLessons(@Query() paginationDto: PaginationDto) {
    return this.lessonsService.findAllLessons(paginationDto);
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
