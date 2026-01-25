import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

export interface IOtp {
  _id: Types.ObjectId;
  email: string;
  otp: string;
  isUsed: boolean;
  createdAt: Date;
}

@Schema({ timestamps: true, collection: 'otps' })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ index: { expires: 300 } })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
