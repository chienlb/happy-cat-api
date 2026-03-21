import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Communite, CommuniteDocument } from './schema/communite.schema';
import { CreateCommuniteDto } from './dto/create-communite.dto';
import { UpdateCommuniteDto } from './dto/update-communite.dto';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class CommunitesService {
  constructor(
    @InjectModel(Communite.name) private communiteModel: Model<CommuniteDocument>,
    private cloudflareService: CloudflareService,
  ) {}

  private async resolveImageUrl(image?: any): Promise<string | undefined> {
    if (!image) {
      return undefined;
    }

    // Keep existing URL/path if FE already provides a string.
    if (typeof image === 'string') {
      return image;
    }

    // Upload multipart file object to Cloudflare R2.
    if (image.buffer && image.originalname && image.mimetype) {
      return this.cloudflareService.uploadImage(image);
    }

    return undefined;
  }

  async createCommunite(createCommuniteDto: CreateCommuniteDto): Promise<Communite> {
    const imageUrl = await this.resolveImageUrl(
      createCommuniteDto.file ?? createCommuniteDto.image,
    );
    const createdCommunite = new this.communiteModel({
      ...createCommuniteDto,
      image: imageUrl,
    });
    return createdCommunite.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<Communite[]> {
    const { page, limit } = paginationDto;
    return this.communiteModel.find().skip((page - 1) * limit).limit(limit).exec();
  }

  async findOne(id: string): Promise<Communite> {
    const communite = await this.communiteModel.findById(id).exec();
    if (!communite) {
      throw new Error('Communite not found');
    }
    return communite;
  }

  async update(id: string, updateCommuniteDto: UpdateCommuniteDto): Promise<Communite> {
    const imageUrl = await this.resolveImageUrl(updateCommuniteDto.image);
    if (imageUrl) {
      updateCommuniteDto.image = imageUrl;
    }
    const updatedCommunite = await this.communiteModel.findByIdAndUpdate(id, updateCommuniteDto, { new: true }).exec();
    if (!updatedCommunite) {
      throw new Error('Communite not found');
    }
    return updatedCommunite;  
  }

  async comment(id: string, commentDto: { userId: string; content: string; image?: any }): Promise<Communite> {
    const imageUrl = await this.resolveImageUrl(commentDto.image);

    const comment = {
      userId: commentDto.userId,
      content: commentDto.content,
      image: imageUrl,
    };

    const updatedCommunite = await this.communiteModel.findByIdAndUpdate(
      id,
      {
        $push: { comments: comment },
        $inc: { totalComments: 1 },
      },
      { new: true },
    ).exec();

    if (!updatedCommunite) {
      throw new Error('Communite not found');
    }

    return updatedCommunite;
  }

  async like(id: string): Promise<Communite> {
    const updatedCommunite = await this.communiteModel.findByIdAndUpdate(
      id,
      { $inc: { totalLikes: 1 } },
      { new: true },
    ).exec();
    if (!updatedCommunite) {
      throw new Error('Communite not found');
    }
    return updatedCommunite;
  }
}