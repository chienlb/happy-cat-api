import { Module, forwardRef } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { LessonPrgressController } from './lesson-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LessonProgress,
  LessonProgressSchema,
} from './schema/lesson-progress.schema';
import { UsersModule } from '../users/users.module';
import { LessonsModule } from '../lessons/lessons.module';
import { UnitsModule } from '../units/units.module';
import { BadgesModule } from '../badges/badges.module';
import { UserBadgesModule } from '../user-badges/user-badges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LessonProgress.name, schema: LessonProgressSchema },
    ]),
    UsersModule,
    forwardRef(() => LessonsModule),
    UnitsModule,
    BadgesModule,
    UserBadgesModule,
  ],
  controllers: [LessonPrgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService, MongooseModule],
})
export class LessonProgressModule {}
