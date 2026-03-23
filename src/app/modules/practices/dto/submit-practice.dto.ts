import { IsString } from 'class-validator';

export class SubmitPracticeDto {
  @IsString()
  studentWriting: string;
}
