import { Job, Worker } from 'bullmq';
import { Logger } from '@nestjs/common';
import { redis } from 'src/app/configs/redis/redis.client';
import { QUEUE_NAME } from '../queues/notification-subscription-expiring.queue';
import {
  findSubscriptionsExpiringSoon,
  createNotification,
  getUserForEmail,
} from '../lib/notification-job.lib';
import { NotificationType } from 'src/app/modules/notifications/schema/notification.schema';
import { sendEmail } from 'src/app/common/utils/mail.util';

const logger = new Logger('NotificationSubscriptionExpiringWorker');

export async function notificationSubscriptionExpiringProcessor() {
  const subscriptions = await findSubscriptionsExpiringSoon(7);

  for (const s of subscriptions as any[]) {
    const userId = s.userId?.toString?.() ?? s.userId;
    const endDate = s.endDate ? new Date(s.endDate).toLocaleDateString('vi-VN') : '';
    const packageId = s.packageId?.toString?.() ?? s.packageId;

    if (!userId) continue;

    try {
      await createNotification({
        userId,
        title: 'Gói đăng ký sắp kết thúc',
        message: `Gói đăng ký của bạn sẽ hết hạn${endDate ? ` vào ${endDate}` : ''}. Vui lòng gia hạn để tiếp tục sử dụng.`,
        type: NotificationType.REMINDER,
        data: { subscriptionId: s._id, packageId, endDate: s.endDate },
      });
    } catch (err) {
      logger.error(`Failed to create subscription-expiring notification for user ${userId}: ${(err as Error).message}`);
    }

    const user = await getUserForEmail(userId);
    if (user?.email) {
      sendEmail(
        user.email,
        'Gói đăng ký sắp kết thúc - HAPPY CAT',
        'notification-subscription-expiring',
        {
          displayName: user.fullname,
          endDate: endDate || undefined,
          year: new Date().getFullYear(),
        },
      ).catch((e) => logger.warn(`Subscription-expiring email failed for ${user.email}: ${(e as Error).message}`));
    }
  }

  logger.log(`Subscription expiring: processed ${subscriptions.length} notifications.`);
}

let workerInstance: Worker | null = null;

export async function initializeNotificationSubscriptionExpiringWorker() {
  if (workerInstance) {
    logger.log('Notification subscription expiring worker already initialized');
    return;
  }

  workerInstance = new Worker(
    QUEUE_NAME,
    async (_job: Job) => {
      await notificationSubscriptionExpiringProcessor();
    },
    {
      connection: redis,
      concurrency: 1,
    },
  );

  workerInstance.on('error', (err) => logger.error('Subscription expiring worker error:', err));
  workerInstance.on('completed', (job) => logger.log(`Subscription expiring job completed: ${job.id}`));
  workerInstance.on('failed', (job, err) =>
    logger.error(`Subscription expiring job failed: ${job?.id}`, err?.message),
  );

  logger.log('Notification subscription expiring worker started');
}
