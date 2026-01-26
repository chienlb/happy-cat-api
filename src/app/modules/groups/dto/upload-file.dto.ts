import { IsOptional } from 'class-validator';

export class UploadFileDto {
    @IsOptional()
    avatar?: any;
    
    @IsOptional()
    background?: any;
}