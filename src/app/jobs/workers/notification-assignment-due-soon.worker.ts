import { Job, Worker } from 'bullmq';
import { Logger } from '@nestjs/common';
import { redis } from 'src/app/configs/redis/redis.client';
import { QUEUE_NAME } from '../queues/notification-assignment-due-soon.queue';
import {
  findAssignmentsDueSoon,
  findGroupMembersByClassId,
  createNotification,
  getUserForEmail,
} from '../lib/notification-job.lib';
import { NotificationType } from 'src/app/modules/notifications/schema/notification.schema';
import { sendEmail } from 'src/app/common/utils/mail.util';

const logger = new Logger('NotificationAssignmentDueSoonWorker');

export async function notificationAssignmentDueSoonProcessor() {
  const assignments = await findAssignmentsDueSoon(3);
  const notified = new Set<string>();

  for (const a of assignments as any[]) {
    const assignmentId = a._id?.toString?.() ?? a._id;
    const classId = a.classId?.toString?.() ?? a.classId;
    const title = a.title ?? 'Bài tập';
    const dueDate = a.dueDate ? new Date(a.dueDate).toLocaleDateString('vi-VN') : '';

    if (!classId) continue;

    let members: string[] = [];
    try {
      members = await findGroupMembersByClassId(classId);
    } catch (e) {
      logger.warn(`Group not found for classId ${classId}: ${(e as Error).message}`);
      continue;
    }

    for (const userId of members) {
      const key = `${assignmentId}:${userId}`;
      if (notified.has(key)) continue;
      notified.add(key);

      try {
        await createNotification({
          userId,
          title: 'Bài tập sắp đến hạn nộp',
          message: `Bài tập "${title}" sắp đến hạn nộp${dueDate ? ` (${dueDate})` : ''}. Vui lòng nộp bài đúng hạn.`,
          type: NotificationType.REMINDER,
          data: { assignmentId, classId, dueDate: a.dueDate },
        });
      } catch (err) {
        logger.error(`Failed to create due-soon notification for user ${userId}: ${(err as Error).message}`);
      }

      const user = await getUserForEmail(userId);
      if (user?.email) {
        sendEmail(
          user.email,
          'Bài tập sắp đến hạn nộp - HAPPY CAT',
          'notification-assignment-due-soon',
          {
            displayName: user.fullname,
            assignmentTitle: title,
            dueDate: dueDate || undefined,
            year: new Date().getFullYear(),
          },
        ).catch((e) => logger.warn(`Due-soon email failed for ${user.email}: ${(e as Error).message}`));
      }
    }
  }

  logger.log(`Assignment due-soon: processed ${assignments.length} assignments, ${notified.size} notifications.`);
}

let workerInstance: Worker | null = null;

export async function initializeNotificationAssignmentDueSoonWorker() {
  if (workerInstance) {
    logger.log('Notification assignment due-soon worker already initialized');
    return;
  }

  workerInstance = new Worker(
    QUEUE_NAME,
    async (_job: Job) => {
      await notificationAssignmentDueSoonProcessor();
    },
    {
      connection: redis,
      concurrency: 1,
    },
  );

  workerInstance.on('error', (err) => logger.error('Assignment due-soon worker error:', err));
  workerInstance.on('completed', (job) => logger.log(`Assignment due-soon job completed: ${job.id}`));
  workerInstance.on('failed', (job, err) =>
    logger.error(`Assignment due-soon job failed: ${job?.id}`, err?.message),
  );

  logger.log('Notification assignment due-soon worker started');
}
