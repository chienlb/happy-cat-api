import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentMethod {
  PAYPAL = 'paypal', // PayPal
  VNPAY = 'vnpay', // VNPay
}

export enum PaymentStatus {
  PENDING = 'pending', // Đang xử lý
  SUCCESS = 'success', // Thành công
  FAILED = 'failed', // Thất bại
  REFUNDED = 'refunded', // Đã hoàn tiền
}

export interface IPayment {
  userId: Types.ObjectId; // ID người dùng
  subscriptionId?: Types.ObjectId; // ID gói đăng ký (nếu có)
  method: PaymentMethod; // Phương thức thanh toán
  amount: number; // Số tiền thanh toán
  currency: string; // Loại tiền tệ
  status: PaymentStatus; // Trạng thái thanh toán
  transactionId?: string; // Mã giao dịch từ cổng thanh toán
  description?: string; // Mô tả thanh toán
  paidAt?: Date; // Ngày thanh toán thành công
}

@Schema({ collection: 'payments', timestamps: true })
export class Payment implements IPayment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.VNPAY,
  })
  method: PaymentMethod;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop()
  transactionId?: string;

  @Prop()
  description?: string;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
