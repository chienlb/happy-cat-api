import slugify from 'slugify';
import { Model } from 'mongoose';

export async function generateSlug<T>(
  model: Model<T>,
  name: string
): Promise<string> {
  if (!name) return '';

  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });

  let slug = baseSlug;
  let count = 1;

  // Check if slug already exists
  while (await model.exists({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
