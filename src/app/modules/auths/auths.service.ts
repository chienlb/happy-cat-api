import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserDocument,
  UserStatus,
  UserRole,
} from '../users/schema/user.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InvitationCodesService } from '../invitation-codes/invitation-codes.service';
import { HistoryInvitationsService } from '../history-invitations/history-invitations.service';
import { CreateInvitationCodeDto } from '../invitation-codes/dto/create-invitation-code.dto';
import { HistoryInvitationStatus } from '../history-invitations/dto/create-history-invitation.dto';
import {
  InvitationCode,
  InvitationCodeDocument,
  InvitationCodeType,
} from '../invitation-codes/schema/invitation-code.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as jwt from 'jsonwebtoken';
import { TokensService } from '../tokens/tokens.service';
import { sendEmail } from 'src/app/common/utils/mail.util';
import { randomUUID } from 'crypto';
import { Token, TokenDocument } from '../tokens/schema/token.schema';
import {
  LogoutAllDevicesAuthDto,
  LogoutDeviceAuthDto,
  LogoutNotDeviceAuthDto,
} from './dto/logout-auth.dto';
import mongoose from 'mongoose';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(InvitationCode.name)
    private readonly inviteCodeModel: Model<InvitationCodeDocument>,

    private readonly TokensService: TokensService,

    private readonly invitationCodesService: InvitationCodesService,
    private readonly historyInvitationsService: HistoryInvitationsService,

    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocument>,
  ) { }
  async register(registerAuthDto: RegisterAuthDto): Promise<Partial<User>> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Kiểm tra user trùng
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: registerAuthDto.email },
          { username: registerAuthDto.username },
        ],
      });
      if (existingUser) {
        throw new ConflictException('Email or username already exists.');
      }

      // 2. Kiểm tra logic role
      if (registerAuthDto.role === UserRole.STUDENT) {
        const missing: string[] = [];
        if (!registerAuthDto.inviteCode) {
          if (!registerAuthDto.school) missing.push('school');
          if (!registerAuthDto.className) missing.push('className');
          if (!registerAuthDto.teacher) missing.push('teacher');
          if (!registerAuthDto.parent) missing.push('parent');
        }
        if (missing.length > 0) {
          throw new BadRequestException(
            `Students must provide the following information: ${missing.join(
              ', ',
            )} or enter an invitation code.`,
          );
        }
      } else if (registerAuthDto.role === UserRole.TEACHER) {
        if (!registerAuthDto.school) {
          throw new BadRequestException(
            'Teachers must select the school where they teach.',
          );
        }
      }

      // 3. Xử lý mã mời học sinh nhập (nếu có)
      let invitedBy: string | null = null;

      if (
        registerAuthDto.inviteCode &&
        registerAuthDto.role === UserRole.STUDENT
      ) {
        const inviter = await this.inviteCodeModel.findOne({
          code: registerAuthDto.inviteCode,
        });

        if (!inviter) {
          this.logger.warn(
            `Invalid invitation code: ${registerAuthDto.inviteCode}`,
          );
          throw new NotFoundException(
            'Invalid invitation code or inviter does not exist.',
          );
        }

        const inviterUser = await this.userModel.findById(inviter.createdBy);
        if (!inviterUser) {
          this.logger.warn(
            `Inviter does not exist for code: ${registerAuthDto.inviteCode}`,
          );
          throw new NotFoundException(
            'The inviter does not exist for the provided invitation code.',
          );
        }

        if (inviterUser.role === UserRole.STUDENT) {
          throw new BadRequestException(
            'Invalid invitation code (students cannot invite).',
          );
        }

        invitedBy = inviter._id.toString();

        const historyUsage =
          await this.historyInvitationsService.createHistoryInvitation({
            userId: inviterUser._id.toString(),
            code: inviter.code,
            invitedAt: new Date().toISOString(),
            status: HistoryInvitationStatus.ACCEPTED,
          }, session);

        this.logger.log(
          `Invitation code ${inviter.code} used by ${registerAuthDto.email}. History record ID: ${historyUsage._id}`,
        );
      }

      // 4. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerAuthDto.password, salt);

      // 5. Tạo user mới (chưa lưu mã mời)
      const newUser = new this.userModel({
        ...registerAuthDto,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        isVerify: false,
        tokenVerify: '',
        invitedBy: invitedBy ? invitedBy : undefined,
      });

      // 6. Lưu user trước
      const savedUser = await newUser.save();
      this.logger.log(`User ${savedUser.username} registered successfully.`);

      // 7. Tạo mã mời (chỉ cho giáo viên hoặc quản trị)
      if (
        [UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN].includes(
          savedUser.role as UserRole,
        )
      ) {
        try {
          const invitationCodesData: CreateInvitationCodeDto = {
            createdBy: savedUser._id.toString(),
            event: 'Invitation code for student registration',
            description: `Invitation code created by ${savedUser.username} to invite other students.`,
            type: InvitationCodeType.GROUP_JOIN,
            totalUses: 100,
            usesLeft: 100,
            startedAt: new Date().toISOString(),
          };

          const { data: invitationCode } =
            await this.invitationCodesService.createInvitationCode(
              invitationCodesData,
              session,
            );

          // invitationCode có thể là một mảng hoặc một object tuỳ theo service trả về, nên kiểm tra và lấy .code phù hợp
          let codeToLog: string | undefined;
          if (Array.isArray(invitationCode)) {
            codeToLog = invitationCode[0]?.code;
          } else if (invitationCode && typeof invitationCode === 'object' && 'code' in invitationCode) {
            codeToLog = (invitationCode as any).code;
          }
          this.logger.log(
            `Invitation code created for ${savedUser.username}: ${codeToLog}`,
          );
        } catch (err) {
          this.logger.error('Error while creating invitation code:', err);
          // Không throw — vì không muốn làm fail luôn quá trình đăng ký
        }
      }
      const codeVerify = randomUUID().substring(0, 6);
      savedUser.codeVerify = codeVerify;
      await savedUser.save();

      // 8. Gửi email xác minh
      try {
        await sendEmail(
          savedUser.email,
          'Xác minh email',
          'account-verification-email',
          {
            brandName: 'EnglishOne',
            userName: savedUser.username,
            verificationCode: codeVerify,
            userEmail: savedUser.email,
            supportEmail: 'support@englishone.com',
            companyAddress: '242 Nguyen Trai, Q9, TP.HCM',
            websiteUrl: 'https://englishone.com',
            twitterUrl: '',
            facebookUrl: '',
            year: new Date().getFullYear(),
          },
        );
      } catch (err) {
        this.logger.error('Error while sending email verification:', err);
      }

      return savedUser.toObject();
    } catch (error) {
      this.logger.error(
        `Error registering user ${registerAuthDto.username}:`,
        error,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Registration failed. Please try again.');
    }
    finally {
      await session.endSession();
    }
  }

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<Partial<User> & { accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userModel.findOne({
        $or: [{ email: loginAuthDto.email }, { username: loginAuthDto.email }],
      });

      if (!user) {
        throw new NotFoundException(
          'User not found with the provided identifier.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        loginAuthDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password.');
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' },
      );

      const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        { expiresIn: '7d' },
      );

      await user.save();

      const userObj = user.toObject ? user.toObject() : { ...user };
      if ('password' in userObj) {
        // To satisfy the linter and avoid assigning undefined to a string, remove password key entirely
        delete (userObj as any).password;
      }

      await this.TokensService.createToken({
        userId: user._id.toString(),
        token: accessToken,
        deviceId: loginAuthDto.deviceId,
        typeDevice: loginAuthDto.typeDevice,
        typeLogin: loginAuthDto.typeLogin,
      });

      return {
        ...userObj,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Error logging in user ${loginAuthDto.email}:`, error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async verifyEmail(
    codeVerify: string,
  ): Promise<{ email: string; user: Partial<User> }> {
    const user = await this.userModel.findOne({ codeVerify });
    if (!user) {
      throw new NotFoundException('User not found with the provided code.');
    }

    user.isVerify = true;
    await user.save();

    return {
      email: user.email,
      user: user,
    };
  }

  async resendVerificationEmail(
    email: string,
  ): Promise<{ email: string; codeVerify: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found with the provided email.');
    }

    const codeVerify = randomUUID().substring(0, 6);
    user.codeVerify = codeVerify;
    await user.save();

    await sendEmail(email, 'Xác minh email', 'account-verification-email', {
      brandName: 'EnglishOne',
      userName: user.username,
      verificationCode: codeVerify,
      userEmail: user.email,
      supportEmail: 'support@englishone.com',
    });

    return {
      email: user.email,
      codeVerify: codeVerify,
    };
  }

  async forgotPassword(
    email: string,
  ): Promise<{ email: string; codeVerify: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found with the provided email.');
    }

    const codeVerify = randomUUID().substring(0, 6);
    user.codeVerify = codeVerify;
    await user.save();

    await sendEmail(email, 'Đặt lại mật khẩu', 'reset-password-email', {
      brandName: 'EnglishOne',
      userName: user.username,
      resetCode: codeVerify,
    });

    return {
      email: user.email,
      codeVerify: codeVerify,
    };
  }

  async resetPassword(codeVerify: string, password: string): Promise<void> {
    const user = await this.userModel.findOne({ codeVerify });
    if (!user) {
      throw new NotFoundException('User not found with the provided code.');
    }

    const salt = await bcrypt.genSalt(10);
  }

  async changePassword(
    email: string,
    password: string,
    codeVerify: string,
  ): Promise<{ user: Partial<User> }> {
    const user = await this.userModel.findOne({ email, codeVerify });
    if (!user) {
      throw new NotFoundException('User not found with the provided email.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return {
      user: user.toObject(),
    };
  }

  async logoutAllDevices(
    logoutAllDevicesAuthDto: LogoutAllDevicesAuthDto,
  ): Promise<{ message: string }> {
    const tokens = await this.tokenModel.updateMany(
      {
        userId: logoutAllDevicesAuthDto.userId,
        isDeleted: false,
      },
      { isDeleted: true },
    );
    if (tokens.modifiedCount === 0) {
      throw new NotFoundException('No tokens found for the provided user.');
    }

    return {
      message: 'Logout successful.',
    };
  }

  async logoutDevice(
    logoutDeviceAuthDto: LogoutDeviceAuthDto,
  ): Promise<{ message: string }> {
    const token = await this.tokenModel.updateOne(
      {
        userId: logoutDeviceAuthDto.userId,
        deviceId: logoutDeviceAuthDto.deviceId,
        isDeleted: false,
      },
      { isDeleted: true },
    );
    if (token.modifiedCount === 0) {
      throw new NotFoundException(
        'Token not found for the provided user and device.',
      );
    }

    return {
      message: 'Logout successful.',
    };
  }

  async logoutNotDevice(
    logoutNotDeviceAuthDto: LogoutNotDeviceAuthDto,
  ): Promise<{ message: string }> {
    const tokens = await this.tokenModel.updateMany(
      {
        userId: logoutNotDeviceAuthDto.userId,
        deviceId: { $ne: logoutNotDeviceAuthDto.deviceId },
      },
      { isDeleted: true },
    );
    if (tokens.modifiedCount === 0) {
      throw new NotFoundException(
        'No tokens found for the provided user and device.',
      );
    }

    return {
      message: 'Logout successful.',
    };
  }
}
