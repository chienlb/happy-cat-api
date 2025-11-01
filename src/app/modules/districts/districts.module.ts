import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';

@Module({
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
