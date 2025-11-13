import { Injectable } from '@nestjs/common';
import { CreateHistoryInvitationDto } from './dto/create-history-invitation.dto';
import { UpdateHistoryInvitationDto } from './dto/update-history-invitation.dto';
import {
  HistoryInvitation,
  HistoryInvitationDocument,
} from './schema/history-invitation.schema';
import { ClientSession, Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HistoryInvitationsService {
  constructor(
    @InjectModel(HistoryInvitation.name)
    private readonly historyModel: Model<HistoryInvitationDocument>,
    private readonly userService: UsersService,
  ) { }

  async createHistoryInvitation(
    createHistoryInvitationDto: CreateHistoryInvitationDto,
    session: ClientSession,
  ) {
    const userId = await this.userService.findUserById(
      createHistoryInvitationDto.userId,
    );
    if (!userId) {
      throw new Error('User not found');
    }
    const historyInvitation = new this.historyModel({
      ...createHistoryInvitationDto,
      user: userId,
    });
    return await historyInvitation.save({ session });
  }

  async findAllHistoryInvitations(session: ClientSession) {
    return await this.historyModel.find({}, null, { session }).exec();
  }

  async findOneHistoryInvitation(id: string, session: ClientSession) {
    return await this.historyModel.findById(id, null, { session }).exec();
  }

  async updateHistoryInvitation(
    id: string,
    updateHistoryInvitationDto: UpdateHistoryInvitationDto,
    session: ClientSession,
  ) {
    return await this.historyModel.findByIdAndUpdate(
      id,
      updateHistoryInvitationDto,
      {
        new: true,
        session: session,
      },
    ).exec();
  }

  async remove(id: string, session: ClientSession) {
    return await this.historyModel.findByIdAndDelete(id, { session }).exec();
  }
}
