import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DistrictDocument = HydratedDocument<District>;

export interface IDistrict {
  districtId: string;
  districtName: string;
  districtCode: string;
  provinceCode: string;
}

export interface IDistrictResponse extends IDistrict {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'districts', timestamps: true })
export class District {
  @Prop({ required: true })
  districtId: string;

  @Prop({ required: true })
  districtName: string;

  @Prop({ required: true })
  districtCode: string;

  @Prop({ required: true })
  provinceCode: string;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
