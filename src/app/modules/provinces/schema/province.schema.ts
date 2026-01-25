import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, model } from 'mongoose';
import { generateSlug } from 'src/app/common/utils/slug.util';

export type ProvinceDocument = HydratedDocument<Province>;

export enum Region {
  NORTH = 'north',
  CENTRAL = 'central',
  SOUTH = 'south',
}

export interface IProvince {
  provinceName: string;
  slug: string;
  region: Region;
  country: string;
}

export interface IProvinceResponse extends IProvince {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'provinces', timestamps: true })
export class Province implements IProvince {
  @Prop({ required: true })
  provinceName: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, enum: Region })
  region: Region;

  @Prop({ required: true })
  country: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);

const ProvinceModel = model<Province>('Province', ProvinceSchema);

ProvinceSchema.pre('validate', async function (next) {
  this.slug = await generateSlug(ProvinceModel, this.provinceName);
  next();
});