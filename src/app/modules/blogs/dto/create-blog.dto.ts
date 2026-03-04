import { IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
    @IsString()
    title: string;
    @IsString()
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
