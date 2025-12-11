import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    page: number = 1;

    @IsOptional()
    @IsNumber()
    limit: number = 10;

    @IsOptional()
    @IsString()
    sort: string = 'createdAt';

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order: 'asc' | 'desc' = 'desc';
}