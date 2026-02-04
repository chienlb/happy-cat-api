import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Model } from 'mongoose';
import { generateSlug } from '../../../common/utils/slug.util';
import { PackageType } from '../../packages/schema/package.schema';

export type UserDocument = HydratedDocument<User>;

// Vai trò của người dùng trong hệ thống
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

// Trạng thái tài khoản
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

// Loại hình tài khoản (phương thức đăng nhập)
export enum UserTypeAccount {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  OTHER = 'other',
}

// Giới tính người dùng
export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Ngôn ngữ giao diện
export enum UserLanguage {
  VI = 'vi',
  EN = 'en',
}

export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum UserFont {
  DEFAULT = 'default',
  SERIF = 'serif',
  SANS_SERIF = 'sans-serif',
}

export enum UserCurrency {
  VND = 'VND',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
}

export interface IUser {
  fullname: string; // Họ và tên đầy đủ của người dùng
  username: string; // Tên đăng nhập duy nhất của người dùng
  email: string; // Địa chỉ email của người dùng ( Nếu là học sinh, có thể là email phụ huynh )
  password: string; // Mật khẩu đã được mã hóa của người dùng
  birthDate: Date; // Ngày sinh của người dùng
  role: UserRole; // Vai trò của người dùng trong hệ thống
  slug: string; // Đường dẫn thân thiện với SEO cho người dùng
  avatar?: string; // URL ảnh đại diện của người dùng
  cover?: string; // URL ảnh bìa của người dùng
  phone: string; // Số điện thoại của người dùng ( Nếu là học sinh, có thể là số điện thoại phụ huynh )
  gender: UserGender; // Giới tính của người dùng
  language?: UserLanguage; // Ngôn ngữ của người dùng
  province?: string; // Tỉnh/Thành phố của người dùng
  parent?: Types.ObjectId; // Phụ huynh của người dùng
  teacher?: Types.ObjectId; // Giáo viên của người dùng
  typeAccount: UserTypeAccount; // Loại hình tài khoản của người dùng
  googleId?: string; // Google ID nếu đăng nhập bằng Google
  facebookId?: string; // Facebook ID nếu đăng nhập bằng Facebook
  accountPackage: PackageType; // Gói tài khoản của người dùng
  isVerify: boolean; // Trạng thái xác thực của người dùng
  codeVerify?: string; // Mã xác minh (OTP) nếu có
  tokenVerify?: string; // Token xác minh (nếu hệ thống sử dụng)
  exp?: number; // Số kinh nghiệm của người dùng
  streakDays?: number; // Số ngày liên tiếp hoạt động của người dùng
  progressLevel?: number; // Cấp độ tiến bộ của người dùng
  totalLessonsCompleted?: number; // Tổng số bài học đã hoàn thành
  theme?: UserTheme; // Chủ đề giao diện của người dùng
  currency?: string; // Loại tiền tệ ưa thích của người dùng
  enableNotifications?: boolean; // Trạng thái kích hoạt thông báo trên website
  enableNotificationEmails?: boolean; // Trạng thái nhận email thông báo từ hệ thống
  status: UserStatus; // Trạng thái tài khoản của người dùng
  lastLoginAt?: Date; // Thời gian đăng nhập gần nhất
  createdBy?: Types.ObjectId; // Người tạo tài khoản
  updatedBy?: Types.ObjectId; // Người cập nhật tài khoản gần nhất
}

// Dữ liệu đầu vào khi tạo hoặc cập nhật người dùng
// Omit các trường 'slug', 'isVerify', và 'tokenVerify' vì chúng sẽ được hệ thống xử lý tự động
export type IUserInput = Omit<IUser, 'slug' | 'isVerify' | 'tokenVerify'>;

// Dữ liệu phản hồi khi lấy thông tin người dùng
export interface IUserResponse extends IUser {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Mongoose Schema và Model cho người dùng
@Schema({ collection: 'users', timestamps: true })
export class User implements IUser {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  birthDate: Date;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  avatar?: string;

  @Prop()
  cover?: string;

  @Prop()
  phone: string;

  @Prop({ enum: UserGender, default: UserGender.OTHER })
  gender: UserGender;

  @Prop({ enum: UserLanguage, default: UserLanguage.VI })
  language?: UserLanguage;

  @Prop()
  province?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  parent?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacher?: Types.ObjectId;

  @Prop({ enum: UserTypeAccount, default: UserTypeAccount.EMAIL })
  typeAccount: UserTypeAccount;

  @Prop({ type: String })
  googleId?: string;

  @Prop({ type: String })
  facebookId?: string;

  @Prop({ enum: PackageType, default: PackageType.FREE })
  accountPackage: PackageType;

  @Prop({ default: false })
  isVerify: boolean;

  @Prop()
  codeVerify?: string;

  @Prop()
  tokenVerify?: string;

  @Prop()
  refCode?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  invitedBy?: Types.ObjectId;

  @Prop({ default: 0 })
  exp?: number;

  @Prop({ default: 0 })
  streakDays?: number;

  @Prop({ default: 0 })
  progressLevel?: number;

  @Prop({ default: 0 })
  totalLessonsCompleted?: number;

  @Prop({ enum: UserTheme, default: UserTheme.LIGHT })
  theme?: UserTheme;

  @Prop({ enum: UserCurrency, default: UserCurrency.VND })
  currency?: UserCurrency;

  @Prop({ default: false })
  enableNotifications?: boolean;

  @Prop({ default: false })
  enableNotificationEmails?: boolean;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('validate', async function (next) {
  if (this.username) {
    // Dùng model của document (từ @InjectModel) thay vì model() để tránh buffering
    // do model() gắn kết nối mặc định có thể chưa sẵn sàng
    this.slug = await generateSlug(this.constructor as Model<User>, this.username);
  }
  next();
});