import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SubmissionDocument = HydratedDocument<Submission>;

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
  MISSING = 'missing',
}

export interface ISubmission {
  assignmentId: Types.ObjectId; // ID của bài tập
  studentId: Types.ObjectId; // ID của học sinh
  studentNotes?: string; // Ghi chú của học sinh khi nộp bài
  submittedAt?: Date; // Ngày nộp bài
  score?: number; // Điểm số bài tập
  feedback?: string; // Phản hồi từ giáo viên
  attachments: string[]; // Đính kèm (nếu có)
  status: SubmissionStatus; // Trạng thái nộp bài
  gradedBy?: Types.ObjectId; // ID giáo viên chấm bài
}

@Schema({ collection: 'submissions', timestamps: true })
export class Submission implements ISubmission {
  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: String, required: false })
  studentNotes?: string;

  @Prop()
  submittedAt?: Date;

  @Prop()
  score?: number;

  @Prop()
  feedback?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({
    type: String,
    enum: SubmissionStatus,
    default: SubmissionStatus.MISSING,
  })
  status: SubmissionStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  gradedBy?: Types.ObjectId;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
