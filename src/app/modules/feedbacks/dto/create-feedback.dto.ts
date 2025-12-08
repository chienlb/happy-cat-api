import { IsNotEmpty, IsOptional, IsEnum, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { FeedbackType } from '../schema/feedback.schema';

export class CreateFeedbackDto {
    @IsNotEmpty()
    userId: Types.ObjectId;

    @IsEnum(FeedbackType)
    type: FeedbackType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    relatedId?: Types.ObjectId;

    @IsBoolean()
    isResolved: boolean;

    @IsOptional()
    resolvedBy?: Types.ObjectId;

    @IsOptional()
    resolvedAt?: Date;
}
