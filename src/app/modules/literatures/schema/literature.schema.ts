import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type LiteratureDocument = HydratedDocument<Literature>;

export enum LiteratureType {
  STORY = 'story',
  POEM = 'poem',
  DIALOGUE = 'dialogue',
  SONG = 'song',
  ARTICLE = 'article',
  COMIC = 'comic',
}

export enum LiteratureLevel {
  STARTER = 'starter',
  BEGINNER = 'beginner',
  ELEMENTARY = 'elementary',
  PRE_INTERMEDIATE = 'pre-intermediate',
  INTERMEDIATE = 'intermediate',
}

export enum PartOfSpeech {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PRONOUN = 'pronoun',
  PREPOSITION = 'preposition',
  CONJUNCTION = 'conjunction',
  DETERMINER = 'determiner',
  EXCLAMATION = 'exclamation',
}

export type vocabulary = {
  word: string; // từ vựng
  partOfSpeech?: PartOfSpeech; // loại từ
  ipa?: string; // phiên âm
  meaning?: string; // nghĩa tiếng Việt
}

export type comprehensionQuestion = {
  question: string; // câu hỏi
  answer?: string; // đáp án
}

export type grammarPoints = {
  point: string; // điểm ngữ pháp
  explanation?: string; // giải thích
}

export interface ILiterature {
  title: string; // Tên bài đọc / truyện / thơ
  type: LiteratureType; // Loại nội dung
  level: LiteratureLevel; // Trình độ tiếng Anh
  topic?: string; // Chủ đề: animals, friendship, nature, school,...
  contentEnglish?: string; // Nội dung tiếng Anh không cần nếu là truyện tranh
  contentVietnamese?: string; // Bản dịch tiếng Việt (nếu có)
  vocabulary?: vocabulary[]; // Danh sách từ vựng chính
  grammarPoints?: grammarPoints[]; // Cấu trúc ngữ pháp liên quan
  audioUrl?: string; // Đường dẫn file âm thanh
  imageUrl?: string; // Ảnh minh họa (bìa hoặc hình nội dung)
  images?: {
    pageIndex: number;
    image: string;
  }[]; // Ảnh minh họa (bìa hoặc hình nội dung)
  comprehensionQuestions?: comprehensionQuestion[]; // Câu hỏi đọc hiểu
  isPublished: boolean; // Có công khai trên website không
  createdBy?: Types.ObjectId; // Người tạo (giáo viên / admin)
  updatedBy?: Types.ObjectId; // Người chỉnh sửa lần cuối
  createdAt?: Date; // Ngày tạo
  updatedAt?: Date; // Ngày cập nhật
}

@Schema({ collection: 'literatures', timestamps: true })
export class Literature {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: String,
    enum: LiteratureType,
    default: LiteratureType.STORY,
    required: true,
  })
  type: LiteratureType;

  @Prop({
    type: String,
    enum: LiteratureLevel,
    default: LiteratureLevel.BEGINNER,
    required: true,
  })
  level: LiteratureLevel;

  @Prop()
  topic?: string;

  @Prop({ required: true })
  contentEnglish: string;

  @Prop()
  contentVietnamese?: string;

  @Prop({ type: [Object], default: [] })
  vocabulary?: vocabulary[];

  @Prop({ type: [Object], default: [] })
  grammarPoints?: grammarPoints[];

  @Prop()
  audioUrl?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: [{ pageIndex: Number, image: String }], default: [] })
  images?: { pageIndex: number; image: string }[];

  @Prop({ type: [Object], default: [] })
  comprehensionQuestions?: comprehensionQuestion[];

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const LiteratureSchema = SchemaFactory.createForClass(Literature);
LiteratureSchema.index({ title: 'text', topic: 'text' });
