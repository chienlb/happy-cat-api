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
    userId: string;

    @IsMongoId()
    packageId: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsEnum(SubscriptionStatus)
    status: SubscriptionStatus;

    @IsBoolean()
    autoRenew: boolean;

    @IsOptional()
    @IsMongoId()
    paymentId?: string;
}
