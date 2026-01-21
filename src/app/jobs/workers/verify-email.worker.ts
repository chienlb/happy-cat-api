import { Job, Worker } from 'bullmq';
import { QUEUE_NAME } from '../queues/verify-email.queue';
import { sendEmail } from 'src/app/common/utils/mail.util';
import { Logger } from '@nestjs/common';
import { redis } from 'src/app/configs/redis/redis.client';

const logger = new Logger('VerifyEmailWorker');

interface VerifyEmailJobData {
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

export const verifyEmailWorker = async (job: Job<VerifyEmailJobData>) => {
  const {
    email,
    codeDigits,
    fullname,
    username,
    year,
    telegramUrl,
    instagramUrl,
    twitterUrl,
    linkedinUrl,
  } = job.data;
  await sendEmail(email, 'Mã xác minh tài khoản HAPPY CAT', 'verify-email', {
    ...codeDigits,
    username: fullname || username || 'Bạn',
    year: year,
    telegramUrl: telegramUrl,
    instagramUrl: instagramUrl,
    twitterUrl: twitterUrl,
    linkedinUrl: linkedinUrl,
  });
};

let workerInstance: Worker | null = null;

export const initializeVerifyEmailWorker = async () => {
  if (workerInstance) {
    logger.log('Verify email worker already initialized');
    return;
  }

  logger.log('Initializing verify email worker...');
  workerInstance = new Worker(QUEUE_NAME, verifyEmailWorker, {
    connection: redis,
    concurrency: 10,
    limiter: {
      max: 10,
      duration: 1000,
    },
  });

  workerInstance.on('error', (error) => {
    logger.error('Verify email worker error:', error);
  });

  workerInstance.on('completed', (job) => {
    logger.log('Verify email job completed:', job.id);
  });

  workerInstance.on('failed', (job, error) => {
    logger.error('Verify email job failed:', error, job?.data);
  });

  logger.log('Verify email worker started successfully');
};
