import {
  BadRequestException,
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

      // Tính rank hiện tại trong cuộc thi dựa trên score
      const betterCount = await this.rankRepository.countDocuments({
        idCompetition: competitionId,
        score: { $gt: payload.score },
      });

      const rank = new this.rankRepository({
        idCompetition: competitionId,
        userId: userObjectId,
        score: payload.score,
        rank: betterCount + 1,
        submittedAt: payload.submittedAt ?? new Date(),
      });

      await rank.save();
      return rank;
    } catch (error) {
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

        // Tính lại rank trong cuộc thi sau khi đổi score
        const betterCount = await this.rankRepository.countDocuments({
          idCompetition: existing.idCompetition,
          _id: { $ne: existing._id },
          score: { $gt: payload.score },
        });
        existing.rank = betterCount + 1;
      }

      if (payload.rank !== undefined) {
        existing.rank = payload.rank;
      }

      if (payload.submittedAt !== undefined) {
        existing.submittedAt = payload.submittedAt;
      }

      await existing.save();
      return existing;
    } catch (error) {
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
      throw new BadRequestException(error);
    }
  }
}