import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { UserRole, UserStatus } from '../../users/schema/user.schema';
import { PaymentMethod, PaymentStatus } from '../../payments/schema/payment.schema';

/**
 * Enum định nghĩa các loại báo cáo có thể export
 */
export enum ExportType {
  USERS = 'USERS',
  PAYMENTS = 'PAYMENTS',
  REVENUE_BY_MONTH = 'REVENUE_BY_MONTH',
  USER_BY_MONTH = 'USER_BY_MONTH',
  DASHBOARD_SUMMARY = 'DASHBOARD_SUMMARY',
  GROUPS_UNITS_STATISTICS = 'GROUPS_UNITS_STATISTICS',
}

/**
 * DTO cho việc filter và export báo cáo admin
 * Sử dụng query parameters: /admin/export?type=USERS&startDate=2026-01-01&status=active
 */
export class ExportFilterDto {
  @IsEnum(ExportType, { message: 'Invalid export type' })
  type: ExportType;

  // Filters chung cho date range
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date (YYYY-MM-DD)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date (YYYY-MM-DD)' })
  endDate?: string;

  // Filters cho Users export
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  // Filters cho Payments export
  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  paymentStatus?: PaymentStatus;
}
