import { Job, Worker } from 'bullmq';
import { Logger } from '@nestjs/common';
import { redis } from 'src/app/configs/redis/redis.client';
import {
  QUEUE_NAME,
  NotificationNewAssignmentJobData,
} from '../queues/notification-new-assignment.queue';
import {
  findAssignmentById,
  findGroupMembersByClassId,
  createNotification,
  getUserForEmail,
} from '../lib/notification-job.lib';
import { NotificationType } from 'src/app/modules/notifications/schema/notification.schema';
import { sendEmail } from 'src/app/common/utils/mail.util';

const logger = new Logger('NotificationNewAssignmentWorker');

export async function notificationNewAssignmentProcessor(
  job: Job<NotificationNewAssignmentJobData>,
) {
  const { assignmentId, classId } = job.data;

  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) {
    logger.warn(`Assignment not found: ${assignmentId}`);
    return;
  }

  const a = assignment as any;
  const title = a.title ?? 'Bài tập mới';

  let members: string[] = [];
  try {
    members = await findGroupMembersByClassId(classId);
  } catch (e) {
    logger.warn(`Group not found for classId ${classId}: ${(e as Error).message}`);
    return;
  }

  for (const userId of members) {
    try {
      await createNotification({
        userId,
        title: 'Bài tập mới',
        message: `Bạn có bài tập mới: "${title}". Vui lòng xem và nộp bài đúng hạn.`,
        type: NotificationType.ASSIGNMENT,
        data: { assignmentId, classId, createdBy: a.createdBy },
      });
    } catch (err) {
      logger.error(`Failed to create new-assignment notification for user ${userId}: ${(err as Error).message}`);
    }

    const user = await getUserForEmail(userId);
    if (user?.email) {
      sendEmail(
        user.email,
        'Bài tập mới - HAPPY CAT',
        'notification-new-assignment',
        {
          displayName: user.fullname,
          assignmentTitle: title,
          year: new Date().getFullYear(),
        },
      ).catch((e) => logger.warn(`New-assignment email failed for ${user.email}: ${(e as Error).message}`));
    }
  }

  logger.log(`New assignment: ${assignmentId} -> ${members.length} notifications.`);
}

let workerInstance: Worker | null = null;

export async function initializeNotificationNewAssignmentWorker() {
  if (workerInstance) {
    logger.log('Notification new-assignment worker already initialized');
    return;
  }

  workerInstance = new Worker<NotificationNewAssignmentJobData>(
    QUEUE_NAME,
    notificationNewAssignmentProcessor,
    {
      connection: redis,
      concurrency: 5,
    },
  );

  workerInstance.on('error', (err) => logger.error('New-assignment worker error:', err));
  workerInstance.on('completed', (job) => logger.log(`New-assignment job completed: ${job.id}`));
  workerInstance.on('failed', (job, err) =>
    logger.error(`New-assignment job failed: ${job?.id}`, err?.message),
  );

  logger.log('Notification new-assignment worker started');
}
