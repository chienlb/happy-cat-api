import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, model } from 'mongoose';
import { generateSlug } from 'src/app/common/utils/slug.util';

export type LessonDocument = HydratedDocument<Lesson>;

export enum LessonType {
  VOCABULARY = 'vocabulary', // Học từ vựng
  GRAMMAR = 'grammar', // Học ngữ pháp
  LISTENING = 'listening', // Nghe hiểu
  SPEAKING = 'speaking', // Nói
  READING = 'reading', // Đọc hiểu
  WRITING = 'writing', // Viết
  QUIZ = 'quiz', // Bài kiểm tra
  REVIEW = 'review', // Ôn tập / tổng kết
}

export enum LessonLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum LessonSkill {
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
}

export enum LessonActivityType {
  SONG = 'song',
  GAME = 'game',
  DIALOGUE = 'dialogue',
  READING = 'reading',
  EXERCISE = 'exercise',
  QUIZ = 'quiz',
  REVIEW = 'review',
  SUMMARY = 'summary',
}

export enum LessonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface ILesson {
  _id?: Types.ObjectId;

  title: string; // Tên bài học
  slug: string; // Đường dẫn định danh
  description?: string; // Mô tả ngắn
  type: LessonType; // Loại bài học
  level: LessonLevel; // Mức CEFR: A1, A2, B1...
  orderIndex?: number; // Thứ tự trong Unit
  unit: Types.ObjectId; // Thuộc về Unit nào
  content: {
    vocabulary: {
      description: string;
      words: {
        word: string;
        definition: string;
      }[];
      tags: string[];
    };
    grammar: {
      description: string;
      rule: string;
      examples: {
        example: string;
        translation: string;
      }[];
      tags: string[];
    };
    dialogue: {
      description: string;
      script: string;
      audio: string;
      translation: string;
      tags: string[];
    };
    reading: {
      description: string;
      passage: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    exercises: {
      description: string;
      type: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    quizzes: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    reviews: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    summaries: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    games: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    songs: {
      description: string;
      lyrics: string;
      translation: string;
      audio: string;
      video: string;
      vocabulary: {
        word: string;
        definition: string;
        ipa: string;
        image: string;
        audio: string;
      }[];
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
  };
  skillFocus?: LessonSkill;
  estimatedDuration?: number; // Thời gian học dự kiến (phút)
  materials?: string[]; // File PDF, worksheet, tài liệu kèm theo
  thumbnail?: string; // Ảnh đại diện bài học
  audioIntro?: string; // Âm thanh mở đầu
  videoIntro?: string; // Video hướng dẫn
  tags?: string[]; // Từ khóa (A1, greetings, vocabulary, ...)
  isActive: LessonStatus; // Trạng thái hiển thị
  createdAt?: Date; // Ngày tạo
  updatedAt?: Date; // Ngày cập nhật
  createdBy: Types.ObjectId; // Người tạo
  updatedBy: Types.ObjectId; // Người cập nhật
}

export interface ILessonInput extends Partial<ILesson> {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonResponse extends Omit<ILesson, '_id'> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ collection: 'lessons', timestamps: true })
export class Lesson implements ILesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: LessonType })
  type: LessonType;

  @Prop({ enum: LessonLevel, default: LessonLevel.A1, required: true })
  level: LessonLevel;

  @Prop({ index: true })
  orderIndex?: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Unit', index: true })
  unit: Types.ObjectId;

  @Prop({
    type: {
      vocabulary: {
        description: { type: String },
        words: [
          {
            word: { type: String },
            definition: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      grammar: {
        description: { type: String },
        rule: { type: String },
        examples: [
          {
            example: { type: String },
            translation: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      dialogue: {
        description: { type: String },
        script: { type: String },
        audio: { type: String },
        translation: { type: String },
        tags: { type: [String], default: [] },
      },
      reading: {
        description: { type: String },
        passage: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      exercises: {
        description: { type: String },
        type: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      quizzes: {
        description: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      reviews: {
        description: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      summaries: {
        description: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      games: {
        description: { type: String },
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
      songs: {
        description: { type: String },
        lyrics: { type: String },
        translation: { type: String },
        audio: { type: String },
        video: { type: String },
        vocabulary: [
          {
            word: { type: String },
            definition: { type: String },
            ipa: { type: String },
            image: { type: String },
            audio: { type: String },
          },
        ],
        questionsAndAnswers: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        tags: { type: [String], default: [] },
      },
    },
    default: {},
    required: true,
  })
  content: {
    vocabulary: {
      description: string;
      words: {
        word: string;
        definition: string;
        ipa: string;
        image: string;
        audio: string;
      }[];
      tags: string[];
    };
    grammar: {
      description: string;
      rule: string;
      examples: {
        example: string;
        translation: string;
      }[];
      tags: string[];
    };
    dialogue: {
      description: string;
      script: string;
      audio: string;
      translation: string;
      tags: string[];
    };
    reading: {
      description: string;
      passage: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    exercises: {
      description: string;
      type: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    quizzes: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    reviews: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    summaries: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    games: {
      description: string;
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
    songs: {
      description: string;
      lyrics: string;
      translation: string;
      audio: string;
      video: string;
      vocabulary: {
        word: string;
        definition: string;
        ipa: string;
        image: string;
        audio: string;
      }[];
      questionsAndAnswers: {
        question: string;
        answer: string;
      }[];
      tags: string[];
    };
  };

  @Prop({ enum: LessonSkill })
  skillFocus?: LessonSkill;

  @Prop({ min: 0, max: 1000 })
  estimatedDuration?: number;

  @Prop({ type: [String], default: [] })
  materials?: string[];

  @Prop()
  thumbnail?: string;

  @Prop()
  audioIntro?: string;

  @Prop()
  videoIntro?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ enum: LessonStatus, default: LessonStatus.ACTIVE, index: true })
  isActive: LessonStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);


const LessonModel = model<Lesson>('Lesson', LessonSchema);

LessonSchema.pre('save', async function (next) {
  this.slug = await generateSlug(LessonModel, this.title);
  next();
});


// Indexes để tối ưu performance cho các query phổ biến
LessonSchema.index({ unit: 1, orderIndex: 1 }); // Query lessons theo unit và thứ tự
LessonSchema.index({ unit: 1, isActive: 1 }); // Query active lessons trong unit
LessonSchema.index({ createdBy: 1, isActive: 1 }); // Query lessons của user
LessonSchema.index({ type: 1, level: 1, isActive: 1 }); // Query theo type, level và status
LessonSchema.index({ tags: 1 }); // Query theo tags
LessonSchema.index({ title: 'text', description: 'text' }); // Text search
