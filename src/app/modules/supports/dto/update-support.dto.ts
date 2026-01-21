import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { SupportStatus } from '../schema/support.schema';

export class UpdateSupportDto {
  @IsEnum(SupportStatus)
  @IsOptional()
  status?: SupportStatus;

  @IsMongoId()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  response?: string;

  @IsOptional()
  resolvedAt?: Date;
}
