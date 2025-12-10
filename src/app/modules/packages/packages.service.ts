import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './schema/package.schema';
import { UsersService } from '../users/users.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private packageRepository: Model<PackageDocument>,
    private usersService: UsersService,
  ) { }

  async createPackage(
    createPackageDto: CreatePackageDto,
  ): Promise<PackageDocument> {
    try {
      const user = await this.usersService.findUserById(
        createPackageDto.createdBy as string,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newPackage = new this.packageRepository(createPackageDto);
      return await newPackage.save();
    } catch (error) {
      throw new Error('Failed to create package: ' + (error?.message || error));
    }
  }

  async findPackageById(id: string): Promise<PackageDocument> {
    const packageResult = await this.packageRepository.findById(id);
    if (!packageResult) {
      throw new NotFoundException('Package not found');
    }
    return packageResult;
  }

  async findAllPackages(
    paginationDto: PaginationDto,
  ): Promise<{
    data: PackageDocument[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    const packages = await this.packageRepository
      .find({ isActive: true })
      .skip(skip)
      .limit(paginationDto.limit)
      .exec();
    const total = await this.packageRepository.countDocuments({
      isActive: true,
    });
    const totalPages = Math.ceil(total / paginationDto.limit);
    const nextPage = paginationDto.page < totalPages ? paginationDto.page + 1 : null;
    const prevPage = paginationDto.page > 1 ? paginationDto.page - 1 : null;
    return {
      data: packages as PackageDocument[],
      total,
      totalPages,
      nextPage: nextPage ?? paginationDto.page,
      prevPage: prevPage ?? paginationDto.page,
    };
  }

  async updatePackage(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDocument> {
    const packageResult = await this.findPackageById(id);
    if (!packageResult) {
      throw new NotFoundException('Package not found');
    }
    const updatedPackage = await this.packageRepository.findByIdAndUpdate(
      id,
      updatePackageDto,
      { new: true },
    );
    if (!updatedPackage) {
      throw new NotFoundException('Package not found');
    }
    return updatedPackage;
  }

  async deletePackage(id: string): Promise<PackageDocument> {
    const packageResult = await this.findPackageById(id);
    if (!packageResult) {
      throw new NotFoundException('Package not found');
    }
    // Fixed: Use _id instead of packageId to mark as inactive by id
    const deletedPackage = await this.packageRepository.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedPackage) {
      throw new NotFoundException('Package not found');
    }
    return deletedPackage;
  }

  async restorePackage(id: string): Promise<PackageDocument> {
    const packageResult = await this.findPackageById(id);
    if (!packageResult) {
      throw new NotFoundException('Package not found');
    }
    // Fixed: Use _id instead of packageId to restore by id
    const restoredPackage = await this.packageRepository.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
    if (!restoredPackage) {
      throw new NotFoundException('Package not found');
    }
    return restoredPackage;
  }
}
