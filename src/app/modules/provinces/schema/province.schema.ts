import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProvinceDocument = HydratedDocument<Province>;

export interface IProvince {
  provinceId: string;
  provinceName: string;
  provinceCode: string;
  countryCode: string;
}

export interface IProvinceResponse extends IProvince {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'provinces', timestamps: true })
export class Province {
  @Prop({ required: true })
  provinceId: string;

  @Prop({ required: true })
  provinceName: string;

  @Prop({ required: true })
  provinceCode: string;

  @Prop({ required: true })
  countryCode: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
