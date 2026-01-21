import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { SubmissionStatus } from '../schema/submission.schema';

export class CreateSubmissionDto {
  @IsNotEmpty()
  assignmentId: Types.ObjectId;

  @IsNotEmpty()
  studentId: Types.ObjectId;

  @IsObject()
  @IsNotEmpty()
  studentAnswers: Record<string, any>;

  @IsOptional()
  submittedAt?: Date;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @IsOptional()
  gradedBy?: Types.ObjectId;
}
