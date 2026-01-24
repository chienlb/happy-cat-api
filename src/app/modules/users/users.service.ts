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
import { User, UserDocument, UserStatus } from './schema/user.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { InvitationCodeType } from '../invitation-codes/schema/invitation-code.schema';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';

type PaginatedUsers = {
  data: UserDocument[];
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  limit: number;
};

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => InvitationCodesService))
    private readonly invitationCodesService: InvitationCodesService,
    private readonly redisService: RedisService,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  /**
   * Create a new user. Optional session may be provided by caller.
   */
  async createUser(
    createUserDto: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database is not connected.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const createdLocalSession = !session;

    if (createdLocalSession) {
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
        throw new ConflictException('Email or username already exists.');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      await newUser.save({ session: mongooseSession });

      // If user role is not STUDENT, create invitation code for them
      // Normalize role to string to avoid enum-type lint errors
      const roleStr = String(
        (createUserDto as unknown as { role?: unknown }).role ?? '',
      ).toLowerCase();
      if (roleStr !== 'student') {
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

        if (!invitationCode || !invitationCode.data) {
          throw new BadRequestException('Failed to create invitation code.');
        }
      }

      if (createdLocalSession) {
        await mongooseSession.commitTransaction();
      }

      return newUser;
    } catch (err: unknown) {
      if (createdLocalSession) {
        try {
          await mongooseSession.abortTransaction();
        } catch {
          // ignore abort errors
        }
      }

      // Re-throw known Nest exceptions
      if (
        err instanceof BadRequestException ||
        err instanceof ConflictException
      ) {
        throw err;
      }

      const message = err instanceof Error ? err.message : String(err);
      this.logger.error('createUser failed', message);
      throw new InternalServerErrorException(
        `Failed to create user: ${message}`,
      );
    } finally {
      if (createdLocalSession) {
        try {
          await mongooseSession.endSession();
        } catch {
          // ignore
        }
      }
    }
  }

  /**
   * Get paginated active users. Results are cached for a short TTL.
   */
  async findAllUsers(
    paginationDto: PaginationDto,
    session?: ClientSession,
  ): Promise<PaginatedUsers> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
    } = paginationDto;

    const cacheKey = `users:page=${page}:limit=${limit}:sort=${sort}:order=${order}`;
    this.logger.debug(`[findAllUsers] Cache key: ${cacheKey}`);

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      this.logger.debug(`[findAllUsers] Cache hit for key: ${cacheKey}`);
      return JSON.parse(cached) as PaginatedUsers;
    }
    this.logger.debug(`[findAllUsers] Cache miss for key: ${cacheKey}`);

    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments({
      status: UserStatus.ACTIVE,
    });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const nextPage = totalPages > page ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const query = this.userModel
      .find({ status: UserStatus.ACTIVE })
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .select('-password');

    const users = session ? await query.session(session) : await query;

    const result: PaginatedUsers = {
      data: users,
      total,
      totalPages,
      nextPage,
      prevPage,
      page,
      limit,
    };

    // cache for 5 minutes
    await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
    this.logger.debug(`[findAllUsers] Cache set for key: ${cacheKey}`);

    return result;
  }

  async findUserById(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const q = this.userModel.findById(id).select('-password');
      const user = session ? await q.session(session) : await q;
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to find user by ID: ${message}`,
      );
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

      if ((user as any).password) {
        delete (user as any).password;
      }

      return user;
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to update user by ID: ${message}`,
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
        throw new NotFoundException('User not found.');
      }
      if ((user as any).password) {
        delete (user as any).password;
      }
      return user;
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to delete user by ID: ${message}`,
      );
    }
  }

  async getUserBySlug(
    slug: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const q = this.userModel.findOne({ slug, status: UserStatus.ACTIVE }).select('-password');
      const user = session ? await q.session(session) : await q;
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to get user by slug: ${message}`,
      );
    }
  }

  async getUserByEmail(
    email: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const q = this.userModel.findOne({ email, status: UserStatus.ACTIVE }).select('-password');
      const user = session ? await q.session(session) : await q;
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to get user by email: ${message}`,
      );
    }
  }

  async getUserByUsername(
    username: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const q = this.userModel.findOne({ username, status: UserStatus.ACTIVE }).select('-password');
      const user = session ? await q.session(session) : await q;
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(
        `Failed to get user by username: ${message}`,
      );
    }
  }
}
