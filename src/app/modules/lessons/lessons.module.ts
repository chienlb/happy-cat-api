import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schema/lesson.schema';
import { UsersModule } from '../users/users.module';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
    ]),
    UsersModule,
    UnitsModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, MongooseModule],
})
export class LessonsModule { }
