import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practice, PracticeDocument, ParcticeTypes } from './schema/practice.schema';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { SubmitPracticeDto } from './dto/submit-practice.dto';

@Injectable()
export class PracticesService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenAI({ apiKey });
  }

  private genAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';
  private readonly promptSentence = `
    You are creating English translation exercises for FIRST GRADE students (6–7 years old).

    ========================
    VERY IMPORTANT RULES
    ========================

    - Students are beginners (A0–A1)
    - Use VERY SIMPLE Vietnamese sentences
    - English must be VERY EASY
    - Sentences must be SHORT (3–6 words)
    - Use only basic vocabulary
    - No complex grammar

    ========================
    TOPIC SELECTION
    ========================

    You MUST automatically choose SIMPLE topics suitable for kids, such as:
    - animals
    - food
    - school
    - family
    - toys
    - colors
    - daily actions

    Do NOT use difficult or abstract topics.

    ========================
    OUTPUT REQUIREMENTS
    ========================

    Generate {COUNT} items.

    Each item must include:
    - sentence_vi (Vietnamese)
    - correct_answer (English)
    - hint (1–2 simple keywords)
    - difficulty: always "easy"

    ========================
    EXAMPLES
    ========================

    "Tôi thấy một con mèo" → "I see a cat"
    "Đây là quả táo" → "This is an apple"

    ========================
    OUTPUT FORMAT (STRICT JSON)
    ========================

    Return ONLY JSON:

    {
      "items": [
        {
          "sentence_vi": "Tôi có một quả táo",
          "correct_answer": "I have an apple",
          "hint": ["apple"],
          "difficulty": "easy"
        }
      ]
    }

    ========================
    IMPORTANT
    ========================

    - Vietnamese must be natural and simple
    - English must match exactly
    - Use repetitive patterns:
      - I see...
      - I have...
      - This is...
      - I like...
    - DO NOT return text outside JSON
    - DO NOT create long sentences
    - Keep everything VERY EASY

    If unsure, make it simpler.

    Now generate the result.
    `;

private readonly promptLetter = `
You are creating English letter-writing tasks for FIRST GRADE students (6–7 years old).

========================
MAIN GOAL
========================
Create ONE detailed but easy letter-writing task in ENGLISH ONLY.

The task should be inspired by VSTEP format (situation + requirements),
but MUCH EASIER and suitable for children.

========================
VERY IMPORTANT RULES
========================
- Students are beginners (A0–A1)
- Use VERY SIMPLE English only
- Use SHORT sentences (3–6 words where possible)
- No complex grammar
- No difficult words
- No long instructions

========================
TASK STRUCTURE
========================

Each task MUST include:

1. situation (in English)
- simple and clear
- 1–2 short sentences
- describe a real-life situation for a child

2. requirements
- 4–5 bullet points
- very short and easy

3. instruction
- one simple sentence

4. hints
- simple sentence patterns

========================
TOPIC RULES
========================

Only use child-friendly topics:
- a pet
- a toy
- school
- a friend
- a teacher
- family
- food

========================
OUTPUT REQUIREMENTS
========================

Return:
- title
- situation
- requirements
- instruction
- hints
- required_topic_keywords
- minimum_sentences
- sample_answer
- difficulty

========================
OUTPUT FORMAT (STRICT JSON)
========================

Return ONLY JSON:

{
  "title": "Tell your friend about your cat",
  "situation": "You have a new cat. You are happy and want to tell your friend.",
  "requirements": [
    "Say what you have",
    "Say you like it",
    "Say its color",
    "Say what it can do",
    "Ask one question"
  ],
  "instruction": "Write a short letter to your friend.",
  "hints": [
    "Dear ... ,",
    "I have a cat.",
    "It is small and white.",
    "It can run fast.",
    "I like it.",
    "Do you like cats?"
  ],
  "required_topic_keywords": ["cat", "friend"],
  "minimum_sentences": 6,
  "sample_answer": "Dear Nam,\\nI have a new cat. It is small and white. It can run fast. I play with it every day. I like my cat very much. Do you like cats?\\nLove, Lan",
  "difficulty": "easy"
}

========================
IMPORTANT
========================

- Everything must be in ENGLISH
- Keep everything VERY SIMPLE
- Situation must be clear and real
- Sample answer must be 6–8 short sentences
- Use easy words only
- DO NOT return text outside JSON
- DO NOT explain anything

If unsure, make it simpler.

Now generate the result.
`;

  private readonly promptDiscussion = `
    You are creating English discussion exercises for FIRST GRADE students (6–7 years old).
    ========================
    VERY IMPORTANT RULES
    ========================
    - Students are beginners (A0–A1)
    - Use VERY SIMPLE Vietnamese sentences
    - English must be VERY EASY
    - Sentences must be SHORT (3–6 words)
    - Use only basic vocabulary
    - No complex grammar
    ========================
    TOPIC SELECTION
    ========================

    You MUST automatically choose SIMPLE topics suitable for kids, such as:
    - animals
    - food
    - school
    - family
    - toys
    - colors
    - daily actions

    Do NOT use difficult or abstract topics.

    ========================
    OUTPUT REQUIREMENTS
    ========================

    Generate {COUNT} items.

    Each item must include:
    - sentence_vi (Vietnamese)
    - correct_answer (English)
    - hint (1–2 simple keywords)
    - difficulty: always "easy"

    ========================
    OUTPUT FORMAT (STRICT JSON)
    ========================

    Return ONLY JSON:

    {
      "items": [
        {
          "sentence_vi": "Bạn có thể giúp tôi không?",
          "correct_answer": "Can you help me?",
          "hint": ["help"],
          "difficulty": "easy"
        }
      ]
    }

    - DO NOT return text outside JSON
    - Keep everything VERY EASY

    Now generate the result.
    `;

  async create(createPracticeDto: CreatePracticeDto): Promise<Practice> {
    const hasExercise =
      createPracticeDto.exercise !== undefined && createPracticeDto.exercise !== null;

    if (!hasExercise) {
      return this.createSentenceWithAI(createPracticeDto);
    }

    const createdPractice = new this.practiceModel({
      studentId: createPracticeDto.studentId,
      type: createPracticeDto.type,
      exercise: createPracticeDto.exercise,
      studentWriting: createPracticeDto.studentWriting,
    });
    return createdPractice.save();
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }
    return practice;
  }

  async update(id: string, updatePracticeDto: UpdatePracticeDto): Promise<Practice> {
    const updatedPractice = await this.practiceModel
      .findByIdAndUpdate(id, updatePracticeDto, { new: true })
      .exec();

    if (!updatedPractice) {
      throw new NotFoundException('Practice not found');
    }
    return updatedPractice;
  }

  async submit(id: string, submitPracticeDto: SubmitPracticeDto): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    const aiFeedback = await this.generateFeedbackByType(practice, submitPracticeDto.studentWriting);

    practice.studentWriting = submitPracticeDto.studentWriting;
    practice.AIFeedback = aiFeedback;

    return practice.save();
  }

  async remove(id: string): Promise<Practice> {
    const deletedPractice = await this.practiceModel.findByIdAndDelete(id).exec();
    if (!deletedPractice) {
      throw new NotFoundException('Practice not found');
    }
    return deletedPractice;
  }

  async createSentenceWithAI(practiceData: Partial<Practice>): Promise<Practice> {
    const chat = this.genAI.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: this.getPromptByType(practiceData.type).replace('{COUNT}', '5'),
        maxOutputTokens: 1000,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const exerciseGuide =
      typeof practiceData.exercise === 'string' ? practiceData.exercise.trim() : '';
    const result = await chat.sendMessage({
      message: exerciseGuide
        ? `Generate beginner English practice items. Student request: ${exerciseGuide}`
        : 'Generate beginner English practice items automatically. Choose kid-friendly topics yourself.',
    });

    let aiResult: { items: unknown[] };
    try {
      aiResult = this.extractJsonFromResult(result.text || '');
    } catch {
      const retryResult = await chat.sendMessage({
        message:
          'Return strict JSON only. No markdown. Use this exact shape: {"items":[...]}',
      });

      try {
        aiResult = this.extractJsonFromResult(retryResult.text || '');
      } catch {
        aiResult = this.getFallbackExerciseItems(practiceData.type);
      }
    }

    const createdPractice = new this.practiceModel({
      studentId: practiceData.studentId,
      type: practiceData.type,
      exercise: aiResult,
      studentWriting: practiceData.studentWriting,
    });

    return createdPractice.save();
  }

  private getPromptByType(type?: string): string {
    switch (type) {
      case ParcticeTypes.LETTER:
        return this.promptLetter;
      case ParcticeTypes.DISCUSSION:
        return this.promptDiscussion;
      case ParcticeTypes.SENTENCES:
      default:
        return this.promptSentence;
    }
  }

  private async generateFeedbackByType(
    practice: Practice,
    studentWriting: string,
  ): Promise<Record<string, unknown>> {
    const feedbackPrompt = this.buildFeedbackPrompt(practice, studentWriting);

    const chat = this.genAI.chats.create({
      model: this.modelName,
      config: {
        maxOutputTokens: 1200,
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    try {
      const result = await chat.sendMessage({ message: feedbackPrompt });
      const parsed = this.extractJsonObject(result.text || '');
      if (!('score' in parsed) || !('comments' in parsed)) {
        throw new BadRequestException('Invalid feedback structure from Gemini');
      }
      return this.normalizeFeedbackScore(parsed, practice, studentWriting);
    } catch {
      return {
        score: 3,
        relevance_score: 1,
        language_score: 1,
        completeness_score: 1,
        off_topic: true,
        comments: 'Your writing is not close to the exercise topic. Please answer the task directly.',
        corrections: [],
        encouragement: 'Try again. You can do it with short simple sentences.',
      };
    }
  }

  private buildFeedbackPrompt(practice: Practice, studentWriting: string): string {
    return `
You are grading a FIRST GRADE English practice submission (A0-A1).

Practice type: ${practice.type}
Exercise JSON: ${JSON.stringify(practice.exercise)}
Student writing: ${studentWriting}

Return ONLY JSON with this structure:
{
  "score": 0,
  "relevance_score": 0,
  "language_score": 0,
  "completeness_score": 0,
  "off_topic": false,
  "comments": "short simple feedback",
  "corrections": [
    {
      "original": "text",
      "corrected": "text",
      "reason": "short reason"
    }
  ],
  "encouragement": "positive message"
}

Rules:
- score is integer 0-10
- relevance_score is integer 0-4
- language_score is integer 0-3
- completeness_score is integer 0-3
- score must equal relevance_score + language_score + completeness_score
- If student is off-topic, set off_topic=true and score must be 0-3
- comments must be simple English
- keep feedback friendly for kids
- if writing is good, keep corrections empty
- no text outside JSON
`;
  }

  private normalizeFeedbackScore(
    parsed: Record<string, unknown>,
    practice: Practice,
    studentWriting: string,
  ): Record<string, unknown> {
    const normalized = { ...parsed };

    const rawScore = Number(normalized.score);
    const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(10, Math.round(rawScore))) : 0;
    normalized.score = score;

    const exerciseText = this.collectExerciseText(practice.exercise).toLowerCase();
    const writingText = studentWriting.toLowerCase();
    const topicKeywords = this.extractKeywords(exerciseText);
    const keywordHit = topicKeywords.filter((word) => writingText.includes(word)).length;
    const offTopic = topicKeywords.length > 0 && keywordHit === 0;

    if (offTopic) {
      normalized.off_topic = true;
      normalized.score = Math.min(score, 3);
      normalized.relevance_score = 0;

      const existingComments =
        typeof normalized.comments === 'string' && normalized.comments.trim().length > 0
          ? normalized.comments
          : 'Your writing is not on the exercise topic.';
      normalized.comments = `${existingComments} Please write about the required topic.`;
    }

    const words = writingText.split(/\s+/).filter(Boolean).length;
    if (words < 8) {
      normalized.score = Math.min(Number(normalized.score) || 0, 5);
      if (!normalized.comments) {
        normalized.comments = 'Your answer is too short. Add more simple sentences.';
      }
    }

    return normalized;
  }

  private collectExerciseText(exercise: unknown): string {
    const parts: string[] = [];

    const visit = (node: unknown): void => {
      if (typeof node === 'string') {
        parts.push(node);
        return;
      }

      if (Array.isArray(node)) {
        for (const item of node) {
          visit(item);
        }
        return;
      }

      if (node && typeof node === 'object') {
        for (const value of Object.values(node as Record<string, unknown>)) {
          visit(value);
        }
      }
    };

    visit(exercise);
    return parts.join(' ');
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'this', 'that', 'have', 'your', 'about', 'write', 'short',
      'letter', 'easy', 'say', 'you', 'are', 'was', 'is', 'to', 'a', 'an', 'of', 'in', 'on',
      'my', 'it', 'do', 'what', 'one', 'new', 'very', 'today', 'want', 'tell', 'friend',
    ]);

    const words = text.match(/[a-z]{3,}/g) ?? [];
    const unique = Array.from(new Set(words.filter((word) => !stopWords.has(word))));
    return unique.slice(0, 15);
  }

  private extractJsonFromResult(rawText: string): { items: unknown[] } {
    const clean = rawText.trim();
    const blockMatch = clean.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = blockMatch?.[1]?.trim() || clean;

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new BadRequestException('Gemini response does not include a valid items array');
      }
      return parsed;
    } catch {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new BadRequestException('Gemini response is not valid JSON');
      }

      const slicedJson = jsonText.slice(start, end + 1);
      const parsed = JSON.parse(slicedJson);
      if (!parsed || !Array.isArray(parsed.items)) {
        throw new BadRequestException('Gemini response does not include a valid items array');
      }
      return parsed;
    }
  }

  private extractJsonObject(rawText: string): Record<string, unknown> {
    const clean = rawText.trim();
    const blockMatch = clean.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = blockMatch?.[1]?.trim() || clean;

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        throw new BadRequestException('Gemini response is not a valid JSON object');
      }
      return parsed as Record<string, unknown>;
    } catch {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new BadRequestException('Gemini response is not valid JSON');
      }

      const slicedJson = jsonText.slice(start, end + 1);
      const parsed = JSON.parse(slicedJson);
      if (!parsed || typeof parsed !== 'object') {
        throw new BadRequestException('Gemini response is not a valid JSON object');
      }
      return parsed as Record<string, unknown>;
    }
  }

  private getFallbackExerciseItems(type?: string): { items: unknown[] } {
    if (type === ParcticeTypes.LETTER) {
      return {
        items: [
          {
            title: 'Write a letter about your dad',
            situation: 'Your dad helped you at home. You want to write a letter to thank him.',
            requirements: [
              'Say your name',
              'Say why you are happy',
              'Say one thing your dad does',
              'Say thank you',
              'Ask one simple question',
            ],
            instruction: 'Write a short letter to your dad using 6 simple sentences.',
            hints: [
              'Dear Dad,',
              'My name is ...',
              'You help me ...',
              'I am happy because ...',
              'Thank you for ...',
              'Love, ...',
            ],
            required_topic_keywords: ['dad', 'thank', 'help'],
            minimum_sentences: 6,
            sample_answer:
              'Dear Dad,\nMy name is Lan. You help me with homework. You cook food for me. I am happy today. Thank you for your help. Do you like my letter?\nLove, Lan',
            difficulty: 'easy',
          },
        ],
      };
    }

    return {
      items: [
        {
          sentence_vi: 'Toi thay mot con meo',
          correct_answer: 'I see a cat',
          hint: ['cat'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Toi co mot qua tao',
          correct_answer: 'I have an apple',
          hint: ['apple'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Day la mau do',
          correct_answer: 'This is red',
          hint: ['red'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Toi thich sua',
          correct_answer: 'I like milk',
          hint: ['milk'],
          difficulty: 'easy',
        },
        {
          sentence_vi: 'Day la me toi',
          correct_answer: 'This is my mom',
          hint: ['mom'],
          difficulty: 'easy',
        },
      ],
    };
  }

}