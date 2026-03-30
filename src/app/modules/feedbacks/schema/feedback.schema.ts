import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

export interface IFeedback {
  userId: Types.ObjectId;
  content: string;
  rating: number;
}

@Schema({ collection: 'feedbacks', timestamps: true })
export class Feedback implements IFeedback {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
FeedbackSchema.index({ userId: 1, type: 1 });
FeedbackSchema.index({ isResolved: 1 });
