import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole, UserStatus } from './schema/user.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { InvitationCodeType } from '../invitation-codes/schema/invitation-code.schema';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { StudentImportRowDto, ImportStudentsDto, ImportStudentsResultDto, ImportStudentDetailDto } from './dto/import-students.dto';

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
   * @param callerRole - Role của người gọi: ADMIN được tạo mọi role; TEACHER/PARENT chỉ được tạo STUDENT.
   */
  async createUser(
    createUserDto: CreateUserDto,
    session?: ClientSession,
    callerRole?: UserRole,
  ): Promise<UserDocument> {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database is not connected.');
    }

    if (callerRole === UserRole.TEACHER || callerRole === UserRole.PARENT) {
      if (createUserDto.role !== UserRole.STUDENT) {
        throw new ForbiddenException(
          'Teacher or parent can only create student account.',
        );
      }
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

      const result = newUser.toObject();
      delete (result as any).password;

      return result;
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

  /**
   * Import students from Excel file
   * File format: fullname, email, birthDate (YYYY-MM-DD), gender, phone (optional)
   */
  async importStudentsFromExcel(
    file: any,
    importDto: ImportStudentsDto,
    teacherId: string,
  ): Promise<ImportStudentsResultDto> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Parse Excel file
      const workbook = XLSX.read(file.buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      if (!worksheet) {
        throw new BadRequestException('Excel file is empty');
      }

      const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
      
      if (!rows || rows.length === 0) {
        throw new BadRequestException('No data found in Excel file');
      }

      // 2. Validate group exists & teacher has permission
      const groupModel = this.connection.model('Group');
      const group = await groupModel.findById(importDto.groupId).session(session);
      
      if (!group) {
        throw new NotFoundException('Group not found');
      }

      // Check if teacher is owner or admin
      const user = await this.userModel.findById(teacherId).session(session);
      if (!user) {  
        throw new NotFoundException('User not found');
      }
      if (user.role === UserRole.TEACHER && group.createdBy.toString() !== teacherId) {
        throw new ForbiddenException('You do not have permission to add students to this group');
      }

      // 3. Process each row
      const details: ImportStudentDetailDto[] = [];
      const autoEnroll = importDto.autoEnroll !== false; // Default true
      const sendEmail = importDto.sendInviteEmail !== false; // Default true

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +1 for 0-index, +1 for header row
        const detail: ImportStudentDetailDto = { row: rowNumber, email: '', status: 'FAILED' };

        try {
          // Convert and validate row
          const studentData = plainToClass(StudentImportRowDto, {
            fullname: row.fullname || row['Fullname'] || row['Full Name'] || '',
            email: row.email || row['Email'] || '',
            birthDate: row.birthDate || row['Birth Date'] || row['DOB'] || '',
            gender: row.gender || row['Gender'] || '',
            phone: row.phone || row['Phone'] || undefined,
          });

          const errors = await validate(studentData);
          if (errors.length > 0) {
            detail.reason = errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; ');
            detail.status = 'FAILED';
            details.push(detail);
            continue;
          }

          detail.email = studentData.email;
          detail.fullname = studentData.fullname;

          // Check if email already exists
          const existingUser = await this.userModel
            .findOne({ email: studentData.email })
            .session(session);

          if (existingUser) {
            detail.status = 'SKIPPED';
            detail.reason = `Email already exists (User ID: ${existingUser._id})`;
            details.push(detail);
            continue;
          }

          // Generate password
          const generatedPassword = importDto.autoPassword || this.generateRandomPassword();
          const hashedPassword = await bcrypt.hash(generatedPassword, 10);

          // Generate username from email
          const baseUsername = studentData.email.split('@')[0];
          let username = baseUsername;
          let usernameExists = await this.userModel
            .findOne({ username })
            .session(session);
          
          let counter = 1;
          while (usernameExists) {
            username = `${baseUsername}${counter}`;
            usernameExists = await this.userModel
              .findOne({ username })
              .session(session);
            counter++;
          }

          // Create user
          const newUser = new this.userModel({
            fullname: studentData.fullname,
            email: studentData.email,
            username,
            password: hashedPassword,
            birthDate: new Date(studentData.birthDate),
            gender: studentData.gender,
            phone: studentData.phone || undefined,
            role: UserRole.STUDENT,
            status: UserStatus.ACTIVE, // Imported students are active by default
            slug: username,
          });

          const savedUser = await newUser.save({ session });

          // Add to group if autoEnroll is true
          if (autoEnroll) {
            await groupModel
              .findByIdAndUpdate(
                importDto.groupId,
                { $addToSet: { members: savedUser._id } },
                { session }
              )
              .exec();
          }

          // Send invite email if enabled
          if (sendEmail) {
            // TODO: Send email with login credentials
            // await this.mailService.sendStudentImportEmail({
            //   email: studentData.email,
            //   username,
            //   password: generatedPassword,
            //   groupName: group.name
            // });
          }

          detail.userId = savedUser._id.toString();
          detail.generatedPassword = generatedPassword;
          detail.status = 'SUCCESS';
          details.push(detail);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          detail.reason = message;
          detail.status = 'FAILED';
          details.push(detail);
        }
      }

      await session.commitTransaction();

      // Calculate results
      const successCount = details.filter((d) => d.status === 'SUCCESS').length;
      const failedCount = details.filter((d) => d.status === 'FAILED').length;
      const skippedCount = details.filter((d) => d.status === 'SKIPPED').length;

      this.logger.log(
        `Imported students: ${successCount} success, ${failedCount} failed, ${skippedCount} skipped`,
      );

      return {
        success: successCount,
        failed: failedCount,
        skipped: skippedCount,
        total: rows.length,
        details,
        message: `Import completed: ${successCount} students created, ${failedCount} failed, ${skippedCount} skipped`,
      };
    } catch (error) {
      await session.abortTransaction();
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Import failed: ${message}`);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Generate random password
   */
  private generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
