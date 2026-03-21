import { Type } from 'class-transformer';
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

  @IsString()
  content: string;

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
