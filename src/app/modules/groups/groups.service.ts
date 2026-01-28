import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Group,
  GroupDocument,
  GroupType,
  GroupVisibility,
} from './schema/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UsersService } from '../users/users.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PackageType } from '../packages/schema/package.schema';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    private usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly cloudflareService: CloudflareService,
  ) { }

  async createGroup(userId: string, createGroupDto: CreateGroupDto, avatar?: any, background?: any): Promise<GroupDocument> {
    try {
      let groupAvatarUrl: string | null = null;
      let groupBackgroundUrl: string | null = null;
      if (avatar) {
        // Upload file trực tiếp lên Cloudflare R2
        const uploadResult = await this.cloudflareService.uploadFile(
          avatar,
          'groups/avatars',
        );
        groupAvatarUrl = uploadResult.fileUrl;
      }

      if (background) {
        // Upload file trực tiếp lên Cloudflare R2
        const uploadResultBg = await this.cloudflareService.uploadFile(
          background,
          'groups/backgrounds',
        );
        groupBackgroundUrl = uploadResultBg.fileUrl;
      }
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      let members: string[] = [];
      if (createGroupDto.members && createGroupDto.members.length > 0) {
        const resolved = await Promise.all(
          createGroupDto.members.map(async (member) => {
            const memberUser = await this.usersService.findUserById(member);
            if (!memberUser) {
              throw new NotFoundException('User not found');
            }
            return memberUser._id;
          }),
        );
        members = resolved.map((m) => m.toString());
      }
      const ownerId = userId;
      if (!members.includes(ownerId)) {
        members = [ownerId, ...members];
      }
      createGroupDto.members = members;
      const typeOwner = user.accountPackage;
      if (typeOwner === PackageType.FREE) {
        createGroupDto.maxMembers = 10;
      }
      if (typeOwner === PackageType.STANDARD) {
        createGroupDto.maxMembers = 20;
      }
      if (typeOwner === PackageType.PREMIUM) {
        createGroupDto.maxMembers = 50;
      }
      if (typeOwner === PackageType.VIP) {
        createGroupDto.maxMembers = 100;
      }
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const checkCode = await this.groupModel.findOne({ joinCode: code });

      if (checkCode) {
        const countCode = await this.groupModel.countDocuments({ joinCode: code });
        const newCode = (parseInt(countCode.toString(36)) + 1).toString(36).toUpperCase();
        createGroupDto.joinCode = newCode;
      }
      const newGroup = await this.groupModel.create({
        ...createGroupDto,
        owner: userId,
        members: createGroupDto.members,
        maxMembers: createGroupDto.maxMembers,
        isActive: true,
        joinCode: code,
        avatar: groupAvatarUrl,
        background: groupBackgroundUrl,
      });
      if (!newGroup) {
        throw new InternalServerErrorException('Failed to create group');
      }
      return newGroup;
    } catch (error) {
      throw new Error('Failed to create group: ' + error.message);
    }
  }

  async findGroupById(id: string): Promise<GroupDocument> {
    const group = await this.groupModel.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async findGroupsByUserId(userId: string): Promise<GroupDocument[]> {
    const groups = await this.groupModel.find({ members: userId });
    if (!groups) {
      throw new NotFoundException('Groups not found');
    }
    return groups;
  }

  async findGroupsBySchoolId(schoolId: string): Promise<GroupDocument[]> {
    const groups = await this.groupModel.find({ school: schoolId });
    if (!groups) {
      throw new NotFoundException('Groups not found');
    }
    return groups;
  }

  async findGroupsByClassId(classId: string): Promise<GroupDocument[]> {
    const groups = await this.groupModel.find({ classRef: classId });
    if (!groups) {
      throw new NotFoundException('Groups not found');
    }
    return groups;
  }

  async findAllGroups(paginationDto: PaginationDto): Promise<{
    data: GroupDocument[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    try {
      const cacheKey = `groups:page=${paginationDto.page}:limit=${paginationDto.limit}:sort=${paginationDto.sort}:order=${paginationDto.order}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const groups = await this.groupModel
        .find({ isActive: true })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.groupModel.countDocuments({
        isActive: true,
      });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const nextPage =
        paginationDto.page < totalPages ? paginationDto.page + 1 : null;
      const prevPage = paginationDto.page > 1 ? paginationDto.page - 1 : null;
      const result = {
        data: groups,
        total,
        totalPages,
        nextPage: nextPage ?? paginationDto.page,
        prevPage: prevPage ?? paginationDto.page,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result;
    } catch (error) {
      throw new Error('Failed to find all groups: ' + error.message);
    }
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDocument> {
    try {
      const updatedGroup = await this.groupModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        updateGroupDto,
        { new: true, runValidators: true },
      );

      if (!updatedGroup) {
        throw new NotFoundException('Group not found');
      }

      return updatedGroup;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid group ID');
      }

      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async deleteGroup(id: string): Promise<GroupDocument> {
    try {
      const deletedGroup = await this.groupModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { isActive: false },
        { new: true },
      );

      if (!deletedGroup) {
        throw new NotFoundException('Group not found');
      }

      return deletedGroup;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid group ID');
      }

      throw new InternalServerErrorException('Failed to delete group');
    }
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupDocument> {
    try {
      const group = await this.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (group.members.includes(user._id)) {
        throw new BadRequestException('User already in group');
      }
      group.members.push(user._id);
      return group.save();
    } catch (error) {
      throw new Error('Failed to join group: ' + error.message);
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<GroupDocument> {
    try {
      const group = await this.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!group.members.includes(user._id)) {
        throw new BadRequestException('User not in group');
      }
      group.members.splice(group.members.indexOf(user._id), 1);
      return group.save();
    } catch (error) {
      throw new Error('Failed to leave group: ' + error.message);
    }
  }

  async restoreGroup(groupId: string): Promise<GroupDocument> {
    try {
      const group = await this.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.isActive = true;
      return group.save();
    } catch (error) {
      throw new Error('Failed to restore group: ' + error.message);
    }
  }

  async changeGroupVisibility(
    groupId: string,
    visibility: GroupVisibility,
  ): Promise<GroupDocument> {
    try {
      const group = await this.findGroupById(groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.visibility = visibility;
      return group.save();
    } catch (error) {
      throw new Error('Failed to change group visibility: ' + error.message);
    }
  }
}
