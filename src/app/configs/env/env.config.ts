import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_ACCESS_TOKEN_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_REFRESH_TOKEN_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_VERIFICATION_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_VERIFICATION_TOKEN_SECRET is required'),
  JWT_VERIFICATION_EXPIRES_IN: z.string().default('1d'),
  API_PREFIX: z.string().default('/api/v1'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  EMAIL_SERVICE: z.string().min(1, 'EMAIL_SERVICE is required'),
  EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
  EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  CLOUDINARY_FOLDER: z.string().default('uploads'),
  PAYPAL_CLIENT_ID: z.string().min(1, 'PAYPAL_CLIENT_ID is required'),
  PAYPAL_CLIENT_SECRET: z.string().min(1, 'PAYPAL_CLIENT_SECRET is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().min(1, 'FIREBASE_CLIENT_EMAIL is required'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.error('Invalid environment variables:');
    for (const [key, messages] of Object.entries(errors)) {
      console.error(`- ${key}: ${messages?.join(', ')}`);
    }
    process.exit(1);
  }
  return parsed.data;
}
