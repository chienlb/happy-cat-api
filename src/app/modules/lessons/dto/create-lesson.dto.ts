import {
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
    IsMongoId,
    IsBoolean,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    LessonType,
    LessonLevel,
    LessonSkill,
    LessonStatus,
} from '../schema/lesson.schema';

class VocabularyContentDto {
    @IsArray()
    @IsString({ each: true })
    words: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    definitions?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    audioFiles?: string[];
}

class GrammarContentDto {
    @IsString()
    rule: string;

    @IsArray()
    @IsString({ each: true })
    examples: string[];
}

class DialogueContentDto {
    @IsString()
    script: string;

    @IsOptional()
    @IsString()
    audio?: string;

    @IsOptional()
    @IsString()
    translation?: string;
}

class ReadingContentDto {
    @IsString()
    passage: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    questions?: string[];
}

class ExerciseItemDto {
    @IsString()
    type: string;

    @IsArray()
    questions: any[];
}

class ContentDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => VocabularyContentDto)
    vocabulary?: VocabularyContentDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => GrammarContentDto)
    grammar?: GrammarContentDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => DialogueContentDto)
    dialogue?: DialogueContentDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => ReadingContentDto)
    reading?: ReadingContentDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExerciseItemDto)
    exercises?: ExerciseItemDto[];
}

export class CreateLessonDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(LessonType)
    type: LessonType;

    @IsEnum(LessonLevel)
    level: LessonLevel;

    @IsOptional()
    @IsNumber()
    orderIndex?: number;

    @IsMongoId()
    unit: string;

    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsEnum(LessonSkill)
    skillFocus?: LessonSkill;

    @ValidateNested()
    @Type(() => ContentDto)
    content: ContentDto;

    @IsOptional()
    @IsBoolean()
    locked?: boolean;

    @IsOptional()
    @IsNumber()
    estimatedDuration?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    materials?: string[];

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    audioIntro?: string;

    @IsOptional()
    @IsString()
    videoIntro?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsEnum(LessonStatus)
    isActive: LessonStatus;

    @IsMongoId()
    createdBy: string;

    @IsOptional()
    @IsMongoId()
    updatedBy?: string;
}
