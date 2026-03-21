import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return value;
    return String(value);
  })
  content: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateCommuniteDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  @Transform(({ value, obj }) => {
    const normalized = value ?? obj?.title;
    if (typeof normalized === 'string') return normalized;
    if (normalized === null || normalized === undefined) return normalized;
    return String(normalized);
  })
  content: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @Allow()
  file?: unknown;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  comments?: CreateCommentDto[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
