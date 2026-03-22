import { Module } from '@nestjs/common';
import { CommunitesService } from './communites.service';
import { CommunitesController } from './communites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Communite, CommuniteSchema } from './schema/communite.schema';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Communite.name, schema: CommuniteSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudflareModule,
  ],
  controllers: [CommunitesController],
  providers: [CommunitesService],
})
export class CommunitesModule {}
