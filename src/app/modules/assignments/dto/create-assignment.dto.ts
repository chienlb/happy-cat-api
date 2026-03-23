import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { AssignmentType } from '../schema/assignment.schema';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AssignmentType)
  type?: AssignmentType;

  @IsOptional()
  lessonId?: Types.ObjectId;

  @IsOptional()
  classId?: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  createdBy: Types.ObjectId; 

  @IsOptional()
  updatedBy?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true ? true : false)
  isPublished?: boolean;
}
