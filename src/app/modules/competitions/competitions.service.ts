import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Competition, CompetitionDocument } from './schema/competition.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { RanksService } from '../ranks/rank.service';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectModel(Competition.name)
    private competitionRepository: Model<CompetitionDocument>,
    private usersService: UsersService,
    private cloudflareService: CloudflareService,
    private ranksService: RanksService,
  ) {}

  async createCompetition(
    createCompetitionDto: CreateCompetitionDto,
    mediaFiles?: any[],
  ): Promise<CompetitionDocument> {
    try {
      if (createCompetitionDto.createdBy) {
        const user = await this.usersService.findUserById(
          createCompetitionDto.createdBy,
        );
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }

      const listQuestion = await Promise.all(
        (createCompetitionDto.listQuestion ?? []).map(async (q, index) => {
          let mediaUrl: string | undefined = q.media;
          const mediaFile = mediaFiles?.find(
            (f) => f.fieldname === `media-${index}`,
          );
          if (mediaFile) {
            const upload = await this.cloudflareService.uploadFile(
              mediaFile,
              'competitions',
            );
            mediaUrl = upload.fileUrl;
          }
          return {
            question: q.question,
            media: mediaUrl,
            options: q.options,
            correctAnswer: q.correctAnswer,
            score: q.score,
            type: q.type,
            explanation: q.explanation,
          };
        }),
      );

      const competition = new this.competitionRepository({
        name: createCompetitionDto.name,
        description: createCompetitionDto.description,
        type: createCompetitionDto.type,
        startTime: createCompetitionDto.startTime,
        endTime: createCompetitionDto.endTime,
        createdBy: createCompetitionDto.createdBy
          ? new Types.ObjectId(createCompetitionDto.createdBy)
          : undefined,
        updatedBy: createCompetitionDto.updatedBy
          ? new Types.ObjectId(createCompetitionDto.updatedBy)
          : undefined,
        totalParticipants: createCompetitionDto.totalParticipants ?? 0,
        participants: createCompetitionDto.participants?.map(
          (id) => new Types.ObjectId(id),
        ),
        maxParticipants: createCompetitionDto.maxParticipants,
        prize: createCompetitionDto.prize,
        status: createCompetitionDto.status,
        badgeId: createCompetitionDto.badgeId
          ? new Types.ObjectId(createCompetitionDto.badgeId)
          : undefined,
        visibility: createCompetitionDto.visibility,
        isPublished: createCompetitionDto.isPublished ?? false,
        listQuestion,
        countQuestion: listQuestion.length,
      });
      await competition.save();
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findCompetitionById(id: string): Promise<CompetitionDocument> {
    try {
      const competition = await this.competitionRepository.findById(id);
      if (!competition) {
        throw new NotFoundException('Competition not found');
      }
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllCompetitions(paginationDto: PaginationDto): Promise<{
    data: CompetitionDocument[];
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    limit: number;
  }> {
    try {
      const competitions = await this.competitionRepository
        .find({ isPublished: true })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.competitionRepository.countDocuments({
        isPublished: true,
      });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const currentPage = Math.max(1, Math.min(paginationDto.page, totalPages));
      return {
        data: competitions,
        total: total,
        totalPages: totalPages,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : currentPage === totalPages
              ? null
              : totalPages,
        prevPage:
          currentPage > 1 ? currentPage - 1 : currentPage === 1 ? null : 1,
        limit: paginationDto.limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateCompetition(
    id: string,
    updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<CompetitionDocument> {
    try {
      const updateData: Record<string, unknown> = { ...updateCompetitionDto };
      if (updateCompetitionDto.listQuestion !== undefined) {
        updateData.listQuestion = updateCompetitionDto.listQuestion;
        updateData.countQuestion = updateCompetitionDto.listQuestion.length;
      }
      if (updateCompetitionDto.createdBy) {
        updateData.createdBy = new Types.ObjectId(updateCompetitionDto.createdBy);
      }
      if (updateCompetitionDto.updatedBy) {
        updateData.updatedBy = new Types.ObjectId(updateCompetitionDto.updatedBy);
      }
      if (updateCompetitionDto.participants) {
        updateData.participants = updateCompetitionDto.participants.map(
          (id) => new Types.ObjectId(id),
        );
      }
      if (updateCompetitionDto.badgeId) {
        updateData.badgeId = new Types.ObjectId(updateCompetitionDto.badgeId);
      }
      const competition = await this.competitionRepository.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!competition) {
        throw new NotFoundException('Competition not found');
      }
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteCompetition(id: string): Promise<CompetitionDocument> {
    try {
      const competition = await this.competitionRepository.findByIdAndUpdate(
        id,
        { isPublished: false },
        { new: true },
      );
      if (!competition) {
        throw new NotFoundException('Competition not found');
      }
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async restoreCompetition(id: string): Promise<CompetitionDocument> {
    try {
      const competition = await this.competitionRepository.findByIdAndUpdate(
        id,
        { isPublished: true },
        { new: true },
      );
      if (!competition) {
        throw new NotFoundException('Competition not found');
      }
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findCompetitionsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: CompetitionDocument[];
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    limit: number;
  }> {
    try {
      const competitions = await this.competitionRepository
        .find({ createdBy: new Types.ObjectId(userId) })
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await this.competitionRepository.countDocuments({
        createdBy: new Types.ObjectId(userId),
      });
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      return {
        data: competitions,
        total: total,
        totalPages: totalPages,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : currentPage === totalPages
              ? null
              : totalPages,
        prevPage:
          currentPage > 1 ? currentPage - 1 : currentPage === 1 ? null : 1,
        limit: limit,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async joinCompetition(competitionId: string, userId: string): Promise<CompetitionDocument> {
    try {
      const competition = await this.competitionRepository.findByIdAndUpdate(
        competitionId,
        { $push: { participants: userId } },
      );
      if (!competition) {
        throw new NotFoundException('Competition not found');
      }
      if (competition.participants?.includes(new Types.ObjectId(userId))) {
        throw new BadRequestException('User already in competition');
      }
      competition.participants?.push(new Types.ObjectId(userId));
      const newRank = await this.ranksService.createRank({
        idCompetition: competitionId,
        userId: userId,
        score: 0,
        submittedAt: new Date() ?? undefined,
      });
      if (!newRank) {
        throw new BadRequestException('Failed to create rank');
      }

      await competition.save();
      return competition;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
