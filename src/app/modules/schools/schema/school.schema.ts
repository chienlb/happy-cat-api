import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<School>;

export interface ISchool {
  schoolId: string;
  schoolName: string;
  schoolLevel: string;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
}

export interface ISchoolResponse extends ISchool {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'schools', timestamps: true })
export class School {
  @Prop({ required: true })
  schoolId: string;

  @Prop({ required: true })
  schoolName: string;

  @Prop({ required: true })
  schoolLevel: string;

  @Prop({ required: true })
  districtId: string;

  @Prop({ required: true })
  districtName: string;

  @Prop({ required: true })
  provinceId: string;

  @Prop({ required: true })
  provinceName: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
