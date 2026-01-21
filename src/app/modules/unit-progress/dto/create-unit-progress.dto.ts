import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Types } from 'mongoose';
import { UnitProgressStatus } from '../schema/unit-progress.schema';
import { Type } from 'class-transformer';

export class CreateUnitProgressDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  unitId: Types.ObjectId;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @IsNumber()
  @Min(0)
  orderIndex: number;

  @IsEnum(UnitProgressStatus)
  status: UnitProgressStatus;

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
