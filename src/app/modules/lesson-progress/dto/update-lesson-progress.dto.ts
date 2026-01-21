import { PartialType } from '@nestjs/swagger';
import { CreateLessonProgressDto } from './create-lesson-progress.dto';

export class UpdateLessonProgressDto extends PartialType(
  CreateLessonProgressDto,
) {}
