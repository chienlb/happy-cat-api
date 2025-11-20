import {
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
    IsArray,
    Min,
    IsPositive,
} from 'class-validator';
import { PackageType } from '../schema/package.schema';

export class CreatePackageDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(PackageType)
    type: PackageType;

    @IsNumber()
    @Min(1)
    durationInDays: number;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    currency: string;

    @IsArray()
    @IsString({ each: true })
    features: string[];

    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsMongoId()
    createdBy?: string;
}
