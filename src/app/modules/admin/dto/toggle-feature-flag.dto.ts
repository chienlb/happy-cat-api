import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleFeatureFlagDto {
  @ApiProperty({
    example: true,
    description: 'Trạng thái bật/tắt của tính năng hệ thống',
  })
  @IsBoolean()
  isEnabled: boolean;
}
