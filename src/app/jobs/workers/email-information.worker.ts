import { Job, Worker } from 'bullmq';
import { QUEUE_NAME } from '../queues/email-information.queue';
import { sendEmail } from 'src/app/common/utils/mail.util';
import { Logger } from '@nestjs/common';
import { redis } from 'src/app/configs/redis/redis.client';

const logger = new Logger('EmailInformationWorker');

interface EmailInformationJobData {
  email: string;
  fullname: string;
  username: string;
  password: string;
  year: number;
}

export const emailInformationWorker = async (job: Job<EmailInformationJobData>) => {
  const { email, fullname, username, password, year } = job.data;
  const displayName = fullname || username || 'Bạn';
  await sendEmail(email, 'Thông tin tài khoản HAPPY CAT', 'email-information', {
    fullname,
    username,
    displayName,
    password,
    year,
  });
};

let workerInstance: Worker | null = null;

export const initializeEmailInformationWorker = async () => {
    if (workerInstance) {
        logger.log('Email information worker already initialized');
        return;
    }

    logger.log('Initializing email information worker...');
    workerInstance = new Worker(QUEUE_NAME, emailInformationWorker, {
        connection: redis,
        concurrency: 10,
        limiter: {
            max: 10,
            duration: 1000,
        },
    });

    workerInstance.on('error', (error) => {
        logger.error('Email information worker error:', error);
    });

    workerInstance.on('completed', (job) => {
        logger.log('Email information job completed:', job.id);
    });

    workerInstance.on('failed', (job, error) => {
        logger.error('Email information job failed:', error, job?.data);
    });

    logger.log('Email information worker started successfully');
};
