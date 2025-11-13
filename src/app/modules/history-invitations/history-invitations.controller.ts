import { Controller, Post, Body, Logger } from '@nestjs/common';
import { HistoryInvitationsService } from './history-invitations.service';
import { CreateHistoryInvitationDto } from './dto/create-history-invitation.dto';
import mongoose from 'mongoose';
import { ok } from 'src/app/common/response/api-response';

@Controller('history-invitations')
export class HistoryInvitationsController {
  private readonly logger = new Logger(HistoryInvitationsController.name);

  constructor(
    private readonly historyInvitationsService: HistoryInvitationsService,
  ) { }

  @Post()
  async create(@Body() createHistoryInvitationDto: CreateHistoryInvitationDto) {
    const session = await mongoose.startSession();
    session.startTransaction();
    this.logger.log(
      `Creating history invitation for user: ${createHistoryInvitationDto.userId}`,
    );
    const result = await this.historyInvitationsService.createHistoryInvitation(
      createHistoryInvitationDto,
      session,
    );
    await session.commitTransaction();
    await session.endSession();
    return ok(result, 'History invitation created successfully', 200);
  }
}
