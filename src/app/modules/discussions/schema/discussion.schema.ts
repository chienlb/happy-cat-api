import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type DiscussionDocument = HydratedDocument<Discussion>;

// Loại thông báo admin
export enum AnnouncementType {
  COMPETITION = 'COMPETITION', // Thông báo kì thi
  PROMOTION = 'PROMOTION', // Khuyến mãi
  UPDATE = 'UPDATE', // Cập nhật bài học mới
  LESSON = 'LESSON', // Bài học mới
  MAINTENANCE = 'MAINTENANCE', // Bảo trì hệ thống
  GENERAL = 'GENERAL', // Thông báo chung
}

// Độ ưu tiên thông báo
export enum AnnouncementPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Đối tượng nhận thông báo
export enum AnnouncementAudience {
  ALL = 'ALL', // Tất cả
  STUDENTS = 'STUDENTS', // Học viên
  TEACHERS = 'TEACHERS', // Giáo viên
  PARENTS = 'PARENTS', // Phụ huynh
  SPECIFIC_GROUP = 'SPECIFIC_GROUP', // Nhóm cụ thể
}

// Trạng thái thông báo
export enum AnnouncementStatus {
  DRAFT = 'DRAFT', // Nháp
  PUBLISHED = 'PUBLISHED', // Đã đăng
  SCHEDULED = 'SCHEDULED', // Đã lên lịch
  EXPIRED = 'EXPIRED', // Hết hạn
}

export interface IDiscussion {
  title: string; // Tiêu đề thông báo
  authorId: Types.ObjectId; // Admin tạo thông báo
  type: AnnouncementType; // Loại thông báo
  priority: AnnouncementPriority; // Độ ưu tiên
  audience: AnnouncementAudience; // Đối tượng nhận
  status: AnnouncementStatus; // Trạng thái
  content: string; // Nội dung thông báo
  thumbnail?: string; // Ảnh đại diện
  attachments?: string[]; // File đính kèm
  relatedIds?: {
    competitionId?: Types.ObjectId; // Link đến kì thi
    lessonId?: Types.ObjectId; // Link đến bài học
    unitId?: Types.ObjectId; // Link đến unit
    groupId?: Types.ObjectId; // Nếu audience là SPECIFIC_GROUP
  };
  publishedAt?: Date; // Thời gian đăng
  scheduledAt?: Date; // Lên lịch đăng
  expiresAt?: Date; // Hết hạn
  viewCount?: number; // Số lượt xem
  viewedBy?: Types.ObjectId[]; // Danh sách người đã xem
  tags?: string[]; // Tags để tìm kiếm
  isPinned?: boolean; // Ghim thông báo
  isEdited?: boolean; // Đã chỉnh sửa
  editedAt?: Date; // Thời gian chỉnh sửa
}

@Schema({ collection: 'discussions', timestamps: true })
export class Discussion implements IDiscussion {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({
    type: String,
    enum: AnnouncementType,
    required: true,
  })
  type: AnnouncementType;

  @Prop({
    type: String,
    enum: AnnouncementPriority,
    default: AnnouncementPriority.MEDIUM,
  })
  priority: AnnouncementPriority;

  @Prop({
    type: String,
    enum: AnnouncementAudience,
    required: true,
  })
  audience: AnnouncementAudience;

  @Prop({
    type: String,
    enum: AnnouncementStatus,
    default: AnnouncementStatus.DRAFT,
  })
  status: AnnouncementStatus;

  @Prop({ required: true })
  content: string;

  @Prop()
  thumbnail?: string;

  @Prop({ type: [String], default: [] })
  attachments?: string[];

  @Prop({
    type: {
      competitionId: { type: Types.ObjectId, ref: 'Competition' },
      lessonId: { type: Types.ObjectId, ref: 'Lesson' },
      unitId: { type: Types.ObjectId, ref: 'Unit' },
      groupId: { type: Types.ObjectId, ref: 'Group' },
    },
  })
  relatedIds?: {
    competitionId?: Types.ObjectId;
    lessonId?: Types.ObjectId;
    unitId?: Types.ObjectId;
    groupId?: Types.ObjectId;
  };

  @Prop()
  publishedAt?: Date;

  @Prop()
  scheduledAt?: Date;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: 0 })
  viewCount?: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  viewedBy?: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: false })
  isPinned?: boolean;

  @Prop({ default: false })
  isEdited?: boolean;

  @Prop()
  editedAt?: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);

// Tự động đánh dấu thời gian khi chỉnh sửa
DiscussionSchema.pre('save', function (next) {
  if (this.isModified('content') || this.isModified('title')) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Indexes để tối ưu query
DiscussionSchema.index({ type: 1, status: 1 });
DiscussionSchema.index({ audience: 1, status: 1 });
DiscussionSchema.index({ authorId: 1 });
DiscussionSchema.index({ createdAt: -1 });
DiscussionSchema.index({ publishedAt: -1 });
DiscussionSchema.index({ priority: 1, status: 1 });
DiscussionSchema.index({ expiresAt: 1 });
DiscussionSchema.index({ tags: 1 });
DiscussionSchema.index({ isPinned: 1, status: 1 });
DiscussionSchema.index({ 'relatedIds.competitionId': 1 });
DiscussionSchema.index({ 'relatedIds.lessonId': 1 });
DiscussionSchema.index({ 'relatedIds.groupId': 1 });
