import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { SubscriptionStatus } from '../schema/subscription.schema';
import { Transform } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  packageId: string;

  @IsOptional()
  startDate: string;

  @IsOptional()
  endDate: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status: SubscriptionStatus;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true ? true : false)
  autoRenew: boolean;

  @IsOptional()
  paymentId?: string;
}
