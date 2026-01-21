import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type PronunciationExerciseDocument =
  HydratedDocument<PronunciationExercise>;

export enum PronunciationDifficulty {
  EASY = 'easy', // Dễ (từ đơn giản)
  MEDIUM = 'medium', // Trung bình (cụm từ)
  HARD = 'hard', // Khó (câu dài, ngữ điệu)
}

export enum PronunciationExerciseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface IPronunciationExercise {
  _id?: Types.ObjectId;

  // Thông tin bài tập
  text: string; // Từ/cụm từ/câu cần phát âm
  ipa?: string; // Ký hiệu IPA (International Phonetic Alphabet)
  translation?: string; // Bản dịch (nếu cần)
  description?: string; // Mô tả bài tập

  // Audio mẫu
  referenceAudio?: string; // URL audio phát âm chuẩn (từ Cloudflare R2)
  referenceAudioDuration?: number; // Thời lượng audio (giây)

  // Phân loại
  lessonId?: Types.ObjectId; // Thuộc bài học nào (nếu có)
  unitId?: Types.ObjectId; // Thuộc unit nào (nếu có)
  level: string; // CEFR level: A1, A2, B1, B2, C1, C2
  difficulty: PronunciationDifficulty; // Độ khó
  topic?: string; // Chủ đề (greetings, numbers, colors...)
  tags?: string[]; // Tags để tìm kiếm

  // Cấu hình chấm điểm
  minScore?: number; // Điểm tối thiểu để pass (0-100)
  maxAttempts?: number; // Số lần thử tối đa (null = không giới hạn)

  // Metadata
  isActive: PronunciationExerciseStatus;
  orderIndex?: number; // Thứ tự trong lesson/unit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

@Schema({ collection: 'pronunciation_exercises', timestamps: true })
export class PronunciationExercise implements IPronunciationExercise {
  @Prop({ required: true })
  text: string;

  @Prop()
  ipa?: string;

  @Prop()
  translation?: string;

  @Prop()
  description?: string;

  @Prop()
  referenceAudio?: string;

  @Prop()
  referenceAudioDuration?: number;

  @Prop({ type: Types.ObjectId, ref: 'Lesson' })
  lessonId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Unit' })
  unitId?: Types.ObjectId;

  @Prop({ required: true, default: 'A1' })
  level: string;

  @Prop({
    enum: PronunciationDifficulty,
    default: PronunciationDifficulty.EASY,
    required: true,
  })
  difficulty: PronunciationDifficulty;

  @Prop()
  topic?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: 60, min: 0, max: 100 })
  minScore?: number;

  @Prop()
  maxAttempts?: number;

  @Prop({
    enum: PronunciationExerciseStatus,
    default: PronunciationExerciseStatus.ACTIVE,
  })
  isActive: PronunciationExerciseStatus;

  @Prop({ default: 0 })
  orderIndex?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const PronunciationExerciseSchema = SchemaFactory.createForClass(
  PronunciationExercise,
);

// Indexes để tối ưu tìm kiếm
PronunciationExerciseSchema.index({ lessonId: 1, orderIndex: 1 });
PronunciationExerciseSchema.index({ unitId: 1 });
PronunciationExerciseSchema.index({ level: 1, difficulty: 1 });
PronunciationExerciseSchema.index({ topic: 1 });
PronunciationExerciseSchema.index({ tags: 1 });
PronunciationExerciseSchema.index({ isActive: 1 });
