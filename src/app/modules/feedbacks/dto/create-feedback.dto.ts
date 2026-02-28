import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';
import { FeedbackType } from '../schema/feedback.schema';

export class CreateFeedbackDto {
  @IsOptional()
  userId: Types.ObjectId;

  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  relatedId?: Types.ObjectId;

  @IsBoolean()
  isResolved: boolean;

  @IsOptional()
  resolvedBy?: Types.ObjectId;

  @IsOptional()
  resolvedAt?: Date;
}
