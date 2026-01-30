import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../schema/payment.schema';

export class CreatePaymentDto {

  @IsMongoId()
  @IsOptional()
  subscriptionId?: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  orderType?: string;

  @IsOptional()
  @IsString()
  orderInfo?: string;

  @IsOptional()
  @IsString()
  expireDate?: string;

  @IsOptional()
  @IsString()
  billMobile?: string;

  @IsOptional()
  @IsString()
  billEmail?: string;

  @IsOptional()
  @IsString()
  billFirstName?: string;

  @IsOptional()
  @IsString()
  billLastName?: string;

  @IsOptional()
  @IsString()
  billAddress?: string;

  @IsOptional()
  @IsString()
  billCity?: string;

  @IsOptional()
  @IsString()
  billCountry?: string;

  @IsOptional()
  @IsString()
  billState?: string;

  @IsOptional()
  @IsString()
  invPhone?: string;

  @IsOptional()
  @IsString()
  invEmail?: string;

  @IsOptional()
  @IsString()
  invCustomer?: string;

  @IsOptional()
  @IsString()
  invAddress?: string;

  @IsOptional()
  @IsString()
  invCompany?: string;

  @IsOptional()
  @IsString()
  invTaxcode?: string;

  @IsOptional()
  @IsString()
  invType?: string;
}
