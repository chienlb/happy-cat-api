import { IsString, IsEnum, IsMongoId, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../schema/notification.schema';

export class CreateNotificationDto {
  @IsMongoId()
  userId: string; // Người nhận thông báo

  @IsOptional()
  @IsMongoId()
  senderId?: string; // Người gửi (nếu có)

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  data?: Record<string, any>; // Dữ liệu tùy chọn

  @IsOptional()
  @IsString()
  firebaseToken?: string;

  @IsBoolean()
  isRead: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;
}
