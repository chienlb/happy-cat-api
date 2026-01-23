import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { Otp } from './schema/otp.schema';
import { User } from '../users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from './schema/otp.schema';
import { UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [],
  providers: [OtpsService],
  exports: [MongooseModule, OtpsModule, OtpsService],
})
export class OtpsModule { }
