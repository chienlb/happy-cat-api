import { IsNotEmpty, IsEmail, IsString, IsDateString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserGender } from '../schema/user.schema';
import { Type } from 'class-transformer';

/**
 * DTO cho từng row trong file Excel
 * Excel columns: fullname, email, birthDate, gender, phone (optional)
 */
export class StudentImportRowDto {
  @IsNotEmpty({ message: 'Fullname is required' })
  @IsString()
  fullname: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @IsDateString()
  birthDate: string; // YYYY-MM-DD

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(UserGender)
  gender: UserGender; // MALE, FEMALE, OTHER

  @IsOptional()
  @IsString()
  phone?: string;
}

/**
 * DTO cho import request
 * multipart/form-data: file (xlsx/csv) + groupId + autoEnroll
 */
export class ImportStudentsDto {
  @IsNotEmpty({ message: 'Group ID is required' })
  @IsString()
  groupId: string;

  @IsOptional()
  @Type(() => Boolean)
  autoEnroll?: boolean; // Tự động thêm vào group? Default: true

  @IsOptional()
  @Type(() => Boolean)
  sendInviteEmail?: boolean; // Gửi email mời? Default: true

  @IsOptional()
  @IsString()
  autoPassword?: string; // Password mặc định cho tất cả students (nếu không, generate random)
}

/**
 * Response sau import
 */
export class ImportStudentsResultDto {
  success: number; // Số học sinh tạo thành công
  failed: number; // Số học sinh tạo thất bại
  skipped: number; // Số email đã tồn tại
  total: number; // Tổng cộng
  details: ImportStudentDetailDto[]; // Chi tiết từng row
  message: string;
}

export class ImportStudentDetailDto {
  row: number; // Thứ tự row trong Excel
  email: string;
  fullname?: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  reason?: string; // Lý do nếu failed/skipped
  userId?: string; // User ID nếu success
  generatedPassword?: string; // Password được generate (chỉ show lần đầu)
}
