import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { Lesson } from '../../lessons/schema/lesson.schema';

export type LessonProgressDocument = HydratedDocument<LessonProgress>;

export enum LessonProgressStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export interface ILessonProgress {
    userId: Types.ObjectId; // Học sinh
    lessonId: Types.ObjectId; // Bài học
    orderIndex: number; // Thứ tự của Bài học
    progress: number; // Phần trăm hoàn thành
    status: LessonProgressStatus; // Trạng thái
    completedAt: Date; // Ngày hoàn thành
    createBy: Types.ObjectId; // Người tạo
    updatedBy: Types.ObjectId; // Người cập nhật
}

export interface ILessonProgressInput extends Partial<ILessonProgress> {
    createdAt?: Date;
    updatedAt?: Date;
    createBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}

export interface ILessonProgressResponse extends Omit<ILessonProgress, '_id'> {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

@Schema({ collection: 'lesson_progresses', timestamps: true })
export class LessonProgress implements ILessonProgress {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
    lessonId: Types.ObjectId;

    @Prop({ type: Number, default: 0 })
    progress: number;

    @Prop({ type: Number, default: 0 })
    orderIndex: number;

    @Prop({ enum: LessonProgressStatus, default: LessonProgressStatus.NOT_STARTED })
    status: LessonProgressStatus;

    @Prop()
    completedAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;
}

export const LessonProgressSchema = SchemaFactory.createForClass(LessonProgress);
