import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schema/user.schema';
import { UnitSchema } from '../units/schema/unit.schema';
import { GroupSchema } from '../groups/schema/group.schema';
import { PaymentSchema } from '../payments/schema/payment.schema';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Module({
  imports: [
    FeatureFlagsModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Group', schema: GroupSchema },
      { name: 'Payment', schema: PaymentSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, CloudflareService],
})
export class AdminModule {}
