import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { QuestionType } from '../schema/competition.schema';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Nội dung câu hỏi' })
  @IsString()
  question: string;

  @ApiPropertyOptional({ description: 'URL media (ảnh, video, audio)' })
  @IsOptional()
  @IsString()
  media?: string;

  @ApiProperty({
    description: 'Danh sách câu trả lời',
    type: [String],
    example: ['Đáp án A', 'Đáp án B', 'Đáp án C'],
  })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ description: 'Câu trả lời đúng' })
  @IsString()
  correctAnswer: string;

  @ApiPropertyOptional({ description: 'Điểm số câu hỏi', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiProperty({
    description: 'Loại câu hỏi',
    enum: QuestionType,
    enumName: 'QuestionType',
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({ description: 'Giải thích đáp án' })
  @IsOptional()
  @IsString()
  explanation?: string;
}
