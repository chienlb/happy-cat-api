import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument, UnitStatus } from './schema/unit.schema';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<UnitDocument>,
    private readonly usersService: UsersService,
  ) { }
  async createUnit(createUnitDto: CreateUnitDto, session?: ClientSession) {
    try {
      const user = await this.usersService.findUserById(
        createUnitDto.createdBy,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const existingUnit = await this.unitModel.findOne({
        slug: createUnitDto.name,
      });
      if (existingUnit) {
        throw new BadRequestException('Unit already exists');
      }
      const newUnit = new this.unitModel({
        ...createUnitDto,
        createdBy: user._id,
        updatedBy: user._id,
      });
      await newUnit.save({ session });
      return newUnit;
    } catch (error) {
      throw new Error('Failed to create unit: ' + error.message);
    }
  }

  async findAllUnits(page?: number, limit?: number, session?: ClientSession) {
    try {
      const units = await this.unitModel
        .find({ isActive: UnitStatus.ACTIVE })
        .skip((page || 1) - 1 * (limit || 10))
        .limit(limit || 10)
        .session(session || null);
      return {
        data: units,
        page: page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(units.length / (limit || 10)),
        nextPage: page ? page + 1 : 2,
        prevPage: page ? page - 1 : 1,
      };
    } catch (error) {
      throw new Error('Failed to find all units: ' + error.message);
    }
  }

  async findUnitById(id: string, session?: ClientSession) {
    return await this.unitModel.findById(id).session(session || null);
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
}
