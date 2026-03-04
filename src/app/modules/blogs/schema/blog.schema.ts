import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { generateSlug } from 'src/app/common/utils/slug.util';

export type BlogDocument = HydratedDocument<Blog>;

export interface IBlog {
    title: string;
    slug: string;
    content: string;
    author: string;
    isActive: boolean;
    isFeatured: boolean;
}

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    isActive: boolean;

    @Prop({ required: true })
    isFeatured: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);


BlogSchema.pre('validate', async function (next) {
  if (this.title) {
    // Dùng model của document (từ @InjectModel) thay vì model() để tránh buffering
    // do model() gắn kết nối mặc định có thể chưa sẵn sàng
    this.slug = await generateSlug(this.constructor as Model<Blog>, this.title);
  }
  next();
});

