import { Controller, Post, Body, Logger } from '@nestjs/common';
import { InvitationCodesService } from './invitation-codes.service';
import { CreateInvitationCodeDto } from './dto/create-invitation-code.dto';
import mongoose from 'mongoose';
import { ok } from 'src/app/common/response/api-response';

@Controller('invitation-codes')
export class InvitationCodesController {
  private readonly logger = new Logger(InvitationCodesController.name);

  constructor(
    private readonly invitationCodesService: InvitationCodesService,
  ) { }

  @Post()
  async create(@Body() createInvitationCodeDto: CreateInvitationCodeDto) {
    const session = await mongoose.startSession();
    session.startTransaction();
    this.logger.log(
      `Creating invitation code by user: ${createInvitationCodeDto.createdBy}`,
    );
    const result = await this.invitationCodesService.createInvitationCode(
      createInvitationCodeDto,
      session,
    );
    await session.commitTransaction();
    await session.endSession();
    return ok(result.data, 'Invitation code created successfully', 200);
  }
}
