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
} from 'class-validator';
import { Type } from 'class-transformer';
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
    @ApiProperty({ description: 'Vocabulary description', example: 'Basic greetings vocabulary' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'List of vocabulary words', type: [VocabularyWordDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabularyWordDto)
    words: VocabularyWordDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['greetings', 'basic'] })
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
    @ApiProperty({ description: 'Grammar description', example: 'Present simple tense' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Grammar rule', example: 'Use present simple for habits and routines' })
    @IsString()
    rule: string;

    @ApiProperty({ description: 'Examples', type: [GrammarExampleDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GrammarExampleDto)
    examples: GrammarExampleDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['present', 'tense'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class DialogueContentDto {
    @ApiProperty({ description: 'Dialogue description', example: 'Greeting conversation' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Dialogue script', example: 'A: Hello! B: Hi, how are you?' })
    @IsString()
    script: string;

    @ApiProperty({ description: 'Audio URL', example: 'https://example.com/audio.mp3' })
    @IsString()
    audio: string;

    @ApiProperty({ description: 'Translation', example: 'A: Xin chào! B: Chào, bạn khỏe không?' })
    @IsString()
    translation: string;

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['greetings', 'conversation'] })
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
    @ApiProperty({ description: 'Reading description', example: 'Short passage about daily routine' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Reading passage', example: 'Every morning, I wake up at 7 AM...' })
    @IsString()
    passage: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['reading', 'daily-routine'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class ExerciseContentDto {
    @ApiProperty({ description: 'Exercise description', example: 'Fill in the blanks' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Exercise type', example: 'fill-in-blank' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['exercise', 'practice'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class QuizContentDto {
    @ApiProperty({ description: 'Quiz description', example: 'End of lesson quiz' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['quiz', 'assessment'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class ReviewContentDto {
    @ApiProperty({ description: 'Review description', example: 'Review key points' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['review', 'summary'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class SummaryContentDto {
    @ApiProperty({ description: 'Summary description', example: 'Lesson summary' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['summary', 'conclusion'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class GameContentDto {
    @ApiProperty({ description: 'Game description', example: 'Vocabulary matching game' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['game', 'interactive'] })
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

    @ApiPropertyOptional({ description: 'IPA pronunciation', example: '/həˈloʊ/' })
    @IsOptional()
    @IsString()
    ipa?: string;

    @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({ description: 'Audio URL', example: 'https://example.com/audio.mp3' })
    @IsOptional()
    @IsString()
    audio?: string;
}

class SongContentDto {
    @ApiProperty({ description: 'Song description', example: 'Hello song for kids' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Song lyrics', example: 'Hello, hello, how are you?' })
    @IsString()
    lyrics: string;

    @ApiProperty({ description: 'Translation', example: 'Xin chào, xin chào, bạn khỏe không?' })
    @IsString()
    translation: string;

    @ApiProperty({ description: 'Audio URL', example: 'https://example.com/song.mp3' })
    @IsString()
    audio: string;

    @ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4' })
    @IsString()
    video: string;

    @ApiProperty({ description: 'Vocabulary from song', type: [SongVocabularyWordDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SongVocabularyWordDto)
    vocabulary: SongVocabularyWordDto[];

    @ApiProperty({ description: 'Questions and answers', type: [QuestionAnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    questionsAndAnswers: QuestionAnswerDto[];

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['song', 'music'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

class LessonContentDto {
    @ApiPropertyOptional({ description: 'Vocabulary content', type: VocabularyContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => VocabularyContentDto)
    vocabulary?: VocabularyContentDto;

    @ApiPropertyOptional({ description: 'Grammar content', type: GrammarContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => GrammarContentDto)
    grammar?: GrammarContentDto;

    @ApiPropertyOptional({ description: 'Dialogue content', type: DialogueContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => DialogueContentDto)
    dialogue?: DialogueContentDto;

    @ApiPropertyOptional({ description: 'Reading content', type: ReadingContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ReadingContentDto)
    reading?: ReadingContentDto;

    @ApiPropertyOptional({ description: 'Exercise content', type: ExerciseContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ExerciseContentDto)
    exercises?: ExerciseContentDto;

    @ApiPropertyOptional({ description: 'Quiz content', type: QuizContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => QuizContentDto)
    quizzes?: QuizContentDto;

    @ApiPropertyOptional({ description: 'Review content', type: ReviewContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ReviewContentDto)
    reviews?: ReviewContentDto;

    @ApiPropertyOptional({ description: 'Summary content', type: SummaryContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SummaryContentDto)
    summaries?: SummaryContentDto;

    @ApiPropertyOptional({ description: 'Game content', type: GameContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => GameContentDto)
    games?: GameContentDto;

    @ApiPropertyOptional({ description: 'Song content', type: SongContentDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SongContentDto)
    songs?: SongContentDto;
}

export class CreateLessonDto {
    @ApiProperty({ description: 'Lesson title', example: 'Lesson 1: Greetings' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'SEO-friendly slug', example: 'lesson-1-greetings' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ description: 'Lesson description', example: 'Learn basic greetings' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Lesson type', enum: LessonType, example: LessonType.VOCABULARY })
    @IsEnum(LessonType)
    type: LessonType;

    @ApiProperty({ description: 'Lesson level', enum: LessonLevel, example: LessonLevel.A1 })
    @IsEnum(LessonLevel)
    level: LessonLevel;

    @ApiPropertyOptional({ description: 'Order index in unit', example: 1, minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    orderIndex?: number;

    @ApiProperty({ description: 'Unit ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    unit: string;

    @ApiProperty({ description: 'Lesson content', type: LessonContentDto })
    @ValidateNested()
    @Type(() => LessonContentDto)
    content: LessonContentDto;

    @ApiPropertyOptional({ description: 'Skill focus', enum: LessonSkill, example: LessonSkill.VOCABULARY })
    @IsOptional()
    @IsEnum(LessonSkill)
    skillFocus?: LessonSkill;

    @ApiPropertyOptional({ description: 'Estimated duration in minutes', example: 30, minimum: 0, maximum: 1000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000)
    estimatedDuration?: number;

    @ApiPropertyOptional({ description: 'Materials (file URLs)', type: [String], example: ['https://example.com/worksheet.pdf'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    materials?: string[];

    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'Audio intro URL', example: 'https://example.com/intro.mp3' })
    @IsOptional()
    @IsString()
    audioIntro?: string;

    @ApiPropertyOptional({ description: 'Video intro URL', example: 'https://example.com/intro.mp4' })
    @IsOptional()
    @IsString()
    videoIntro?: string;

    @ApiPropertyOptional({ description: 'Tags', type: [String], example: ['A1', 'greetings', 'vocabulary'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ description: 'Lesson status', enum: LessonStatus, example: LessonStatus.ACTIVE })
    @IsEnum(LessonStatus)
    isActive: LessonStatus;

    @ApiProperty({ description: 'Creator user ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    createdBy: string;

    @ApiProperty({ description: 'Updater user ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    updatedBy: string;
}
