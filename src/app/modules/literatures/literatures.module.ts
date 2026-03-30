import { Module } from '@nestjs/common';
import { LiteraturesService } from './literatures.service';
import { LiteraturesController } from './literatures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Literature, LiteratureSchema } from './schema/literature.schema';
import { UsersModule } from '../users/users.module';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Literature.name, schema: LiteratureSchema },
    ]),
    UsersModule,
  ],
  controllers: [LiteraturesController],
  providers: [LiteraturesService, CloudflareService],
  exports: [LiteraturesService],
})
export class LiteraturesModule {}
