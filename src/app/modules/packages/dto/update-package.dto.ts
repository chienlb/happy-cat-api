import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;
}
