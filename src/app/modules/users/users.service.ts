import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  User,
  UserDocument,
  UserRole,
  UserTypeAccount,
} from './schema/user.schema';
import mongoose, { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { InvitationCodeType } from '../invitation-codes/schema/invitation-code.schema';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';
import { PackageType } from '../packages/schema/package.schema';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => InvitationCodesService))
    private readonly invitationCodesService: InvitationCodesService,
  ) { }
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });
      if (existingUser) {
        throw new ConflictException('Email or username already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      await newUser.save({ session });

      if (
        createUserDto.role !== UserRole.STUDENT &&
        newUser.accountPackage !== PackageType.FREE
      ) {
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
            session,
          );
        if (!invitationCode.data) {
          throw new BadRequestException('Failed to create invitation code');
        }
        await session.commitTransaction();
        session.endSession();
        return newUser;
      }
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Failed to create user: ' + error.message);
    }
  }

  async findAll(
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
    try {
      const skip = (paginationDto.page - 1) * paginationDto.limit;
      const users = await this.userModel
        .find({ isDeleted: false })
        .skip(skip)
        .limit(paginationDto.limit)
        .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 })
        .session(session || null);
      const total = await this.userModel.countDocuments({ isDeleted: false });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const nextPage = paginationDto.page ? (paginationDto.page < totalPages ? paginationDto.page + 1 : null) : null;
      const prevPage = paginationDto.page ? (paginationDto.page > 1 ? paginationDto.page - 1 : null) : null;
      return { data: users as UserDocument[], total, totalPages, nextPage, prevPage, page: paginationDto.page, limit: paginationDto.limit };
    } catch (error) {
      throw new Error('Failed to find all users: ' + error.message);
    }
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
      const options = session ? { session, new: true } : { new: true };
      const user = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        options,
      );
      return user;
    } catch (error) {
      throw new Error('Failed to update user by ID: ' + error.message);
    }
  }

  async remove(
    id: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { session },
      );
      return user;
    } catch (error) {
      throw new Error('Failed to delete user by ID: ' + error.message);
    }
  }

  async getUserBySlug(
    slug: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne(
        { slug, isDeleted: false },
        null,
        session ? { session } : {},
      );
      return user;
    } catch (error) {
      throw new Error('Failed to get user by slug: ' + error.message);
    }
  }

  async getUserByEmail(
    email: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne(
        { email, isDeleted: false },
        null,
        session ? { session } : {},
      );
      return user;
    } catch (error) {
      throw new Error('Failed to get user by email: ' + error.message);
    }
  }

  async getUserByUsername(
    username: string,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne(
        { username, isDeleted: false },
        null,
        session ? { session } : {},
      );
      return user;
    } catch (error) {
      throw new Error('Failed to get user by username: ' + error.message);
    }
  }
}
