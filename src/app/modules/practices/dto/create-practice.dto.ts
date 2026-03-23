import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ParcticeTypes } from '../schema/practice.schema';

export class CreatePracticeDto {
	@IsString()
	studentId: string;

	@IsEnum(ParcticeTypes)
	type: string;

	@IsOptional()
	exercise?: unknown;

	@IsOptional()
	@IsString()
	studentWriting?: string;
}
