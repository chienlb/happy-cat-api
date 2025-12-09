import { IsString, IsEnum, IsMongoId, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../schema/notification.schema';

export class UpdateNotificationDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  senderId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  firebaseToken?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;
}
