import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
import { MessageType } from '../schema/group-message.schema';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  groupId: Types.ObjectId;

  @IsOptional()
  senderId?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsOptional()
  @IsArray()
  mentions?: Types.ObjectId[];

  @IsOptional()
  replyTo?: Types.ObjectId;
}
