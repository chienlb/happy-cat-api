import { Queue } from 'bullmq';
import { redis } from 'src/app/configs/redis/redis.client';

export interface NotificationNewAssignmentJobData {
  assignmentId: string;
  classId: string;
}

export const QUEUE_NAME = 'notification-new-assignment';

export const notificationNewAssignmentQueue = new Queue(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 200,
    removeOnFail: 500,
  },
});
