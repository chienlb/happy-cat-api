import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsMongoId,
  IsArray,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { GroupType, GroupVisibility } from '../schema/group.schema';

export class CreateGroupDto {
  @IsString()
  @MaxLength(100)
  groupName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsString()
  slug: string;

  @IsEnum(GroupType)
  type: GroupType;

  @IsEnum(GroupVisibility)
  visibility: GroupVisibility;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];

  @IsOptional()
  @IsNumber()
  maxMembers?: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  joinCode?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  background?: string;
}
