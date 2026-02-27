import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type CompetitionDocument = HydratedDocument<Competition>;

export enum CompetitionStatus {
  UPCOMING = 'upcoming', // Sắp diễn ra
  ONGOING = 'ongoing', // Đang diễn ra
  ENDED = 'ended', // Đã kết thúc
  CANCELLED = 'cancelled', // Đã hủy
}

export enum CompetitionVisibility {
  PUBLIC = 'public', // Công khai
  PRIVATE = 'private', // Riêng tư
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice', // Câu hỏi đa lựa chọn
  TRUE_FALSE = 'true_false', // Câu hỏi đúng sai
  FILL_IN_THE_BLANK = 'fill_in_the_blank', // Câu hỏi điền vào chỗ trống
  ESSAY = 'essay', // Câu hỏi tự luận
}

export interface IQuestion {
  question: string;
  media?: string; // Media (ảnh, video, audio)
  options: string[]; // Danh sách câu trả lời
  correctAnswer: string; // Câu trả lời đúng
  score?: number; // Điểm số
  type: QuestionType; // Loại câu hỏi
  explanation?: string; // Giải thích
}


export interface CompetitionResult {
  userId: Types.ObjectId; // ID người tham gia
  score: number; // Điểm số đạt được
  rank?: number; // Xếp hạng (nếu có)
  submittedAt?: Date; // Thời gian nộp bài (nếu có)
}

export enum CompetitionType {
  RANK = 'rank', // Xếp hạng
  REVIEW = 'review', // Đánh giá
  TOURNAMENT = 'tournament', // Giải đấu
}


export interface ICompetition {
  name: string; // Tên cuộc thi
  description?: string; // Mô tả chi tiết
  type: CompetitionType; // Loại cuộc thi
  countQuestion: number; // Số lượng câu hỏi
  startTime: Date; // Thời gian bắt đầu
  endTime: Date; // Thời gian kết thúc
  createdBy?: Types.ObjectId; // ID người tạo
  updatedBy?: Types.ObjectId; // ID người cập nhật gần nhất
  totalParticipants: number; // Tổng số người tham gia
  listQuestion: IQuestion[]; // Danh sách câu hỏi
  participants?: Types.ObjectId[]; // Danh sách người tham gia
  maxParticipants?: number; // Số lượng người tham gia tối đa
  prize?: string; // Giải thưởng
  status: CompetitionStatus; // Trạng thái cuộc thi
  results?: CompetitionResult[]; // Kết quả cuộc thi
  badgeId?: Types.ObjectId; // Huy hiệu trao cho người chiến thắng
  visibility?: CompetitionVisibility; // Quyền truy cập cuộc thi
  isPublished: boolean; // Cuộc thi có được công khai không (có thể xem nhưng không tham gia nếu không đủ điều kiện)
}

@Schema({ collection: 'competitions', timestamps: true })
export class Competition implements ICompetition {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: CompetitionType,
    default: CompetitionType.RANK,
  })
  type: CompetitionType;

  @Prop({ default: 0 })
  countQuestion: number;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ default: 0 })
  totalParticipants: number;

  @Prop({ type: [Object], default: [] })
  listQuestion: IQuestion[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  participants?: Types.ObjectId[];

  @Prop()
  maxParticipants?: number;

  @Prop()
  prize?: string;

  @Prop({
    type: String,
    enum: CompetitionStatus,
    default: CompetitionStatus.UPCOMING,
  })
  status: CompetitionStatus;

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true },
        rank: { type: Number },
        submittedAt: { type: Date },
      },
    ],
    default: [],
  })
  results?: CompetitionResult[];

  @Prop({ type: Types.ObjectId, ref: 'Badge' })
  badgeId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: CompetitionVisibility,
    default: CompetitionVisibility.PUBLIC,
  })
  visibility?: CompetitionVisibility;

  @Prop({ default: false })
  isPublished: boolean;
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);

CompetitionSchema.pre('save', function (next) {
  const now = new Date();
  if (this.endTime < now) this.status = CompetitionStatus.ENDED;
  else if (this.startTime <= now && this.endTime >= now)
    this.status = CompetitionStatus.ONGOING;
  else if (this.startTime > now) this.status = CompetitionStatus.UPCOMING;
  next();
});

// Indexes
CompetitionSchema.index({ subject: 1, startTime: -1 });
CompetitionSchema.index({ type: 1, status: 1 });
CompetitionSchema.index({ name: 'text', description: 'text' });
