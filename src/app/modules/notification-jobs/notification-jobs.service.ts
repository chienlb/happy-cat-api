import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { notificationAssignmentDueSoonQueue } from 'src/app/jobs/queues/notification-assignment-due-soon.queue';
import { notificationSubscriptionExpiringQueue } from 'src/app/jobs/queues/notification-subscription-expiring.queue';
import {
  notificationNewAssignmentQueue,
  NotificationNewAssignmentJobData,
} from 'src/app/jobs/queues/notification-new-assignment.queue';
import { initializeNotificationAssignmentDueSoonWorker } from 'src/app/jobs/workers/notification-assignment-due-soon.worker';
import { initializeNotificationSubscriptionExpiringWorker } from 'src/app/jobs/workers/notification-subscription-expiring.worker';
import { initializeNotificationNewAssignmentWorker } from 'src/app/jobs/workers/notification-new-assignment.worker';

@Injectable()
export class NotificationJobsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationJobsService.name);

  async onModuleInit() {
    await initializeNotificationAssignmentDueSoonWorker();
    await initializeNotificationSubscriptionExpiringWorker();
    await initializeNotificationNewAssignmentWorker();

    await this.scheduleRepeatableJobs();
    this.logger.log('Notification jobs: workers and repeatable jobs ready');
  }

  private async scheduleRepeatableJobs() {
    try {
      await notificationAssignmentDueSoonQueue.add(
        'assignment-due-soon-daily',
        {},
        { repeat: { pattern: '0 8 * * *' } },
      );
      this.logger.log('Scheduled repeatable job: assignment-due-soon (daily 8:00)');
    } catch (e) {
      this.logger.warn('Could not add repeatable assignment-due-soon job (may already exist):', (e as Error).message);
    }

    try {
      await notificationSubscriptionExpiringQueue.add(
        'subscription-expiring-daily',
        {},
        { repeat: { pattern: '0 8 * * *' } },
      );
      this.logger.log('Scheduled repeatable job: subscription-expiring (daily 8:00)');
    } catch (e) {
      this.logger.warn('Could not add repeatable subscription-expiring job (may already exist):', (e as Error).message);
    }
  }

  async notifyNewAssignment(assignmentId: string, classId: string): Promise<void> {
    const payload: NotificationNewAssignmentJobData = { assignmentId, classId };
    await notificationNewAssignmentQueue.add('new-assignment', payload);
    this.logger.log(`Enqueued new-assignment job: ${assignmentId} -> class ${classId}`);
  }
}
