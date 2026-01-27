import { IsString, IsOptional, IsEnum, IsBoolean, IsString as IsStr } from 'class-validator';
import { Types } from 'mongoose';
import { LiteratureType, LiteratureLevel } from '../schema/literature.schema';
import { IsString as IsStringEach } from 'class-validator';
import { ToArray } from 'src/app/common/decorators/to-array.decorator';
import { Transform } from 'class-transformer';
import { vocabulary, grammarPoints, comprehensionQuestion } from '../schema/literature.schema';

export class CreateLiteratureDto {
  @IsString()
  title: string;

  @IsEnum(LiteratureType)
  type: LiteratureType;

  @IsEnum(LiteratureLevel)
  level: LiteratureLevel;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsString()
  contentEnglish: string;

  @IsOptional()
  @IsString()
  contentVietnamese?: string;

  @ToArray({ optional: true })
  vocabulary?: vocabulary[];

  @ToArray({ optional: true })
  grammarPoints?: grammarPoints[];

  @IsOptional()
  audioUrl?: string;

  @IsOptional()
  imageUrl?: string;

  @ToArray({ optional: true })
  comprehensionQuestions?: comprehensionQuestion[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isPublished?: boolean;

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsOptional()
  updatedBy?: Types.ObjectId;

  // cái này là array object, KHÔNG mapToString
  @ToArray({ optional: true })
  imagesMeta?: { pageIndex: number, image: string }[];
}
