import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  UserRole,
  UserGender,
  UserLanguage,
  UserTheme,
  UserFont,
  UserStatus,
  UserTypeAccount,
} from '../schema/user.schema';

export class CreateUserDto {
  @IsString()
  @MaxLength(120)
  fullname: string;

  @IsString()
  @MaxLength(60)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsEnum(UserRole)
  role: UserRole;

  // Usually auto-generated from fullname; allow optional override
  @IsOptional()
  @IsString()
  @MaxLength(160)
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  slug?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @IsOptional()
  @IsEnum(UserLanguage)
  language?: UserLanguage;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsMongoId()
  district?: string;

  @IsOptional()
  @IsMongoId()
  school?: string;

  @IsOptional()
  @IsMongoId()
  className?: string;

  @IsOptional()
  @IsMongoId()
  parent?: string;

  @IsOptional()
  @IsMongoId()
  teacher?: string;

  @IsEnum(UserTypeAccount)
  typeAccount: UserTypeAccount;

  @IsOptional()
  @IsBoolean()
  isVerify?: boolean;

  @IsOptional()
  @IsString()
  tokenVerify?: string;

  @IsOptional()
  @IsString()
  refCode?: string;

  @IsOptional()
  @IsMongoId()
  invitedBy?: string;

  @IsOptional()
  @IsNumber()
  exp?: number;

  @IsOptional()
  @IsNumber()
  streakDays?: number;

  @IsOptional()
  @IsDateString()
  lastStreakDate?: string;

  @IsOptional()
  @IsNumber()
  progressLevel?: number;

  @IsOptional()
  @IsEnum(UserTheme)
  theme?: UserTheme;

  @IsOptional()
  @IsEnum(UserFont)
  font?: UserFont;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  enableNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  enableNotificationEmails?: boolean;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: string;
}
