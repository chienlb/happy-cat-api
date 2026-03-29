import { Job, Worker } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Connection, Model, Types } from 'mongoose';
import { redis } from 'src/app/configs/redis/redis.client';
import {
  QUEUE_NAME,
  NotificationNewAssignmentJobData,
} from '../queues/notification-new-assignment.queue';
import {
  Assignment,
  AssignmentDocument,
  AssignmentSchema,
} from 'src/app/modules/assignments/schema/assignment.schema';
import { Group, GroupDocument, GroupSchema } from 'src/app/modules/groups/schema/group.schema';
import { NotificationType } from 'src/app/modules/notifications/schema/notification.schema';
import {
  Notification,
  NotificationDocument,
  NotificationSchema,
} from 'src/app/modules/notifications/schema/notification.schema';
import {
  User,
  UserDocument,
  UserRole,
  UserSchema,
  UserStatus,
} from 'src/app/modules/users/schema/user.schema';
import { sendEmail } from 'src/app/common/utils/mail.util';

const logger = new Logger('NotificationNewAssignmentWorker');

let assignmentModel: Model<AssignmentDocument> | null = null;
let groupModel: Model<GroupDocument> | null = null;
let userModel: Model<UserDocument> | null = null;
let notificationModel: Model<NotificationDocument> | null = null;

export async function notificationNewAssignmentProcessor(
  job: Job<NotificationNewAssignmentJobData>,
) {
  if (!assignmentModel || !groupModel || !userModel || !notificationModel) {
    throw new Error('Notification worker models are not initialized');
  }

  const { assignmentId, classId, notifyAllStudents } = job.data;

  const assignment = await assignmentModel.findById(assignmentId).lean().exec();
  if (!assignment) {
    logger.warn(`Assignment not found: ${assignmentId}`);
    return;
  }

  const a = assignment as any;
  const title = a.title ?? 'Bài tập mới';

  let recipients: string[] = [];
  let recipientUsers: Array<{ _id: Types.ObjectId; email?: string; fullname?: string; username?: string }> = [];

  if (notifyAllStudents) {
    recipientUsers = await userModel
      .find({ role: UserRole.STUDENT, status: UserStatus.ACTIVE })
      .select('_id email fullname username')
      .lean()
      .exec();
    recipients = recipientUsers.map((u: any) => u._id.toString());
  } else if (classId) {
    try {
      const group = await groupModel.findById(classId).select('members').lean().exec();
      const memberIds: string[] = ((group as any)?.members ?? []).map((m: Types.ObjectId) =>
        m.toString(),
      );

      if (memberIds.length) {
        recipientUsers = await userModel
          .find({
            _id: { $in: memberIds.map((id) => new Types.ObjectId(id)) },
            role: UserRole.STUDENT,
            status: UserStatus.ACTIVE,
          })
          .select('_id email fullname username')
          .lean()
          .exec();
        recipients = recipientUsers.map((u: any) => u._id.toString());
      }
    } catch (e) {
      logger.warn(
        `Group not found for classId ${classId}: ${(e as Error).message}`,
      );
      return;
    }
  }

  if (!recipients.length) {
    logger.log(`No recipients found for assignment ${assignmentId}`);
    return;
  }

  for (const userId of recipients) {
    try {
      await notificationModel.create({
        userId: new Types.ObjectId(userId),
        title: 'Bài tập mới',
        message: `Bạn có bài tập mới: "${title}". Vui lòng xem và nộp bài đúng hạn.`,
        type: NotificationType.ASSIGNMENT,
        data: {
          assignmentId,
          classId,
          lessonId: a.lessonId,
          createdBy: a.createdBy,
          target: notifyAllStudents ? 'all-students' : 'group-students',
        },
        isRead: false,
      });
    } catch (err) {
      logger.error(`Failed to create new-assignment notification for user ${userId}: ${(err as Error).message}`);
    }

    const user = recipientUsers.find((u: any) => u._id.toString() === userId);
    if (user?.email) {
      sendEmail(
        user.email,
        'Bài tập mới - HAPPY CAT',
        'notification-new-assignment',
        {
          displayName: user.fullname ?? user.username ?? 'Ban',
          assignmentTitle: title,
          year: new Date().getFullYear(),
        },
      ).catch((e) => logger.warn(`New-assignment email failed for ${user.email}: ${(e as Error).message}`));
    }
  }

  logger.log(`New assignment: ${assignmentId} -> ${recipients.length} notifications.`);
}

let workerInstance: Worker | null = null;

export async function initializeNotificationNewAssignmentWorker(
  connection: Connection,
) {
  if (workerInstance) {
    logger.log('Notification new-assignment worker already initialized');
    return;
  }

  assignmentModel =
    (connection.models[Assignment.name] as Model<AssignmentDocument>) ||
    connection.model(Assignment.name, AssignmentSchema);
  groupModel =
    (connection.models[Group.name] as Model<GroupDocument>) ||
    connection.model(Group.name, GroupSchema);
  userModel =
    (connection.models[User.name] as Model<UserDocument>) ||
    connection.model(User.name, UserSchema);
  notificationModel =
    (connection.models[Notification.name] as Model<NotificationDocument>) ||
    connection.model(Notification.name, NotificationSchema);

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
