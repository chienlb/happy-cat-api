import { Module } from '@nestjs/common';
import { UnitProgressService } from './unit-progress.service';
import { UnitProgressController } from './unit-progress.controller';

@Module({
  controllers: [UnitProgressController],
  providers: [UnitProgressService],
})
export class UnitProgressModule {}
