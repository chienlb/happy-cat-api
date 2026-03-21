import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommuniteDocument = HydratedDocument<Communite>;

export interface IComment {
  userId: string;
  content: string;
  image?: string;
}

export interface ICommunite {
  userId: string;
  content: string;
  image?: string;
  totalLikes: number;
  totalComments: number;
  comments: IComment[];
  isPublic: boolean;
}

@Schema({ _id: false })
export class Comment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  image?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ collection: 'communites', timestamps: true })
export class Communite {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  image?: string;

  @Prop({ type: Number, default: 0 })
  totalLikes: number;

  @Prop({ type: Number, default: 0 })
  totalComments: number;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: Boolean, default: true })
  isPublic: boolean;
}

export const CommuniteSchema = SchemaFactory.createForClass(Communite);