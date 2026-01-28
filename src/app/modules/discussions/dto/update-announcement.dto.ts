import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { IsOptional, IsDate } from 'class-validator';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {
  @IsOptional()
  @IsDate()
  publishedAt?: Date;
}
