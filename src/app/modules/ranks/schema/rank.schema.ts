import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RankDocument = HydratedDocument<Rank>;

export interface IRank {
    idCompetition: Types.ObjectId; // ID cuộc thi
    userId: Types.ObjectId; // ID người dùng
    score: number; // Điểm số
    rank: number; // Xếp hạng
    submittedAt: Date; // Thời gian nộp bài
}

@Schema({ collection: 'ranks', timestamps: true })
export class Rank implements IRank {
    @Prop({ type: Types.ObjectId, ref: 'Competition', required: true })
    idCompetition: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    score: number;

    @Prop({ type: Number, required: true })
    rank: number;
    
    @Prop({ type: Date, required: true })
    submittedAt: Date;
}

export const RankSchema = SchemaFactory.createForClass(Rank);