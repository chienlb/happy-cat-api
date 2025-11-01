import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<Class>;

export interface IClass {
  classId: string;
  className: string;
  schoolGrade: string;
  schoolId: string;
  schoolName: string;
  districtName: string;
  provinceName: string;
}

export interface IClassResponse extends IClass {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'classes', timestamps: true })
export class Class {
  @Prop({ required: true })
  classId: string;

  @Prop({ required: true })
  className: string;

  @Prop({ required: true })
  schoolGrade: string;

  @Prop({ required: true })
  schoolId: string;

  @Prop({ required: true })
  schoolName: string;

  @Prop({ required: true })
  districtName: string;

  @Prop({ required: true })
  provinceName: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
