import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Model, model } from 'mongoose';
import { generateSlug } from 'src/app/common/utils/slug.util';

export type UnitDocument = HydratedDocument<Unit>;

export enum UnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETE = 'delete',
}

export enum UnitDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface IUnit {
  name: string; // Tên chủ đề học (Unit)
  description?: string; // Mô tả ngắn về Unit
  topic: string; // Chủ đề chính của Unit
  slug: string; // Đường dẫn thân thiện với SEO
  difficulty: UnitDifficulty; // Mức độ khó (Dễ, Trung bình, Khó)
  totalLessons: number; // Tổng số bài học trong Unit
  objectives: string[]; // Mục tiêu học tập chính
  orderIndex: number; // Thứ tự của Unit
  materials?: {
    textLessons?: string[]; // Đường dẫn file PDF, DOC...
    videos?: string[]; // Video bài giảng
    audios?: string[]; // Audio luyện nghe
    exercises?: string[]; // Bài tập tương tác hoặc link quiz
  };
  prerequisites?: Types.ObjectId[]; // Unit cần hoàn thành trước
  estimatedDuration?: number; // Thời gian học ước tính (phút)
  thumbnail?: string; // Ảnh minh họa
  banner?: string; // Ảnh banner (tùy chọn)
  tags?: string[]; // Tag: ["greetings", "A1", "self-learning"]
  isActive: UnitStatus; // Có hiển thị không
  createdBy: Types.ObjectId; // Người tạo
  updatedBy: Types.ObjectId; // Người cập nhật
}

export interface IUnitResponse extends IUnit {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'units', timestamps: true })
export class Unit implements IUnit {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: UnitDifficulty.EASY, enum: UnitDifficulty })
  difficulty: UnitDifficulty;

  @Prop({ required: true, default: 0 })
  orderIndex: number;

  @Prop({ required: true })
  totalLessons: number;

  @Prop({ type: [String], default: [] })
  objectives: string[];

  @Prop({
    type: {
      textLessons: { type: [String], default: [] },
      videos: { type: [String], default: [] },
      audios: { type: [String], default: [] },
      exercises: { type: [String], default: [] },
    },
    default: {},
  })
  materials: {
    textLessons?: string[];
    videos?: string[];
    audios?: string[];
    exercises?: string[];
  };

  @Prop({ type: [Types.ObjectId], default: [] })
  prerequisites?: Types.ObjectId[];

  @Prop()
  estimatedDuration?: number;

  @Prop()
  thumbnail?: string;

  @Prop()
  banner?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: UnitStatus.ACTIVE, enum: UnitStatus })
  isActive: UnitStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

const UnitModel = model<Unit>('Unit', UnitSchema);

// DISABLED: Pre-validate hook causes buffering timeout when checking slug existence
// Client must provide unique slug in the request
UnitSchema.pre('validate', async function (next) {
  this.slug = await generateSlug(this.constructor as Model<Unit>, this.name);
  next();
});
