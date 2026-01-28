import { Queue } from 'bullmq';
import { redis } from 'src/app/configs/redis/redis.client';

export const QUEUE_NAME = 'notification-assignment-due-soon';

export const notificationAssignmentDueSoonQueue = new Queue(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
