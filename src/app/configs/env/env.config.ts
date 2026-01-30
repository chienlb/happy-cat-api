import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.preprocess(
    (v) => {
      const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
      return ['development', 'production', 'test'].includes(s) ? s : 'development';
    },
    z.enum(['development', 'production', 'test']),
  ),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_ACCESS_TOKEN_SECRET is required'),
  JWT_ACCESS_TOKEN_EXPIRATION: z.string().default('1h'),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_REFRESH_TOKEN_SECRET is required'),
  JWT_REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
  JWT_VERIFICATION_TOKEN_SECRET: z
    .string()
    .min(1, 'JWT_VERIFICATION_TOKEN_SECRET is required'),
  JWT_VERIFICATION_TOKEN_EXPIRATION: z.string().default('5m'),
  EMAIL_SERVICE: z.string().min(1, 'EMAIL_SERVICE is required'),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
  EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3001')
    .transform((v) => v.split(',').map((x) => x.trim())),
  CORS_CREDENTIALS: z
    .preprocess(
      (v) => (typeof v === 'string' ? v === 'true' : Boolean(v)),
      z.boolean(),
    )
    .default(true),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().min(1).default(100),
  BODY_LIMIT_JSON: z.string().default('1mb'),
  BODY_LIMIT_URLENCODED: z.string().default('1mb'),
  TRUST_PROXY: z
    .string()
    .transform((v) => v === 'true')
    .default(false),
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api'),
  SWAGGER_TITLE: z.string().default('English Learning API'),
  SWAGGER_DESCRIPTION: z
    .string()
    .default('API documentation for English Learning Platform'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  SWAGGER_TAG: z.string().default('education,english,learning'),
  SWAGGER_PATH: z.string().default('docs'),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_MODE: z.enum(['sandbox', 'live']).default('sandbox'),
  PAYPAL_RETURN_URL: z.string().optional(),
  PAYPAL_CANCEL_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('english_learning_uploads'),
  CF_ACCOUNT_ID: z.string().optional(),
  CF_IMAGES_TOKEN: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_BASE: z.string().optional(),
  OPEN_ROUTER_API: z.string().optional(),
  AZURE_SPEECH_KEY: z.string().optional(),
  AZURE_SPEECH_REGION: z.string().optional(),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  VNPAY_TMN_CODE: z.string().optional(),
  VNPAY_HASH_SECRET: z.string().optional(),
  VNPAY_RETURN_URL: z.string().optional(),
  VNPAY_API_URL: z.string().optional(),
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
