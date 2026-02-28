import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsDate,
  IsArray,
  IsNumber,
  Min,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CompetitionType,
  CompetitionStatus,
  CompetitionVisibility,
  CompetitionResult,
} from '../schema/competition.schema';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateCompetitionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CompetitionType)
  type?: CompetitionType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;

  @IsOptional()
  @IsMongoId()
  updatedBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalParticipants?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  participants?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsString()
  prize?: string;

  @IsOptional()
  @IsEnum(CompetitionStatus)
  status?: CompetitionStatus;

  @IsOptional()
  results?: CompetitionResult[];

  @IsOptional()
  @IsMongoId()
  badgeId?: string;

  @IsOptional()
  @IsEnum(CompetitionVisibility)
  visibility?: CompetitionVisibility;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Danh sách câu hỏi của cuộc thi',
    type: [CreateQuestionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  listQuestion?: CreateQuestionDto[];
}
