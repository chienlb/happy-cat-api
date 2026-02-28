import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rank, RankDocument } from './schema/rank.schema';

interface CreateRankPayload {
  idCompetition: string;
  userId: string;
  score: number;
  submittedAt?: Date;
}

interface UpdateRankPayload {
  score?: number;
  rank?: number;
  submittedAt?: Date;
}

@Injectable()
export class RanksService {
  constructor(
    @InjectModel(Rank.name)
    private readonly rankRepository: Model<RankDocument>,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid id format');
    }
  }

  async createRank(payload: CreateRankPayload): Promise<RankDocument> {
    try {
      const competitionId = this.toObjectId(payload.idCompetition);
      const userObjectId = this.toObjectId(payload.userId);

      // Tính rank: điểm cao hơn xếp trên; cùng điểm thì nộp sớm hơn xếp trên
      const submittedAt = payload.submittedAt ?? new Date();
      const rankValue = await this.calculateRank(
        payload.idCompetition,
        payload.score,
        submittedAt,
      );

      const rank = new this.rankRepository({
        idCompetition: competitionId,
        userId: userObjectId,
        score: payload.score,
        rank: rankValue,
        submittedAt,
      });

      await rank.save();
      return rank;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async findById(id: string): Promise<RankDocument> {
    try {
      const rank = await this.rankRepository.findById(this.toObjectId(id));
      if (!rank) {
        throw new NotFoundException('Rank not found');
      }
      return rank;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async findLeaderboardByCompetition(
    competitionId: string,
    limit = 100,
  ): Promise<RankDocument[]> {
    try {
      const competitionObjectId = this.toObjectId(competitionId);

      return this.rankRepository
        .find({ idCompetition: competitionObjectId })
        .sort({ score: -1, submittedAt: 1 })
        .limit(limit)
        .exec();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async findUserRankInCompetition(
    competitionId: string,
    userId: string,
  ): Promise<RankDocument> {
    try {
      const competitionObjectId = this.toObjectId(competitionId);
      const userObjectId = this.toObjectId(userId);

      const rank = await this.rankRepository.findOne({
        idCompetition: competitionObjectId,
        userId: userObjectId,
      });

      if (!rank) {
        throw new NotFoundException('Rank not found for this user');
      }

      return rank;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async findAllByUser(userId: string): Promise<RankDocument[]> {
    try {
      const userObjectId = this.toObjectId(userId);
      return this.rankRepository
        .find({ userId: userObjectId })
        .sort({ submittedAt: -1 })
        .exec();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async updateRank(
    id: string,
    payload: UpdateRankPayload,
  ): Promise<RankDocument> {
    try {
      const existing = await this.rankRepository.findById(this.toObjectId(id));
      if (!existing) {
        throw new NotFoundException('Rank not found');
      }

      if (payload.score !== undefined) {
        existing.score = payload.score;
      }
      if (payload.submittedAt !== undefined) {
        existing.submittedAt = payload.submittedAt;
      }
      if (payload.score !== undefined || payload.submittedAt !== undefined) {
        // Tính lại rank: điểm cao hơn xếp trên; cùng điểm thì nộp sớm hơn xếp trên
        existing.rank = await this.calculateRank(
          existing.idCompetition.toString(),
          existing.score,
          existing.submittedAt,
        );
      }

      if (payload.rank !== undefined) {
        existing.rank = payload.rank;
      }

      await existing.save();
      return existing;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async deleteRank(id: string): Promise<RankDocument> {
    try {
      const deleted = await this.rankRepository.findByIdAndDelete(
        this.toObjectId(id),
      );
      if (!deleted) {
        throw new NotFoundException('Rank not found');
      }
      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }

  async calculateRank(competitionId: string, score: number, submittedAt?: Date): Promise<number> {
    try {
      const competitionObjectId = this.toObjectId(competitionId);

      // Điểm cao hơn → xếp trên. Cùng điểm → nộp sớm hơn (submittedAt nhỏ hơn) → xếp trên
      const betterCondition: Record<string, unknown>[] = [
        { score: { $gt: score } },
      ];
      if (submittedAt != null) {
        betterCondition.push({
          score,
          submittedAt: { $lt: submittedAt },
        });
      }

      const betterCount = await this.rankRepository.countDocuments({
        idCompetition: competitionObjectId,
        $or: betterCondition,
      });
      return betterCount + 1;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error);
    }
  }
}