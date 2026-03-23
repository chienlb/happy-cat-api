import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PracticeDocument = HydratedDocument<Practice>;

export const ParcticeTypes = {
    SENTENCES: 'sentences',
    LETTER: 'letter',
    DISCUSSION: 'discussion',
}

export interface IPractice {
    studentId: string;
    type: string;
    exercise: unknown;
    studentWriting?: string;
    AIFeedback?: unknown;
}

@Schema({ collection: 'practices', timestamps: true })
export class Practice {
    @Prop({ required: true })
    studentId: string;

    @Prop({ required: true, enum: Object.values(ParcticeTypes) })
    type: string;

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    exercise: unknown;

    @Prop({ required: false })
    studentWriting?: string;

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    AIFeedback?: unknown;
}


export const PracticeSchema = SchemaFactory.createForClass(Practice);