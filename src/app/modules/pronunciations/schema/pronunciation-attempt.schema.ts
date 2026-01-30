import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type PronunciationAttemptDocument =
  HydratedDocument<PronunciationAttempt>;

export enum PronunciationAttemptStatus {
  PENDING = 'pending', // Đang chờ chấm điểm (nếu dùng AI async)
  SCORED = 'scored', // Đã chấm điểm
  FAILED = 'failed', // Lỗi khi xử lý
}

export interface IPronunciationAttempt {
  _id?: Types.ObjectId;

  // Thông tin user và bài tập
  userId: Types.ObjectId; // Người thực hiện
  exerciseId: Types.ObjectId; // Bài tập đã làm

  // Audio của user
  userAudio?: string; // URL audio file từ Cloudflare R2
  audioDuration?: number; // Thời lượng audio (giây)

  // Kết quả chấm điểm
  score?: number; // Điểm số (0-100)
  accuracy?: number; // Độ chính xác (0-100)
  fluency?: number; // Độ trôi chảy (0-100)
  completeness?: number; // Độ hoàn chỉnh (0-100)
  overallScore?: number; // Tổng điểm trung bình

  // Feedback chi tiết
  feedback?: string; // Nhận xét tổng quan
  wordLevelFeedback?: Array<{
    // Feedback từng từ
    word: string;
    score: number;
    issues?: string[]; // Các vấn đề: "mispronunciation", "missing", "extra"
  }>;
  phonemeFeedback?: Array<{
    // Feedback từng âm vị
    phoneme: string;
    expected: string;
    actual?: string;
    score: number;
  }>;

  // Metadata
  status: PronunciationAttemptStatus;
  attemptNumber: number; // Lần thử thứ mấy (1, 2, 3...)
  isPassed?: boolean; // Đạt điểm tối thiểu chưa
  timeSpent?: number; // Thời gian làm bài (giây)
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ collection: 'pronunciation_attempts', timestamps: true })
export class PronunciationAttempt implements IPronunciationAttempt {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PronunciationExercise', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ default: '' })
  userAudio?: string;

  @Prop()
  audioDuration?: number;

  @Prop({ min: 0, max: 100 })
  score?: number;

  @Prop({ min: 0, max: 100 })
  accuracy?: number;

  @Prop({ min: 0, max: 100 })
  fluency?: number;

  @Prop({ min: 0, max: 100 })
  completeness?: number;

  @Prop({ min: 0, max: 100 })
  overallScore?: number;

  @Prop()
  feedback?: string;

  @Prop({
    type: [
      {
        word: String,
        score: Number,
        issues: [String],
      },
    ],
    default: [],
  })
  wordLevelFeedback?: Array<{
    word: string;
    score: number;
    issues?: string[];
  }>;

  @Prop({
    type: [
      {
        phoneme: String,
        expected: String,
        actual: String,
        score: Number,
      },
    ],
    default: [],
  })
  phonemeFeedback?: Array<{
    phoneme: string;
    expected: string;
    actual?: string;
    score: number;
  }>;

  @Prop({
    enum: PronunciationAttemptStatus,
    default: PronunciationAttemptStatus.PENDING,
  })
  status: PronunciationAttemptStatus;

  @Prop({ required: true, default: 1 })
  attemptNumber: number;

  @Prop({ default: false })
  isPassed?: boolean;

  @Prop()
  timeSpent?: number;
}

export const PronunciationAttemptSchema =
  SchemaFactory.createForClass(PronunciationAttempt);

// Indexes để tối ưu tìm kiếm
PronunciationAttemptSchema.index({ userId: 1, exerciseId: 1 });
PronunciationAttemptSchema.index({ userId: 1, createdAt: -1 });
PronunciationAttemptSchema.index({ exerciseId: 1, score: -1 });
PronunciationAttemptSchema.index({ status: 1 });
