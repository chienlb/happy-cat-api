import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignment, AssignmentSchema } from './schema/assignment.schema';
import { UsersModule } from '../users/users.module';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { NotificationJobsModule } from '../notification-jobs/notification-jobs.module';
import { Group, GroupSchema } from '../groups/schema/group.schema';
import { LessonProgress, LessonProgressSchema } from '../lesson-progress/schema/lesson-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Group.name, schema: GroupSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
    ]),
    UsersModule,
    NotificationJobsModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, CloudflareService],
  exports: [AssignmentsService],
})
export class AssignmentsModule { }
