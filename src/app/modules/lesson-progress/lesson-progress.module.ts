import { Module } from '@nestjs/common';
import { LessonPrgressService } from './lesson-progress.service';
import { LessonPrgressController } from './lesson-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonPrgress, LessonPrgressSchema } from './schema/lesson-progress.schema';
import { UsersModule } from '../users/users.module';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonPrgress.name, schema: LessonPrgressSchema }]),
    UsersModule,
    LessonsModule,
  ],
  controllers: [LessonPrgressController],
  providers: [LessonPrgressService],
  exports: [LessonPrgressService, MongooseModule],
})
export class LessonPrgressModule { }
