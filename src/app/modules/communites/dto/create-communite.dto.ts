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
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @Allow()
  file?: unknown;
}

export class CreateCommuniteDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  @Transform(({ value }) => value.toString())
  content: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  comments?: CreateCommentDto[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
