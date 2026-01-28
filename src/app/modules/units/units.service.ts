import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument, UnitStatus } from './schema/unit.schema';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { RedisService } from 'src/app/configs/redis/redis.service';
import { UnitProgressService } from '../unit-progress/unit-progress.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<UnitDocument>,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly cloudflareService: CloudflareService,
    @Inject(forwardRef(() => UnitProgressService))
    private readonly unitProgressService: UnitProgressService,
  ) {}

  async createUnit(
    userId: string,
    createUnitDto: CreateUnitDto,
    session?: ClientSession,
    thumbnail?: { buffer: Buffer; originalname: string; mimetype: string },
    banner?: { buffer: Buffer; originalname: string; mimetype: string },
    materialsFiles?: {
      textLessons: { buffer: Buffer; originalname: string; mimetype: string }[];
      audios: { buffer: Buffer; originalname: string; mimetype: string }[];
      videos: { buffer: Buffer; originalname: string; mimetype: string }[];
      exercises: { buffer: Buffer; originalname: string; mimetype: string }[];
    },
  ) {
    try {
      const user = await this.usersService.findUserById(
        userId,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let thumbnailUrl: string | undefined = createUnitDto.thumbnail;
      let bannerUrl: string | undefined = createUnitDto.banner;

      if (thumbnail) {
        const upload = await this.cloudflareService.uploadFile(
          thumbnail,
          'units/thumbnails',
        );
        thumbnailUrl = upload.fileUrl;
      }
      if (banner) {
        const upload = await this.cloudflareService.uploadFile(
          banner,
          'units/banners',
        );
        bannerUrl = upload.fileUrl;
      }

      const dtoMaterials = createUnitDto.materials ?? {};
      let materials: {
        textLessons?: string[];
        videos?: string[];
        audios?: string[];
        exercises?: string[];
      } = {
        textLessons: [...(dtoMaterials.textLessons ?? [])],
        audios: [...(dtoMaterials.audios ?? [])],
        videos: [...(dtoMaterials.videos ?? [])],
        exercises: [...(dtoMaterials.exercises ?? [])],
      };

      if (materialsFiles) {
        const uploadMany = async (
          files: { buffer: Buffer; originalname: string; mimetype: string }[],
          folder: string,
        ) => {
          const urls: string[] = [];
          for (const f of files) {
            const u = await this.cloudflareService.uploadFile(f, folder);
            urls.push(u.fileUrl);
          }
          return urls;
        };
        if (materialsFiles.textLessons?.length) {
          const urls = await uploadMany(
            materialsFiles.textLessons,
            'units/materials/text-lessons',
          );
          materials.textLessons = [...urls, ...(materials.textLessons ?? [])];
        }
        if (materialsFiles.audios?.length) {
          const urls = await uploadMany(
            materialsFiles.audios,
            'units/materials/audios',
          );
          materials.audios = [...urls, ...(materials.audios ?? [])];
        }
        if (materialsFiles.videos?.length) {
          const urls = await uploadMany(
            materialsFiles.videos,
            'units/materials/videos',
          );
          materials.videos = [...urls, ...(materials.videos ?? [])];
        }
        if (materialsFiles.exercises?.length) {
          const urls = await uploadMany(
            materialsFiles.exercises,
            'units/materials/exercises',
          );
          materials.exercises = [...urls, ...(materials.exercises ?? [])];
        }
      }
      const newUnit = new this.unitModel({
        ...createUnitDto,
        thumbnail: thumbnailUrl,
        banner: bannerUrl,
        materials,
        createdBy: userId,
        updatedBy: userId,
      });
      await newUnit.save();
      return newUnit;
    } catch (error) {
      throw new Error('Failed to create unit: ' + error.message);
    }
  }

  async findAllUnits(paginationDto: PaginationDto, session?: ClientSession) {
    try {
      const cacheKey = `units:page=${paginationDto.page}:limit=${paginationDto.limit}:sort=${paginationDto.sort}:order=${paginationDto.order}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const units = await this.unitModel
        .find({ isActive: UnitStatus.ACTIVE })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .session(session || null);
      const result = {
        data: units,
        page: paginationDto.page,
        limit: paginationDto.limit,
        total: units.length,
        totalPages: Math.ceil(units.length / paginationDto.limit),
        nextPage:
          paginationDto.page < Math.ceil(units.length / paginationDto.limit)
            ? paginationDto.page + 1
            : null,
        prevPage: paginationDto.page > 1 ? paginationDto.page - 1 : null,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result;
    } catch (error) {
      throw new Error('Failed to find all units: ' + error.message);
    }
  }

  async findUnitById(id: string, session?: ClientSession) {
    const cacheKey = `unit:id=${id}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const unit = await this.unitModel.findById(id).session(session || null);
    return unit;
  }

  async updateUnitById(
    id: string,
    updateUnitDto: UpdateUnitDto,
    session?: ClientSession,
  ) {
    try {
      const unit = await this.unitModel
        .findByIdAndUpdate(id, updateUnitDto, { session })
        .session(session || null);
      return unit;
    } catch (error) {
      throw new Error('Failed to update unit: ' + error.message);
    }
  }

  async deleteUnitById(id: string, session?: ClientSession) {
    try {
      const unit = await this.unitModel
        .findByIdAndUpdate(id, { isActive: UnitStatus.INACTIVE }, { session })
        .session(session || null);
      return unit;
    } catch (error) {
      throw new Error('Failed to delete unit: ' + error.message);
    }
  }

  async restoreUnitById(id: string, session?: ClientSession) {
    try {
      const unit = await this.unitModel
        .findByIdAndUpdate(id, { isActive: UnitStatus.ACTIVE }, { session })
        .session(session || null);
      return unit;
    } catch (error) {
      throw new Error('Failed to restore unit: ' + error.message);
    }
  }

  async getUnitByUserId(
    userId: string,
    orderIndex: number,
    unitId: string,
    session?: ClientSession,
  ) {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const unitProgress = await this.unitProgressService.findUnitByUserId(
        userId,
        orderIndex - 1,
        unitId,
      );
      if (!unitProgress) {
        throw new NotFoundException('Unit progress not found');
      }
      const unit = await this.unitModel
        .findById(unitProgress.unitId)
        .session(session || null);
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
      return unit;
    } catch (error) {
      throw new Error('Failed to get unit by user id: ' + error.message);
    }
  }
}
