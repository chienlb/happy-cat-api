import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class VocabularyTtsDto {
  @ApiProperty({
    description: 'Tu hoac cau ngan can doc',
    example: 'elephant',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  text: string;

  @ApiPropertyOptional({
    description: 'Voice prebuilt cua Gemini TTS',
    example: 'Kore',
    default: 'Kore',
  })
  @IsOptional()
  @IsString()
  voiceName?: string;

  @ApiPropertyOptional({
    description: 'Language code cho speech synthesis',
    example: 'en-US',
    default: 'en-US',
  })
  @IsOptional()
  @IsString()
  languageCode?: string;
}
