import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { InvitationCodesModule } from '../invitation-codes/invitation-codes.module';
import { HistoryInvitationsModule } from '../history-invitations/history-invitations.module';
import { HistoryInvitationSchema } from '../history-invitations/schema/history-invitation.schema';
import { TokenSchema } from '../tokens/schema/token.schema';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'HistoryInvitation', schema: HistoryInvitationSchema },
      { name: 'Token', schema: TokenSchema },
    ]),
    forwardRef(() => InvitationCodesModule),
    CloudflareModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
