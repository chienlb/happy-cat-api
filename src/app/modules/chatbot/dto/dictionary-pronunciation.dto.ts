import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class DictionaryPronunciationDto {
  @ApiProperty({
    description: 'Tu vung can tra cuu',
    example: 'elephant',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  word: string;

  @ApiPropertyOptional({
    description: 'Ngon ngu dich nghia',
    example: 'vi',
    default: 'vi',
  })
  @IsOptional()
  @IsString()
  targetLanguage?: string;

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
