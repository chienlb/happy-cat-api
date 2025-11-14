import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
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

@Injectable()
export class InvitationCodesService {
  private readonly logger = new Logger(InvitationCodesService.name);

  constructor(
    @InjectModel(InvitationCode.name)
    private readonly invitationCodeModel: Model<InvitationCodeDocument>,
    private readonly userService: UsersService,
  ) { }

  async createInvitationCode(
    dto: CreateInvitationCodeDto,
    session?: ClientSession,   // ✔ session optional
  ) {
    try {
      // ✔ Lấy user bằng cách hỗ trợ session nếu có
      const user = await this.userService.findUserById(dto.createdBy);
      if (!user) {
        throw new NotFoundException('Creator of invitation code does not exist.');
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

      this.logger.log(`🎉 Created invitation code for ${user.username}: ${codeFinal}`);

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
}
