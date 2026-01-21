import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHistoryInvitationDto } from './dto/create-history-invitation.dto';
import { UpdateHistoryInvitationDto } from './dto/update-history-invitation.dto';
import {
  HistoryInvitation,
  HistoryInvitationDocument,
} from './schema/history-invitation.schema';
import { ClientSession, Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class HistoryInvitationsService {
  constructor(
    @InjectModel(HistoryInvitation.name)
    private readonly historyModel: Model<HistoryInvitationDocument>,
    private readonly usersService: UsersService,
  ) {}

  // ============================================================
  // CREATE HISTORY (inside transaction)
  // ============================================================
  async createHistoryInvitation(
    dto: CreateHistoryInvitationDto,
    session?: ClientSession,
  ) {
    const user = await this.usersService.findUserById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const history = new this.historyModel({
      ...dto,
      userId: user._id,
    });

    return await history.save({ session });
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  async findAllHistoryInvitations(
    paginationDto: PaginationDto,
    session?: ClientSession,
  ) {
    try {
      const { page, limit, sort, order } = paginationDto;
      const skip = (page - 1) * limit;
      const historyInvitations = await this.historyModel
        .find({}, null, session ? { session } : {})
        .skip(skip)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .populate('userId')
        .lean()
        .exec();
      const total = await this.historyModel.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      return {
        data: historyInvitations,
        total,
        totalPages,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to find all history invitations. Please try again later.',
      );
    }
  }

  // ============================================================
  // FIND ONE
  // ============================================================
  async findOneHistoryInvitation(id: string, session?: ClientSession) {
    const data = await this.historyModel
      .findById(id, null, session ? { session } : {})
      .populate('userId')
      .lean()
      .exec();

    if (!data) throw new NotFoundException('History invitation not found');

    return data;
  }

  // ============================================================
  // UPDATE
  // ============================================================
  async updateHistoryInvitation(
    id: string,
    dto: UpdateHistoryInvitationDto,
    session?: ClientSession,
  ) {
    const updated = await this.historyModel
      .findByIdAndUpdate(id, dto, {
        new: true,
        session,
      })
      .populate('userId')
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('History invitation not found');

    return updated;
  }

  // ============================================================
  // DELETE
  // ============================================================
  async remove(id: string, session?: ClientSession) {
    const deleted = await this.historyModel
      .findByIdAndDelete(id, { session })
      .lean()
      .exec();

    if (!deleted) throw new NotFoundException('History invitation not found');

    return deleted;
  }
}
