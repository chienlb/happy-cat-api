import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsArray,
    IsEnum,
    IsNumber,
    IsUrl,
    IsBoolean,
    ArrayNotEmpty,
    IsMongoId,
    Min,
} from 'class-validator';
import { UnitLevel, UnitDifficulty, UnitStatus } from '../schema/unit.schema';

export class CreateUnitDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    topic: string;

    @IsString()
    slug: string;

    @IsString()
    skill: string;

    @IsString()
    grade: string;

    @IsEnum(UnitLevel)
    level: UnitLevel;

    @IsEnum(UnitDifficulty)
    difficulty: UnitDifficulty;

    @IsNumber()
    @Min(1)
    totalLessons: number;

    @IsArray()
    @IsString({ each: true })
    objectives: string[];

    @IsArray()
    @IsString({ each: true })
    keyVocabulary: string[];

    @IsArray()
    @IsString({ each: true })
    grammarFocus: string[];

    @IsArray()
    @IsString({ each: true })
    keyExpressions: string[];

    @IsOptional()
    materials?: {
        textLessons?: string[];
        videos?: string[];
        audios?: string[];
        exercises?: string[];
    };

    @IsArray()
    @IsMongoId({ each: true })
    lessons: string[];

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    relatedUnits?: string[];

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    prerequisites?: string[];

    @IsOptional()
    @IsNumber()
    averageProgress?: number;

    @IsOptional()
    @IsNumber()
    estimatedDuration?: number;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    banner?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsEnum(UnitStatus)
    isActive: UnitStatus;

    @IsMongoId()
    createdBy: string;

    @IsMongoId()
    updatedBy: string;
}
