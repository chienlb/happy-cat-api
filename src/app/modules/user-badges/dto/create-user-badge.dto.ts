import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserBadgeDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  badgeId: string;

  @IsNotEmpty()
  awardedAt: Date;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsMongoId()
  @IsOptional()
  awardedBy?: string;

  @IsOptional()
  isRevoked?: boolean;

  @IsOptional()
  revokedAt?: Date;

  @IsString()
  @IsOptional()
  note?: string;
}
