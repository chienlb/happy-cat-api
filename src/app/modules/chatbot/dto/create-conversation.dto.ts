import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'Tiêu đề cuộc trò chuyện',
    example: 'Học về NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Mô tả cuộc trò chuyện',
    example: 'Cuộc trò chuyện về các khái niệm cơ bản của NestJS',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
