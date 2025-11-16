import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

export enum LessonType {
  VOCABULARY = 'vocabulary', // Học từ vựng
  GRAMMAR = 'grammar', // Học ngữ pháp
  LISTENING = 'listening', // Nghe hiểu
  SPEAKING = 'speaking', // Nói
  READING = 'reading', // Đọc hiểu
  WRITING = 'writing', // Viết
  QUIZ = 'quiz', // Bài kiểm tra
  REVIEW = 'review', // Ôn tập / tổng kết
}

export enum LessonLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum LessonSkill {
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
}

export enum LessonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface ILesson {
  _id?: Types.ObjectId;

  title: string; // Tên bài học
  slug: string; // Đường dẫn định danh
  description?: string; // Mô tả ngắn
  type: LessonType; // Loại bài học
  level: LessonLevel; // Mức CEFR: A1, A2, B1...
  orderIndex?: number; // Thứ tự trong Unit
  unit: Types.ObjectId; // Thuộc về Unit nào
  topic?: string; // Chủ đề phụ trong Unit
  skillFocus?: LessonSkill; // Kỹ năng chính (Listening, Grammar,...)
  content: {
    vocabulary?: {
      words: string[]; // Từ vựng chính
      definitions?: string[]; // Nghĩa (tùy chọn)
      images?: string[]; // Ảnh minh họa
      audioFiles?: string[]; // File âm thanh phát âm
    };
    grammar?: {
      rule: string; // Quy tắc ngữ pháp
      examples: string[]; // Ví dụ minh họa
    };
    dialogue?: {
      script: string; // Kịch bản hội thoại
      audio?: string; // Link file âm thanh
      translation?: string; // Bản dịch hội thoại
    };
    reading?: {
      passage: string; // Đoạn văn
      questions?: string[]; // Câu hỏi hiểu bài
    };
    exercises?: {
      type: string; // Loại bài tập: multiple, drag, fill...
      questions: any[]; // Dữ liệu câu hỏi
    }[];
  };
  locked?: boolean; // Bài học bị khóa không
  estimatedDuration?: number; // Thời gian học dự kiến (phút)
  materials?: string[]; // File PDF, worksheet, tài liệu kèm theo
  thumbnail?: string; // Ảnh đại diện bài học
  audioIntro?: string; // Âm thanh mở đầu
  videoIntro?: string; // Video hướng dẫn
  tags?: string[]; // Từ khóa (A1, greetings, vocabulary, ...)
  isActive: LessonStatus; // Trạng thái hiển thị
  createdAt?: Date; // Ngày tạo
  updatedAt?: Date; // Ngày cập nhật
  createdBy: Types.ObjectId; // Người tạo
  updatedBy: Types.ObjectId; // Người cập nhật
}

export interface ILessonInput extends Partial<ILesson> {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonResponse extends Omit<ILesson, '_id'> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'lessons', timestamps: true })
export class Lesson implements ILesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: LessonType })
  type: LessonType;

  @Prop({ enum: LessonLevel, default: LessonLevel.A1, required: true })
  level: LessonLevel;

  @Prop()
  orderIndex?: number;

  @Prop({ required: true, type: Types.ObjectId })
  unit: Types.ObjectId;

  @Prop()
  topic?: string;

  @Prop({ enum: LessonSkill, default: LessonSkill.VOCABULARY })
  skillFocus?: LessonSkill;

  @Prop({ required: true, type: Object })
  content: {
    vocabulary?: {
      words: string[];
      definitions?: string[];
      images?: string[];
      audioFiles?: string[];
    };
    grammar?: {
      rule: string;
      examples: string[];
    };
    dialogue?: {
      script: string;
      audio?: string;
      translation?: string;
    };
    reading?: {
      passage: string;
      questions?: string[];
    };
    exercises?: {
      type: string;
      questions: any[];
    }[];
  };

  @Prop({ default: false })
  locked?: boolean;

  @Prop()
  estimatedDuration?: number;

  @Prop({ type: [String], default: [] })
  materials?: string[];

  @Prop()
  thumbnail?: string;

  @Prop()
  audioIntro?: string;

  @Prop()
  videoIntro?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ enum: LessonStatus, default: LessonStatus.ACTIVE })
  isActive: LessonStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
