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
import { Transform, Type } from 'class-transformer';
import { UnitDifficulty, UnitStatus } from '../schema/unit.schema';
import { ToArray } from 'src/app/common/decorators/to-array.decorator';
import { Optional } from '@nestjs/common';

class MaterialsDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Text lesson file paths',
  })
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

  @ApiPropertyOptional({
    type: [String],
    description: 'Exercise URLs or paths',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exercises?: string[];
}

export class CreateUnitDto {
  @ApiProperty({ description: 'Unit name', example: 'Unit 1: Greetings' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Unit description',
    example: 'Learn basic greetings and introductions',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Unit topic',
    example: 'Greetings and Introductions',
  })
  @IsString()
  topic: string;
  
  @ApiProperty({
    description: 'Unit difficulty',
    enum: UnitDifficulty,
    example: UnitDifficulty.EASY,
  })
  @IsEnum(UnitDifficulty)
  difficulty: UnitDifficulty;

  @ApiProperty({ description: 'Order index', example: 1, minimum: 0 })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  orderIndex: number;

  @ApiProperty({
    description: 'Total number of lessons',
    example: 10,
    minimum: 1,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  totalLessons: number;

  @ApiProperty({
    description: 'Learning objectives',
    type: [String],
    example: ['Understand basic greetings', 'Learn introduction phrases'],
  })
  @IsArray()
  @ToArray()
  @IsString({ each: true })
  objectives: string[];

  @ApiPropertyOptional({
    description: 'Learning materials',
    type: MaterialsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MaterialsDto)
  materials?: MaterialsDto;

  @ApiPropertyOptional({ description: 'Prerequisite unit IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @ToArray()
  @IsMongoId({ each: true })
  prerequisites?: string[];

  @ApiPropertyOptional({
    description: 'Estimated duration in minutes',
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  estimatedDuration?: number;

  @ApiPropertyOptional({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Banner image URL',
    example: 'https://example.com/banner.jpg',
  })
  @IsOptional()
  @IsString()
  banner?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    type: [String],
    example: ['greetings', 'A1', 'self-learning'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ToArray()
  tags?: string[];

  @ApiProperty({
    description: 'Unit status',
    enum: UnitStatus,
    example: UnitStatus.ACTIVE,
  })
  @IsEnum(UnitStatus)
  isActive: UnitStatus;
}
