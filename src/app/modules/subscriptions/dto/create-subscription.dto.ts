import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { SubscriptionStatus } from '../schema/subscription.schema';

export class CreateSubscriptionDto {
  @IsMongoId()
  packageId: string;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsBoolean()
  autoRenew: boolean;

  @IsOptional()
  @IsMongoId()
  paymentId?: string;
}
