import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './schema/otp.schema';
import { User } from '../users/schema/user.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OtpsService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  /**
   * @param createOtpDto - email và otp
   * @param options.requireUser - nếu true (mặc định) thì bắt buộc đã có user với email đó (dùng cho forgot/resend). Nếu false thì không kiểm tra (dùng cho register vì user chưa được tạo).
   */
  async createOTP(
    createOtpDto: CreateOtpDto,
    options?: { requireUser?: boolean },
  ) {
    const requireUser = options?.requireUser !== false;
    if (requireUser) {
      const user = await this.userModel.findOne({ email: createOtpDto.email });
      if (!user) throw new NotFoundException('User not found');
    }
    const otp = new this.otpModel(createOtpDto);
    return await otp.save();
  }

  async findOTP(email: string) {
    const otp = await this.otpModel.findOne({ email, isUsed: false });
    if (!otp) throw new NotFoundException('OTP not found');
    return otp;
  }
}
