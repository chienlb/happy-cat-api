import { Queue } from 'bullmq';
import { redis } from 'src/app/configs/redis/redis.client';

export interface EmailInformationJobData {
    email: string;
    fullname: string;
    username: string;
    password: string;
    year: number;
}

export const QUEUE_NAME = 'email-information';

export const emailInformationQueue = new Queue(QUEUE_NAME, {
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
