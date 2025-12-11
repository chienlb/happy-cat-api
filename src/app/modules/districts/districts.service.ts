import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from './schema/district.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
  ) { }

  async createDistrict(
    createDistrictDto: CreateDistrictDto,
  ): Promise<DistrictDocument> {
    const newDistrict = new this.districtModel(createDistrictDto);
    return await newDistrict.save();
  }

  async findAllDistricts(
    paginationDto: PaginationDto,
  ): Promise<{
    data: DistrictDocument[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    const districts = await this.districtModel
      .find({ isActive: true })
      .skip(skip)
      .limit(paginationDto.limit)
      .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 })
      .exec();
    const total = await this.districtModel.countDocuments({ isActive: true });
    const totalPages = Math.ceil(total / paginationDto.limit);
    const nextPage =
      paginationDto.page < totalPages ? paginationDto.page + 1 : null;
    const prevPage = paginationDto.page > 1 ? paginationDto.page - 1 : null;
    return {
      data: districts,
      total,
      totalPages,
      nextPage: nextPage ?? paginationDto.page,
      prevPage: prevPage ?? paginationDto.page,
    };
  }

  async findDistrictById(id: string): Promise<DistrictDocument> {
    const district = await this.districtModel.findOne({ districtId: id });
    if (!district) {
      throw new NotFoundException('District not found');
    }
    return district;
  }

  async updateDistrict(
    id: string,
    updateDistrictDto: UpdateDistrictDto,
  ): Promise<DistrictDocument> {
    const updatedDistrict = await this.districtModel.findOneAndUpdate(
      { districtId: id },
      updateDistrictDto,
      { new: true },
    );
    if (!updatedDistrict) {
      throw new NotFoundException('District not found');
    }
    return updatedDistrict;
  }

  async deleteDistrict(id: string): Promise<DistrictDocument> {
    const deletedDistrict = await this.districtModel.findOneAndDelete({
      districtId: id,
    });
    if (!deletedDistrict) {
      throw new NotFoundException('District not found');
    }
    return deletedDistrict;
  }
}
