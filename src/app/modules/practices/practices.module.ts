import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticesService } from './practices.service';
import { PracticesController } from './practices.controller';
import { Practice, PracticeSchema } from './schema/practice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]),
  ],
  controllers: [PracticesController],
  providers: [PracticesService],
})
export class PracticesModule {}
