import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateInvitationCodeDto } from './dto/create-invitation-code.dto';
import { UsersService } from '../users/users.service';
import {
  InvitationCode,
  InvitationCodeDocument,
} from './schema/invitation-code.schema';
import { randomInt } from 'crypto';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from '../../configs/redis/redis.service';

@Injectable()
export class InvitationCodesService {
  private readonly logger = new Logger(InvitationCodesService.name);

  constructor(
    @InjectModel(InvitationCode.name)
    private readonly invitationCodeModel: Model<InvitationCodeDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async createInvitationCode(
    dto: CreateInvitationCodeDto,
    session?: ClientSession, // ✔ session optional
  ) {
    try {
      // ✔ Lấy user bằng cách hỗ trợ session nếu có
      const user = await this.userService.findUserById(dto.createdBy);
      if (!user) {
        throw new NotFoundException(
          'Creator of invitation code does not exist.',
        );
      }

      // Tạo slug/code
      const slug = (dto.code || 'INVITE')
        .trim()
        .replace(/\s+/g, '_')
        .toUpperCase();

      const randomNumber = String(randomInt(0, 1_0000_0000)).padStart(8, '0');
      const userIdSuffix = user._id.toString().slice(-4).toUpperCase();
      const codeFinal = `${slug}_${randomNumber}_${userIdSuffix}`;

      // Kiểm tra tồn tại (optional session)
      const exists = await this.invitationCodeModel
        .findOne({ code: codeFinal })
        .session(session || null);

      if (exists) {
        throw new BadRequestException(
          'Invitation code already exists, please try again.',
        );
      }

      // Tạo mã mời
      const newCode = await this.invitationCodeModel.create(
        [
          {
            ...dto,
            code: codeFinal,
            usesLeft: dto.totalUses,
            startedAt: dto.startedAt || new Date(),
          },
        ],
        session ? { session } : {}, // ✔ if session exists
      );

      this.logger.log(
        `🎉 Created invitation code for ${user.username}: ${codeFinal}`,
      );

      return {
        message: 'Invitation code created successfully.',
        data: newCode[0],
      };
    } catch (error) {
      this.logger.error('❌ Error while creating invitation code:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Unable to create invitation code. Please try again later.',
      );
    }
  }

  async findInvitationCodeById(id: string): Promise<InvitationCodeDocument> {
    try {
      const cacheKey = `invitation-code:id=${id}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as InvitationCodeDocument;
      }
      const invitationCode = await this.invitationCodeModel.findById(id);
      if (!invitationCode) {
        throw new NotFoundException('Invitation code not found.');
      }
      const result = {
        data: invitationCode,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      this.logger.error('Error while finding invitation code:', error);
      throw new BadRequestException(
        'Unable to find invitation code. Please try again later.',
      );
    }
  }

  async findAllInvitationCodes(paginationDto: PaginationDto): Promise<{
    data: InvitationCodeDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    try {
      const cacheKey = `invitation-codes:page=${paginationDto.page}:limit=${paginationDto.limit}:sort=${paginationDto.sort}:order=${paginationDto.order}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as {
          data: InvitationCodeDocument[];
          total: number;
          totalPages: number;
          currentPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          limit: number;
        };
      }
      const invitationCodes = await this.invitationCodeModel
        .find()
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ createdAt: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.invitationCodeModel.countDocuments();
      const totalPages = Math.ceil(total / paginationDto.limit);
      const currentPage = paginationDto.page;
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
      const result = {
        data: invitationCodes,
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
      this.logger.error('Error while finding all invitation codes:', error);
      throw new BadRequestException(
        'Unable to find all invitation codes. Please try again later.',
      );
    }
  }
}
