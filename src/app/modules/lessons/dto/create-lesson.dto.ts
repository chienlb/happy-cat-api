import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsMongoId,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  LessonType,
  LessonLevel,
  LessonSkill,
  LessonStatus,
} from '../schema/lesson.schema';

// Content DTOs
class VocabularyWordDto {
  @ApiProperty({ description: 'Word', example: 'hello' })
  @IsString()
  word: string;

  @ApiProperty({ description: 'Word definition', example: 'xin chào' })
  @IsString()
  definition: string;
}

class VocabularyContentDto {
  @ApiProperty({ description: 'Content type', example: 'vocabulary' })
  @IsString()
  type: 'vocabulary';

  @ApiProperty({
    description: 'Vocabulary description',
    example: 'Basic greetings vocabulary',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'List of vocabulary words',
    type: [VocabularyWordDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VocabularyWordDto)
  words: VocabularyWordDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['greetings', 'basic'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class GrammarExampleDto {
  @ApiProperty({ description: 'Example sentence', example: 'I am a student' })
  @IsString()
  example: string;

  @ApiProperty({ description: 'Translation', example: 'Tôi là một học sinh' })
  @IsString()
  translation: string;
}

class GrammarContentDto {
  @ApiProperty({ description: 'Content type', example: 'grammar' })
  @IsString()
  type: 'grammar';

  @ApiProperty({
    description: 'Grammar description',
    example: 'Present simple tense',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Grammar rule',
    example: 'Use present simple for habits and routines',
  })
  @IsString()
  rule: string;

  @ApiProperty({ description: 'Examples', type: [GrammarExampleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrammarExampleDto)
  examples: GrammarExampleDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['present', 'tense'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class DialogueContentDto {
  @ApiProperty({ description: 'Content type', example: 'dialogue' })
  @IsString()
  type: 'dialogue';

  @ApiProperty({
    description: 'Dialogue description',
    example: 'Greeting conversation',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Dialogue script',
    example: 'A: Hello! B: Hi, how are you?',
  })
  @IsString()
  script: string;

  @ApiProperty({
    description: 'Audio URL',
    example: 'https://example.com/audio.mp3',
  })
  @IsString()
  audio: string;

  @ApiProperty({
    description: 'Translation',
    example: 'A: Xin chào! B: Chào, bạn khỏe không?',
  })
  @IsString()
  translation: string;

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['greetings', 'conversation'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class QuestionAnswerDto {
  @ApiProperty({ description: 'Question', example: 'What is your name?' })
  @IsString()
  question: string;

  @ApiProperty({ description: 'Answer', example: 'My name is John' })
  @IsString()
  answer: string;
}

class ReadingContentDto {
  @ApiProperty({ description: 'Content type', example: 'reading' })
  @IsString()
  type: 'reading';

  @ApiProperty({
    description: 'Reading description',
    example: 'Short passage about daily routine',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Reading passage',
    example: 'Every morning, I wake up at 7 AM...',
  })
  @IsString()
  passage: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['reading', 'daily-routine'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class ExerciseContentDto {
  @ApiProperty({ description: 'Content type', example: 'exercises' })
  @IsString()
  type: 'exercises';

  @ApiProperty({
    description: 'Exercise description',
    example: 'Fill in the blanks',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Exercise type', example: 'fill-in-blank' })
  @IsString()
  exerciseType: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['exercise', 'practice'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class QuizContentDto {
  @ApiProperty({ description: 'Content type', example: 'quizzes' })
  @IsString()
  type: 'quizzes';

  @ApiProperty({
    description: 'Quiz description',
    example: 'End of lesson quiz',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['quiz', 'assessment'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class ReviewContentDto {
  @ApiProperty({ description: 'Content type', example: 'reviews' })
  @IsString()
  type: 'reviews';

  @ApiProperty({
    description: 'Review description',
    example: 'Review key points',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['review', 'summary'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class SummaryContentDto {
  @ApiProperty({ description: 'Content type', example: 'summaries' })
  @IsString()
  type: 'summaries';

  @ApiProperty({
    description: 'Summary description',
    example: 'Lesson summary',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['summary', 'conclusion'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class GameContentDto {
  @ApiProperty({ description: 'Content type', example: 'games' })
  @IsString()
  type: 'games';

  @ApiProperty({
    description: 'Game description',
    example: 'Vocabulary matching game',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['game', 'interactive'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class SongVocabularyWordDto {
  @ApiProperty({ description: 'Word', example: 'hello' })
  @IsString()
  word: string;

  @ApiProperty({ description: 'Definition', example: 'xin chào' })
  @IsString()
  definition: string;

  @ApiPropertyOptional({
    description: 'IPA pronunciation',
    example: '/həˈloʊ/',
  })
  @IsOptional()
  @IsString()
  ipa?: string;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Audio URL',
    example: 'https://example.com/audio.mp3',
  })
  @IsOptional()
  @IsString()
  audio?: string;
}

class SongContentDto {
  @ApiProperty({ description: 'Content type', example: 'songs' })
  @IsString()
  type: 'songs';

  @ApiProperty({
    description: 'Song description',
    example: 'Hello song for kids',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Song lyrics',
    example: 'Hello, hello, how are you?',
  })
  @IsString()
  lyrics: string;

  @ApiProperty({
    description: 'Translation',
    example: 'Xin chào, xin chào, bạn khỏe không?',
  })
  @IsString()
  translation: string;

  @ApiProperty({
    description: 'Audio URL',
    example: 'https://example.com/song.mp3',
  })
  @IsString()
  audio: string;

  @ApiProperty({
    description: 'Video URL',
    example: 'https://example.com/video.mp4',
  })
  @IsString()
  video: string;

  @ApiProperty({
    description: 'Vocabulary from song',
    type: [SongVocabularyWordDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongVocabularyWordDto)
  vocabulary: SongVocabularyWordDto[];

  @ApiProperty({
    description: 'Questions and answers',
    type: [QuestionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  questionsAndAnswers: QuestionAnswerDto[];

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['song', 'music'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// Union type cho content - mỗi bài học chỉ có 1 loại content
type LessonContentDto =
  | VocabularyContentDto
  | GrammarContentDto
  | DialogueContentDto
  | ReadingContentDto
  | ExerciseContentDto
  | QuizContentDto
  | ReviewContentDto
  | SummaryContentDto
  | GameContentDto
  | SongContentDto;

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson title', example: 'Lesson 1: Greetings' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'SEO-friendly slug',
    example: 'lesson-1-greetings',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Lesson description',
    example: 'Learn basic greetings',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Lesson type',
    enum: LessonType,
    example: LessonType.VOCABULARY,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiProperty({
    description: 'Lesson level',
    enum: LessonLevel,
    example: LessonLevel.A1,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toUpperCase();
    return value;
  })
  @IsEnum(LessonLevel)
  level: LessonLevel;

  @ApiPropertyOptional({
    description: 'Order index in unit',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  @Min(0)
  orderIndex?: number;

  @ApiProperty({ description: 'Unit ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  unit: string;

  @ApiProperty({
    description: 'Lesson content - chỉ chứa 1 loại content dựa vào type của lesson',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsNotEmpty()
  @IsObject()
  content: LessonContentDto;

  @ApiPropertyOptional({
    description: 'Skill focus',
    enum: LessonSkill,
    example: LessonSkill.VOCABULARY,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  })
  @IsEnum(LessonSkill)
  skillFocus?: LessonSkill;

  @ApiPropertyOptional({
    description: 'Estimated duration in minutes',
    example: 30,
    minimum: 0,
    maximum: 1000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  estimatedDuration?: number;

  @ApiPropertyOptional({
    description: 'Materials (file URLs)',
    type: [String],
    example: ['https://example.com/worksheet.pdf'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  materials?: string[];

  @ApiPropertyOptional({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Audio intro URL',
    example: 'https://example.com/intro.mp3',
  })
  @IsOptional()
  @IsString()
  audioIntro?: string;

  @ApiPropertyOptional({
    description: 'Video intro URL',
    example: 'https://example.com/intro.mp4',
  })
  @IsOptional()
  @IsString()
  videoIntro?: string;

  @ApiPropertyOptional({
    description: 'Tags',
    type: [String],
    example: ['A1', 'greetings', 'vocabulary'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Lesson status',
    enum: LessonStatus,
    example: LessonStatus.ACTIVE,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  })
  @IsEnum(LessonStatus)
  isActive: LessonStatus;
}
