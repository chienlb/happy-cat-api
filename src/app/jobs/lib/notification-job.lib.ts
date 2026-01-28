import mongoose, { Types } from 'mongoose';
import {
  Notification,
  NotificationSchema,
  NotificationType,
} from 'src/app/modules/notifications/schema/notification.schema';
import {
  Assignment,
  AssignmentSchema,
} from 'src/app/modules/assignments/schema/assignment.schema';
import {
  Subscription,
  SubscriptionSchema,
  SubscriptionStatus,
} from 'src/app/modules/subscriptions/schema/subscription.schema';
import { Group, GroupSchema } from 'src/app/modules/groups/schema/group.schema';
import { User, UserSchema } from 'src/app/modules/users/schema/user.schema';

function getNotificationModel() {
  return (
    mongoose.models[Notification.name] ??
    mongoose.model(Notification.name, NotificationSchema)
  );
}

function getAssignmentModel() {
  return (
    mongoose.models[Assignment.name] ??
    mongoose.model(Assignment.name, AssignmentSchema)
  );
}

function getSubscriptionModel() {
  return (
    mongoose.models[Subscription.name] ??
    mongoose.model(Subscription.name, SubscriptionSchema)
  );
}

function getGroupModel() {
  return (
    mongoose.models[Group.name] ?? mongoose.model(Group.name, GroupSchema)
  );
}

function getUserModel() {
  return (
    mongoose.models[User.name] ?? mongoose.model(User.name, UserSchema)
  );
}

export async function getUserForEmail(
  userId: string,
): Promise<{ email: string; fullname: string } | null> {
  const UserModel = getUserModel();
  const u = await UserModel.findById(userId)
    .select('email fullname')
    .lean()
    .exec();
  if (!u || !(u as any).email) return null;
  return {
    email: (u as any).email,
    fullname: (u as any).fullname ?? (u as any).username ?? 'Bạn',
  };
}

export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  senderId?: string;
  data?: Record<string, unknown>;
}) {
  const Model = getNotificationModel();
  const doc = new Model({
    userId: new Types.ObjectId(params.userId),
    senderId: params.senderId ? new Types.ObjectId(params.senderId) : undefined,
    title: params.title,
    message: params.message,
    type: params.type,
    data: params.data ?? {},
    isRead: false,
  });
  await doc.save();
  return doc;
}

export async function findAssignmentsDueSoon(withinDays = 3) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + withinDays);
  const AssignmentModel = getAssignmentModel();
  return AssignmentModel.find({
    dueDate: { $gte: now, $lte: end },
    isPublished: true,
  })
    .lean()
    .exec();
}

export async function findSubscriptionsExpiringSoon(withinDays = 7) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + withinDays);
  const SubscriptionModel = getSubscriptionModel();
  return SubscriptionModel.find({
    status: SubscriptionStatus.ACTIVE,
    endDate: { $gte: now, $lte: end },
  })
    .lean()
    .exec();
}

export async function findAssignmentById(assignmentId: string) {
  const AssignmentModel = getAssignmentModel();
  return AssignmentModel.findById(assignmentId).lean().exec();
}

export async function findGroupMembersByClassId(classId: string): Promise<string[]> {
  const GroupModel = getGroupModel();
  const group = await GroupModel.findById(classId).lean().exec();
  if (!group || !(group as any).members?.length) return [];
  return ((group as any).members as Types.ObjectId[]).map((m) => m.toString());
}
