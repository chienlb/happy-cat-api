import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  User,
  UserDocument,
  UserRole,
  UserTypeAccount,
  UserStatus,
} from './schema/user.schema';
import mongoose, { ClientSession, Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { InvitationCodeType } from '../invitation-codes/schema/invitation-code.schema';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';
import { PackageType } from '../packages/schema/package.schema';
import { PaginationDto } from '../pagination/pagination.dto';

import { RedisService } from 'src/app/configs/redis/redis.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => InvitationCodesService))
    private readonly invitationCodesService: InvitationCodesService,
    private readonly redisService: RedisService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async createUser(
    createUserDto: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const isNewSession = !session;

    if (isNewSession) {
      mongooseSession.startTransaction();
    }
    try {
      const existingUser = await this.userModel
        .findOne({
          $or: [
            { email: createUserDto.email },
            { username: createUserDto.username },
          ],
        })
        .session(mongooseSession);
      if (existingUser) {
        throw new ConflictException('Email or username already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      await newUser.save({ session: mongooseSession });

      // Tạo invitation code cho user không phải STUDENT và có package không phải FREE
      if (createUserDto.role !== UserRole.STUDENT) {
        const invitationCode =
          await this.invitationCodesService.createInvitationCode(
            {
              createdBy: newUser._id.toString(),
              event: 'Invitation code for student registration',
              description: `Invitation code created by ${newUser.username}`,
              type: InvitationCodeType.GROUP_JOIN,
              totalUses: 0,
              usesLeft: 100,
              startedAt: new Date().toISOString(),
            },
            mongooseSession,
          );
        if (!invitationCode.data) {
          throw new BadRequestException('Failed to create invitation code');
        }
      }

      if (isNewSession) {
        await mongooseSession.commitTransaction();
        await mongooseSession.endSession();
      }

      return newUser;
    } catch (error) {
      if (isNewSession) {
        await mongooseSession.abortTransaction();
        await mongooseSession.endSession();
      }
      // Re-throw NestJS exceptions as-is
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create user: ' + error.message,
      );
    }
  }

  async findAllUsers(
    paginationDto: PaginationDto,
    session?: ClientSession,
  ): Promise<{
    data: UserDocument[];
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    page: number;
    limit: number;
  }> {
    const { page, limit, sort, order } = paginationDto;

    const cacheKey = `users:page=${page}:limit=${limit}:sort=${sort}:order=${order}`;
    this.logger.debug(`[findAllUsers] Cache key: ${cacheKey}`);

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      this.logger.debug(`[findAllUsers] Cache hit for key: ${cacheKey}`);
      return JSON.parse(cached);
    }
    this.logger.debug(`[findAllUsers] Cache miss for key: ${cacheKey}`);

    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments({
      status: UserStatus.ACTIVE,
    });
    const totalPages = Math.ceil(total / limit);
    const nextPage = totalPages > page ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const query = this.userModel
      .find({ status: UserStatus.ACTIVE })
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: order === 'asc' ? 1 : -1 });

    const users = session ? await query.session(session) : await query;

    const result = {
      data: users as UserDocument[],
      total,
      totalPages,
      nextPage,
      prevPage,
      page,
      limit: limit,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
    this.logger.debug(
      `[findAllUsers] Cache set successfully for key: ${cacheKey}`,
    );

    return result;
  }

  async findUserById(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findById(id).session(session || null);
      return user;
    } catch (error) {
      throw new Error('Failed to find user by ID: ' + error.message);
    }
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const options = session
        ? { session, new: true, runValidators: true }
        : { new: true, runValidators: true };
      const user = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        options,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update user by ID: ' + error.message,
      );
    }
  }

  async removeUserById(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const options = session ? { session, new: true } : { new: true };
      const user = await this.userModel.findByIdAndUpdate(
        id,
        { status: UserStatus.DELETED },
        options,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete user by ID: ' + error.message,
      );
    }
  }

  async getUserBySlug(
    slug: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const query = this.userModel.findOne({ slug, status: UserStatus.ACTIVE });
      const user = session ? await query.session(session) : await query;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get user by slug: ' + error.message,
      );
    }
  }

  async getUserByEmail(
    email: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const query = this.userModel.findOne({
        email,
        status: UserStatus.ACTIVE,
      });
      const user = session ? await query.session(session) : await query;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get user by email: ' + error.message,
      );
    }
  }

  async getUserByUsername(
    username: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const query = this.userModel.findOne({
        username,
        status: UserStatus.ACTIVE,
      });
      const user = session ? await query.session(session) : await query;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get user by username: ' + error.message,
      );
    }
  }
}
