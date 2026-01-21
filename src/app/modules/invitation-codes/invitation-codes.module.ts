import { Module, forwardRef } from '@nestjs/common';
import { InvitationCodesService } from './invitation-codes.service';
import { InvitationCodesController } from './invitation-codes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvitationCode,
  InvitationCodeSchema,
} from './schema/invitation-code.schema';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../configs/redis/redis.module';
import { RedisService } from '../../configs/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvitationCode.name, schema: InvitationCodeSchema },
    ]),
    forwardRef(() => UsersModule),
    RedisModule,
  ],
  controllers: [InvitationCodesController],
  providers: [InvitationCodesService, RedisService],
  exports: [InvitationCodesService],
})
export class InvitationCodesModule {}
