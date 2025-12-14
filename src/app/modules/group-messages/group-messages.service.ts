import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GroupMessage,
  GroupMessageDocument,
} from './schema/group-message.schema';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';
import { GroupMessagesGateway } from './group-messages.gateway';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class GroupMessagesService {
  constructor(
    @InjectModel(GroupMessage.name)
    private groupMessageRepository: Model<GroupMessage>,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private readonly redisService: RedisService,
    private readonly groupMessagesGateway: GroupMessagesGateway,
  ) { }

  async createMessage(
    createGroupMessageDto: CreateGroupMessageDto,
  ): Promise<GroupMessageDocument> {
    try {
      const user = await this.usersService.findUserById(
        createGroupMessageDto.senderId.toString(),
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const group = await this.groupsService.findGroupById(
        createGroupMessageDto.groupId.toString(),
      );
      if (!group) {
        throw new NotFoundException('Group not found');
      }

      if (
        createGroupMessageDto.attachments &&
        createGroupMessageDto.attachments.length > 0
      ) {
        const attachments = await Promise.all(
          createGroupMessageDto.attachments.map(async (attachment) => {
            return attachment;
          }),
        );
        createGroupMessageDto.attachments = attachments;
      }

      if (
        createGroupMessageDto.mentions &&
        createGroupMessageDto.mentions.length > 0
      ) {
        const mentions = await Promise.all(
          createGroupMessageDto.mentions.map(async (mention) => {
            return mention;
          }),
        );
        createGroupMessageDto.mentions = mentions;
      }
      const groupMessage = new this.groupMessageRepository({
        ...createGroupMessageDto,
        senderId: user._id,
        groupId: group._id,
      });
      const savedMessage = await groupMessage.save();
      this.groupMessagesGateway.emitNewMessage(
        group._id.toString(),
        savedMessage,
      );
      return savedMessage;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create group message: ' + error.message,
        error,
      );
    }
  }

  async findMessagesByGroupId(
    groupId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    data: GroupMessageDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    try {
      const cacheKey = `group-messages:group-id=${groupId}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const group = await this.groupsService.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const messages = await this.groupMessageRepository
        .find({ groupId: group._id })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ createdAt: paginationDto.order === 'asc' ? 1 : -1 });
      if (!messages) {
        throw new NotFoundException('Messages not found');
      }
      const result = {
        data: messages,
        total: messages.length,
        totalPages: Math.ceil(messages.length / paginationDto.limit),
        currentPage: paginationDto.page,
        hasNextPage:
          paginationDto.page < Math.ceil(messages.length / paginationDto.limit),
        hasPreviousPage: paginationDto.page > 1,
        limit: paginationDto.limit,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find messages by group id: ' + error.message,
        error,
      );
    }
  }

  async findMessageById(id: string): Promise<{
    data: GroupMessageDocument;
  }> {
    try {
      const cacheKey = `group-message:id=${id}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const message = await this.groupMessageRepository.findById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const result = {
        data: message,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find message by id: ' + error.message,
        error,
      );
    }
  }

  async editMessage(
    id: string,
    updateGroupMessageDto: UpdateGroupMessageDto,
  ): Promise<{
    data: GroupMessageDocument;
  }> {
    try {
      const cacheKey = `group-message:id=${id}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const updatedMessage =
        await this.groupMessageRepository.findByIdAndUpdate(
          id,
          updateGroupMessageDto,
          { new: true },
        );
      if (!updatedMessage) {
        throw new NotFoundException('Message not found');
      }
      const result = {
        data: updatedMessage,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      this.groupMessagesGateway.emitEditMessage(
        message.data.groupId.toString(),
        updatedMessage,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update message: ' + error.message,
        error,
      );
    }
  }

  async deleteMessage(id: string): Promise<{
    data: GroupMessageDocument;
  }> {
    try {
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      await this.groupMessageRepository.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true },
      );
      this.groupMessagesGateway.emitDeleteMessage(
        message.data.groupId.toString(),
        id,
      );
      return {
        data: message.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete message: ' + error.message,
        error,
      );
    }
  }

  async markMessageAsRead(id: string): Promise<{
    data: GroupMessageDocument;
  }> {
    try {
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      await this.groupMessageRepository.findByIdAndUpdate(
        id,
        { readBy: [message.data.senderId] },
        { new: true },
      );
      this.groupMessagesGateway.emitReadReceipt(
        message.data.groupId.toString(),
        id,
        message.data.senderId.toString(),
      );
      return {
        data: message.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to mark message as read: ' + error.message,
        error,
      );
    }
  }

  async markMessageAsUnread(id: string): Promise<{
    data: GroupMessageDocument;
  }> {
    try {
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      await this.groupMessageRepository.findByIdAndUpdate(
        id,
        { readBy: [] },
        { new: true },
      );
      this.groupMessagesGateway.emitReadReceipt(
        message.data.groupId.toString(),
        id,
        message.data.senderId.toString(),
      );
      return {
        data: message.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to mark message as unread: ' + error.message,
        error,
      );
    }
  }

  async replyToMessage(
    id: string,
    replyToMessageDto: CreateGroupMessageDto,
  ): Promise<GroupMessageDocument> {
    try {
      const user = await this.usersService.findUserById(
        replyToMessageDto.senderId.toString(),
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const group = await this.groupsService.findGroupById(
        replyToMessageDto.groupId.toString(),
      );
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      replyToMessageDto.senderId = user._id;
      replyToMessageDto.groupId = group._id;
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      replyToMessageDto.replyTo = message.data._id;
      const savedMessage = await this.createMessage(replyToMessageDto);
      this.groupMessagesGateway.emitNewMessage(
        group._id.toString(),
        savedMessage,
      );
      return savedMessage;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to reply to message: ' + error.message,
        error,
      );
    }
  }

  async getMessageReplies(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<{
    data: GroupMessageDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    try {
      const cacheKey = `group-message:id=${id}:replies:page=${paginationDto.page}:limit=${paginationDto.limit}:order=${paginationDto.order}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const replies = await this.groupMessageRepository
        .find({
          replyTo: message.data._id,
        })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ createdAt: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.groupMessageRepository.countDocuments({
        replyTo: message.data._id,
      });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const currentPage = paginationDto.page;
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
      const result = {
        data: replies,
        total: total,
        totalPages: totalPages,
        currentPage: currentPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        limit: paginationDto.limit,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get message replies: ' + error.message,
        error,
      );
    }
  }

  async getMessageRepliesCount(id: string): Promise<number> {
    try {
      const cacheKey = `group-message:id=${id}:replies-count`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const message = await this.findMessageById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const count = await this.groupMessageRepository.countDocuments({
        replyTo: message.data._id,
      });
      const result = {
        data: count,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get message replies count: ' + error.message,
        error,
      );
    }
  }

  async getMessageGroupCount(groupId: string): Promise<number> {
    try {
      const cacheKey = `group-message:groupId=${groupId}:count`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const group = await this.groupsService.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const count = await this.groupMessageRepository.countDocuments({
        groupId: group._id,
        deletedAt: null,
      });
      const result = {
        data: count,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get message group count: ' + error.message,
        error,
      );
    }
  }
}
