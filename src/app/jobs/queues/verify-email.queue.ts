import { Queue } from 'bullmq';
import { redis } from 'src/app/configs/redis/redis.client';

export interface VerifyEmailJobData {
  email: string;
  codeDigits: {
    digit1: string;
    digit2: string;
    digit3: string;
    digit4: string;
    digit5: string;
    digit6: string;
  };
  fullname: string;
  username: string;
  year: number;
  telegramUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
}

export const QUEUE_NAME = 'verify-email';

export const verifyEmailQueue = new Queue(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
});
