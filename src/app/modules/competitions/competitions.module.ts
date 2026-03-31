import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Competition, CompetitionSchema } from './schema/competition.schema';
import { UsersModule } from '../users/users.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { RanksModule } from '../ranks/ranks.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionSchema },
    ]),
    UsersModule,
    CloudflareModule,
    RanksModule,
    NotificationsModule,
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService, MongooseModule],
})
export class CompetitionsModule {}
