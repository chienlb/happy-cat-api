import { PartialType } from '@nestjs/swagger';
import { CreatePronunciationExerciseDto } from './create-pronunciation-exercise.dto';

export class UpdatePronunciationExerciseDto extends PartialType(
  CreatePronunciationExerciseDto,
) {}
