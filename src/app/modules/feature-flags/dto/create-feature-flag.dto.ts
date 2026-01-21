import {
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { FlagScope } from '../schema/feature-flag.schema';

export class CreateFeatureFlagDto {
  @IsString()
  @IsNotEmpty()
  flagName: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsEnum(FlagScope)
  scope: FlagScope;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetIds?: string[];

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsOptional()
  updatedBy?: Types.ObjectId;
}
