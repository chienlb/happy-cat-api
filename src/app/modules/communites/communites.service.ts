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

  async createCommunite(createCommuniteDto: CreateCommuniteDto): Promise<Communite> {
    if (createCommuniteDto.image) {
      const imageUrl = await this.cloudflareService.uploadImage(createCommuniteDto.image);
      createCommuniteDto.image = imageUrl as any; // Cast to any to bypass type mismatch
    }
    const createdCommunite = new this.communiteModel(createCommuniteDto);
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
    if (updateCommuniteDto.image) {
      const imageUrl = await this.cloudflareService.uploadImage(updateCommuniteDto.image);
      updateCommuniteDto.image = imageUrl as any; // Cast to any to bypass type mismatch
    }
    const updatedCommunite = await this.communiteModel.findByIdAndUpdate(id, updateCommuniteDto, { new: true }).exec();
    if (!updatedCommunite) {
      throw new Error('Communite not found');
    }
    return updatedCommunite;  
  }

  async comment(id: string, commentDto: { userId: string; content: string; image?: any }): Promise<Communite> {
    let imageUrl: string | undefined;
    if (commentDto.image) {
      imageUrl = await this.cloudflareService.uploadImage(commentDto.image);
    }

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