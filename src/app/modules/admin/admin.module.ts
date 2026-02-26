import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schema/user.schema';
import { UnitSchema } from '../units/schema/unit.schema';
import { GroupSchema } from '../groups/schema/group.schema';
import { PaymentSchema } from '../payments/schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Group', schema: GroupSchema },
      { name: 'Payment', schema: PaymentSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
