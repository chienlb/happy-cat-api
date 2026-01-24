import { IsString, IsNotEmpty } from 'class-validator';
import { Region } from '../schema/province.schema';

export class CreateProvinceDto {
  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @IsString()
  @IsNotEmpty()
  region: Region;

  @IsString()
  @IsNotEmpty()
  country: string;
}
