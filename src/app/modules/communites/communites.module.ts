import { Module } from '@nestjs/common';
import { CommunitesService } from './communites.service';
import { CommunitesController } from './communites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Communite, CommuniteSchema } from './schema/communite.schema';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Communite.name, schema: CommuniteSchema }]),
    CloudflareModule,
  ],
  controllers: [CommunitesController],
  providers: [CommunitesService],
})
export class CommunitesModule {}
