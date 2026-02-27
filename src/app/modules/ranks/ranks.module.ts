import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RanksController } from './rank.controller';
import { RanksService } from './rank.service';
import { Rank, RankSchema } from './schema/rank.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rank.name, schema: RankSchema }]),
  ],
  controllers: [RanksController],
  providers: [RanksService],
  exports: [RanksService, MongooseModule],
})
export class RanksModule {}

