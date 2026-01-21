import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsArray,
    IsEnum,
    IsNumber,
    IsMongoId,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitLevel, UnitDifficulty, UnitStatus } from '../schema/unit.schema';

class MaterialsDto {
    @ApiPropertyOptional({ type: [String], description: 'Text lesson file paths' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    textLessons?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Video URLs' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    videos?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Audio file paths' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    audios?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Exercise URLs or paths' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    exercises?: string[];
}

export class CreateUnitDto {
    @ApiProperty({ description: 'Unit name', example: 'Unit 1: Greetings' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Unit description', example: 'Learn basic greetings and introductions' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Unit topic', example: 'Greetings and Introductions' })
    @IsString()
    topic: string;

    @ApiProperty({ description: 'SEO-friendly slug', example: 'unit-1-greetings' })
    @IsString()
    slug: string;

    @ApiProperty({ description: 'Grade level', example: 'Grade 6' })
    @IsString()
    grade: string;

    @ApiProperty({ description: 'Unit level', enum: UnitLevel, example: UnitLevel.A1 })
    @IsEnum(UnitLevel)
    level: UnitLevel;

    @ApiProperty({ description: 'Unit difficulty', enum: UnitDifficulty, example: UnitDifficulty.EASY })
    @IsEnum(UnitDifficulty)
    difficulty: UnitDifficulty;

    @ApiProperty({ description: 'Order index', example: 1, minimum: 0 })
    @IsNumber()
    @Min(0)
    orderIndex: number;

    @ApiProperty({ description: 'Total number of lessons', example: 10, minimum: 1 })
    @IsNumber()
    @Min(1)
    totalLessons: number;

    @ApiProperty({ description: 'Learning objectives', type: [String], example: ['Understand basic greetings', 'Learn introduction phrases'] })
    @IsArray()
    @IsString({ each: true })
    objectives: string[];

    @ApiPropertyOptional({ description: 'Learning materials', type: MaterialsDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => MaterialsDto)
    materials?: MaterialsDto;

    @ApiPropertyOptional({ description: 'Prerequisite unit IDs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    prerequisites?: string[];

    @ApiPropertyOptional({ description: 'Estimated duration in minutes', example: 120 })
    @IsOptional()
    @IsNumber()
    estimatedDuration?: number;

    @ApiPropertyOptional({ description: 'Thumbnail image URL', example: 'https://example.com/thumbnail.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'Banner image URL', example: 'https://example.com/banner.jpg' })
    @IsOptional()
    @IsString()
    banner?: string;

    @ApiPropertyOptional({ description: 'Tags for categorization', type: [String], example: ['greetings', 'A1', 'self-learning'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ description: 'Unit status', enum: UnitStatus, example: UnitStatus.ACTIVE })
    @IsEnum(UnitStatus)
    isActive: UnitStatus;

    @ApiProperty({ description: 'Creator user ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    createdBy: string;

    @ApiProperty({ description: 'Updater user ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    updatedBy: string;
}
