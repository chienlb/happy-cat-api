import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './schema/notification.schema';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationRepository: Model<NotificationDocument>,
    private usersService: UsersService,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    try {
      const user = await this.usersService.findUserById(
        createNotificationDto.userId as string,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (createNotificationDto.senderId) {
        const sender = await this.usersService.findUserById(
          createNotificationDto.senderId as string,
        );
        if (!sender) {
          throw new NotFoundException('Sender not found');
        }
      }

      const notification = new this.notificationRepository({
        userId: user._id,
        senderId: createNotificationDto.senderId
          ? new Types.ObjectId(createNotificationDto.senderId)
          : null,
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
        data: createNotificationDto.data,
        firebaseToken: createNotificationDto.firebaseToken,
        isRead: createNotificationDto.isRead,
        readAt: createNotificationDto.readAt,
      });
      await notification.save();
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNotificationById(id: string): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationRepository.findById(id);
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllNotifications(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: NotificationDocument[];
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    limit: number;
  }> {
    try {
      const notifications = await this.notificationRepository
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await this.notificationRepository.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      return {
        data: notifications,
        total: total,
        totalPages: totalPages,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : currentPage === totalPages
              ? null
              : totalPages,
        prevPage:
          currentPage > 1 ? currentPage - 1 : currentPage === 1 ? null : 1,
        limit: limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationRepository.findByIdAndUpdate(
        id,
        updateNotificationDto,
        { new: true },
      );
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteNotification(id: string): Promise<NotificationDocument> {
    try {
      const notification =
        await this.notificationRepository.findByIdAndDelete(id);
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async restoreNotification(id: string): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationRepository.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true },
      );
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNotificationsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: NotificationDocument[];
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    limit: number;
  }> {
    try {
      const notifications = await this.notificationRepository
        .find({ userId: new Types.ObjectId(userId) })
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await this.notificationRepository.countDocuments({
        userId: new Types.ObjectId(userId),
      });
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      return {
        data: notifications,
        total: total,
        totalPages: totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage:
          currentPage > 1 ? currentPage - 1 : currentPage === 1 ? null : 1,
        limit: limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
