import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Literature, LiteratureDocument } from './schema/literature.schema';
import { CreateLiteratureDto } from './dto/create-literature.dto';
import { UpdateLiteratureDto } from './dto/update-literature.dto';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';


@Injectable()
export class LiteraturesService {
  constructor(
    @InjectModel(Literature.name)
    private literatureModel: Model<LiteratureDocument>,
    private usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly cloudflareService: CloudflareService,
  ) { }

  async createLiterature(
    dto: CreateLiteratureDto,
    files?: { image?: any; images?: any[]; audio?: any },
  ): Promise<LiteratureDocument> {
    const existing = await this.literatureModel.findOne({ title: dto.title }).lean();
    if (existing) throw new ConflictException('Literature already exists');

    const vocabulary = dto.vocabulary;
    const grammarPoints = dto.grammarPoints;
    const comprehensionQuestions = dto.comprehensionQuestions;

    const isPublished =
      dto.isPublished === true || (dto.isPublished as any) === 'true';

    const cover = files?.image?.[0];
    const pages = files?.images ?? [];
    const audioFile = files?.audio?.[0];

    const imagesMeta = dto.imagesMeta ?? [];

    // Upload cover image to Cloudflare if exists
    let coverUrl = dto.imageUrl;
    if (cover) {
      const uploadedCover = await this.cloudflareService.uploadFile(cover, "image comics");
      coverUrl = uploadedCover.fileUrl;
    }

    // Upload audio file to Cloudflare if exists
    let audioUrl = dto.audioUrl;
    if (audioFile) {
      const uploadedAudio = await this.cloudflareService.uploadFile(audioFile, "audio");
      audioUrl = uploadedAudio.fileUrl;
    }

    // Upload page images to Cloudflare
    const images = await Promise.all(
      pages.map(async (f, idx) => {
        const uploaded = await this.cloudflareService.uploadFile(f, "image comics");
        return {
          pageIndex: imagesMeta[idx]?.pageIndex ?? idx + 1,
          image: uploaded.fileUrl,
        };
      })
    );

    let createdBy: any = dto.createdBy;
    let updatedBy: any = dto.updatedBy;

    if (dto.createdBy) {
      const user = await this.usersService.findUserById(dto.createdBy.toString());
      if (!user) throw new NotFoundException('createdBy user not found');
      createdBy = user._id;
      updatedBy = user._id;
    }

    const createData = {
      title: dto.title,
      type: dto.type,
      level: dto.level,
      topic: dto.topic,
      contentEnglish: dto.contentEnglish,
      contentVietnamese: dto.contentVietnamese,
      vocabulary,
      grammarPoints,
      comprehensionQuestions,
      isPublished,
      audioUrl: audioUrl,
      imageUrl: coverUrl,
      images: images.length ? images : undefined,
      createdBy,
      updatedBy,
    };
    const newLiterature = new this.literatureModel(createData);

    if (!newLiterature) {
      throw new BadRequestException('Failed to create literature');
    }
    return newLiterature.save();
  }



  async getLiteratures(paginationDto: PaginationDto): Promise<{
    literatures: any[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    const allowedSortFields = new Set([
      'createdAt',
      'updatedAt',
      'title',
      'level',
      'type',
      'topic',
    ]);

    // 1) sanitize page/limit
    const page = Math.max(1, Number(paginationDto.page) || 1);
    const limitRaw = Number(paginationDto.limit) || 10;
    const limit = Math.min(Math.max(1, limitRaw), 50); // max 50

    // 2) sanitize sort/order
    const sortField = allowedSortFields.has(paginationDto.sort)
      ? paginationDto.sort
      : 'createdAt';

    const sortOrder = paginationDto.order === 'asc' ? 1 : -1;

    const cacheKey = `literatures:isPublished=true:page=${page}:limit=${limit}:sort=${sortField}:order=${sortOrder}`;

    // 3) cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const filter = { isPublished: true };

    // 4) query parallel + lean
    const [literatures, total] = await Promise.all([
      this.literatureModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.literatureModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPreviousPage ? currentPage - 1 : null;

    const result = {
      literatures,
      total,
      totalPages,
      currentPage,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      prevPage,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
    return result;
  }


  async getLiteratureById(id: string): Promise<LiteratureDocument> {
    try {
      const cacheKey = `literature:id=${id}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const literature = await this.literatureModel.findById(id);
      if (!literature) {
        throw new BadRequestException('Literature not found');
      }
      const result = {
        data: literature,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateLiterature(
    id: string,
    updateLiteratureDto: UpdateLiteratureDto,
  ): Promise<LiteratureDocument> {
    try {
      const literature = await this.literatureModel.findByIdAndUpdate(
        id,
        updateLiteratureDto,
        { new: true },
      );
      if (!literature) {
        throw new BadRequestException('Literature not found');
      }
      return literature;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteLiterature(id: string): Promise<LiteratureDocument> {
    try {
      const literature = await this.literatureModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );
      if (!literature) {
        throw new BadRequestException('Literature not found');
      }
      return literature;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async restoreLiterature(id: string): Promise<LiteratureDocument> {
    try {
      const literature = await this.literatureModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true },
      );
      if (!literature) {
        throw new BadRequestException('Literature not found');
      }
      return literature;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeLiteratureStatus(
    id: string,
    status: boolean,
  ): Promise<LiteratureDocument> {
    try {
      const literature = await this.literatureModel.findByIdAndUpdate(
        id,
        { isPublished: status },
        { new: true },
      );
      if (!literature) {
        throw new BadRequestException('Literature not found');
      }
      return literature;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
