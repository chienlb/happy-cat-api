import { Module } from '@nestjs/common';
import { NotificationJobsService } from './notification-jobs.service';

@Module({
  providers: [NotificationJobsService],
  exports: [NotificationJobsService],
})
export class NotificationJobsModule { }
