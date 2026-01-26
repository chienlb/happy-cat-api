import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Model } from 'mongoose';
import { generateSlug } from 'src/app/common/utils/slug.util';

export type GroupDocument = HydratedDocument<Group>;

export enum GroupType {
  CLASS = 'class', // Nhóm học tập theo lớp
  SUBJECT = 'subject', // Nhóm học tập theo phân chia
  CUSTOM = 'custom', // Nhóm do giáo viên hoặc phụ huynh tự tạo
}

export enum GroupVisibility {
  PUBLIC = 'public', // Ai cũng có thể thấy
  PRIVATE = 'private', // Chỉ thành viên mới thấy
  HIDDEN = 'hidden', // Ẩn hoàn toàn, chỉ admin quản lý
}

export interface IGroup {
  groupName: string; // Tên nhóm
  description?: string; // Mô tả ngắn
  slug: string; // Đường dẫn định danh (vd: lop-1a1)
  type: GroupType; // Loại nhóm
  visibility: GroupVisibility; // Ai có thể thấy nhóm này
  owner: Types.ObjectId; // Người tạo nhóm (thường là giáo viên)
  members: Types.ObjectId[]; // Danh sách thành viên trong nhóm
  maxMembers?: number; // Giới hạn số lượng thành viên
  isActive: boolean; // Nhóm còn hoạt động không
  joinCode?: string; // Mã mời tham gia nhóm (tự sinh)
  avatar?: string; // Ảnh đại diện nhóm
  background?: string; // Ảnh nền nhóm
}

export interface IGroupResponse extends IGroup {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'groups', timestamps: true })
export class Group implements IGroup {
  @Prop({ required: true })
  groupName: string;

  @Prop()
  description?: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, enum: GroupType })
  type: GroupType;

  @Prop({ required: true, enum: GroupVisibility })
  visibility: GroupVisibility;

  @Prop({ required: true, type: Types.ObjectId })
  owner: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId] })
  members: Types.ObjectId[];

  @Prop()
  maxMembers?: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  joinCode?: string;

  @Prop()
  avatar?: string;

  @Prop()
  background?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

// Use the model bound to this document to avoid using a detached/global model
GroupSchema.pre('validate', async function (next) {
  const docModel = (this.constructor as Model<Group>);
  this.slug = await generateSlug(docModel, this.groupName);
  next();
});