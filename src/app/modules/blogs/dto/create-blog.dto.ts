import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
    @IsString()
    title: string;
    @IsString()
    @IsOptional()
    slug: string;
    @IsString()
    content: string;
    @IsString()
    author: string;
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive: boolean;
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isFeatured: boolean;
}
