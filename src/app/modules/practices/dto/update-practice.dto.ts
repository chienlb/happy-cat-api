import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreatePracticeDto } from './create-practice.dto';

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) {
	@IsOptional()
	AIFeedback?: unknown;
}
