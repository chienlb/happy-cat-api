import { Transform, Type } from 'class-transformer';
import {
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
}

export class CreateCommuniteDto {
  @IsOptional()
  @IsString()
  userId: string;

  @Transform(({ value, obj }) => {
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof obj?.title === 'string' && obj.title.trim()) return obj.title;
    return value;
  })
  @IsString()
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
