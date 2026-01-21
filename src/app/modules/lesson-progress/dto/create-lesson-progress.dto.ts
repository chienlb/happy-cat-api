import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { LessonProgressStatus } from '../schema/lesson-progress.schema';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateLessonProgressDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  lessonId: Types.ObjectId;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsEnum(LessonProgressStatus)
  status: LessonProgressStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @IsOptional()
  @IsMongoId()
  createBy?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  updatedBy?: Types.ObjectId;
}
