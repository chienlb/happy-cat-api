import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupportDto {
    @IsMongoId()
    userId: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsArray()
    @IsOptional()
    attachments?: string[];
}
