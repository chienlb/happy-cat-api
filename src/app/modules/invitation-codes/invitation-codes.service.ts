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

  async createInvitationCode(createInvitationCodeDto: CreateInvitationCodeDto, session: ClientSession) {
    try {
      const user = await this.userService.findUserById(createInvitationCodeDto.createdBy);
      if (!user) {
        throw new NotFoundException(
          'Creator of invitation code does not exist.',
        );
      }

      const slug = (createInvitationCodeDto.code || 'INVITE')
        .trim()
        .replace(/\s+/g, '_')
        .toUpperCase();

      const randomNumber = String(randomInt(0, 1_0000_0000)).padStart(8, '0');
      const userIdSuffix = user._id.toString().slice(-4).toUpperCase();
      const codeFinal = `${slug}_${randomNumber}_${userIdSuffix}`;

      const exists = await this.invitationCodeModel.findOne({
        code: codeFinal,
      }, null, { session });
      if (exists) {
        throw new BadRequestException(
          'Invitation code already exists, please try again.',
        );
      }

      const newInvitationCode = await this.invitationCodeModel.create({
        ...createInvitationCodeDto,
        code: codeFinal,
        usesLeft: createInvitationCodeDto.totalUses,
        startedAt: createInvitationCodeDto.startedAt || new Date(),
      }, { session });

      this.logger.log(
        `✅ New invitation code created for user ${user.username}: ${codeFinal}`,
      );

      return {
        message: 'Invitation code created successfully.',
        data: newInvitationCode,
      };
    } catch (error) {
      this.logger.error('❌ Error while creating invitation code:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Unable to create invitation code. Please try again later.',
      );
    }
  }
}
