import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Model } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
} from './schema/subscription.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { PackagesService } from '../packages/packages.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionRepository: Model<SubscriptionDocument>,
    private usersService: UsersService,
    private packagesService: PackagesService,
  ) { }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionDocument> {
    try {
      const user = await this.usersService.findUserById(
        createSubscriptionDto.userId,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const packageItem = await this.packagesService.findPackageById(
        createSubscriptionDto.packageId,
      );
      if (!packageItem) {
        throw new NotFoundException('Package not found');
      }
      const newSubscription = new this.subscriptionRepository({
        ...createSubscriptionDto,
        userId: user._id,
        packageId: packageItem._id,
        status: SubscriptionStatus.PENDING,
      });
      return await newSubscription.save();
    } catch (error) {
      throw new Error(
        'Failed to create subscription: ' + (error?.message || error),
      );
    }
  }

  async findSubscriptionByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<{
    data: SubscriptionDocument[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    try {
      const subscriptions = await this.subscriptionRepository
        .find({ userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .exec();
      const total = await this.subscriptionRepository.countDocuments({
        userId,
      });
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      return {
        data: subscriptions as SubscriptionDocument[],
        total,
        totalPages,
        nextPage: nextPage ?? page,
        prevPage: prevPage ?? page,
      };
    } catch (error) {
      throw new Error(
        'Failed to find subscription by user id: ' + (error?.message || error),
      );
    }
  }

  async findSubscriptionById(id: string): Promise<SubscriptionDocument> {
    try {
      const subscription = await this.subscriptionRepository.findById(id);
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
      return subscription;
    } catch (error) {
      throw new Error(
        'Failed to find subscription: ' + (error?.message || error),
      );
    }
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionDocument> {
    try {
      const subscription = await this.subscriptionRepository.findByIdAndUpdate(
        id,
        updateSubscriptionDto,
        { new: true },
      );
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
      return subscription;
    } catch (error) {
      throw new Error(
        'Failed to update subscription: ' + (error?.message || error),
      );
    }
  }

  async deleteSubscription(id: string): Promise<SubscriptionDocument> {
    try {
      const deletedSubscription =
        await this.subscriptionRepository.findOneAndUpdate(
          { _id: id },
          { isDeleted: true },
        );
      if (!deletedSubscription) {
        throw new NotFoundException('Subscription not found');
      }
      return deletedSubscription;
    } catch (error) {
      throw new Error(
        'Failed to delete subscription: ' + (error?.message || error),
      );
    }
  }

  async findAllSubscriptions(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<{
    data: SubscriptionDocument[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    try {
      const subscriptions = await this.subscriptionRepository
        .find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .exec();
      const total = await this.subscriptionRepository.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      return {
        data: subscriptions as SubscriptionDocument[],
        total,
        totalPages,
        nextPage: nextPage ?? page,
        prevPage: prevPage ?? page,
      };
    } catch (error) {
      throw new Error(
        'Failed to find all subscriptions: ' + (error?.message || error),
      );
    }
  }
}
