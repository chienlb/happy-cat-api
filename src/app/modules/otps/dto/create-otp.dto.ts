import { IsString, Min } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  email: string;

  @IsString()
  @Min(6)
  otp: string;
}
