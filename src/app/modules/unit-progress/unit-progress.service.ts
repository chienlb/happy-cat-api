import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UnitProgress, UnitProgressDocument } from './schema/unit-progress.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { UnitsService } from '../units/units.service';
import { CreateUnitProgressDto } from './dto/create-unit-progress.dto';

@Injectable()
export class UnitProgressService {
  constructor(
    @InjectModel(UnitProgress.name) private unitProgressModel: Model<UnitProgressDocument>,
    private readonly usersService: UsersService,
    private readonly unitsService: UnitsService,
  ) { }

  async createUnitProgress(createUnitProgressDto: CreateUnitProgressDto): Promise<UnitProgressDocument> {
    try {
      const user = await this.usersService.findUserById(createUnitProgressDto.userId.toString());
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const unit = await this.unitsService.findUnitById(createUnitProgressDto.unitId.toString());
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
      const unitProgress = new this.unitProgressModel(createUnitProgressDto);
      return unitProgress.save();
    } catch (error) {
      throw new Error('Failed to create unit progress: ' + error.message);
    }
  }

  async findUnitByUserId(userId: string, orderIndex: number): Promise<UnitProgressDocument> {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const unitProgress = await this.unitProgressModel.findOne({ userId: user._id, orderIndex: orderIndex });
      if (!unitProgress) {
        throw new NotFoundException('Unit progress not found');
      }
      return unitProgress;
    } catch (error) {
      throw new Error('Failed to find unit by user id: ' + error.message);
    }
  }
}
