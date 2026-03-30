import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFeedbackDto {
  @IsOptional()
  userId: Types.ObjectId;

  @IsString()
  content: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  rating: number;
}
