import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeatureFlag, FeatureFlagDocument } from './schema/feature-flag.schema';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectModel(FeatureFlag.name)
    private featureFlagModel: Model<FeatureFlagDocument>,
  ) {}

  async createFeatureFlag(
    createFeatureFlagDto: CreateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    try {
      const createdFeatureFlag = new this.featureFlagModel(
        createFeatureFlagDto,
      );
      return await createdFeatureFlag.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create feature flag');
    }
  }

  async findAllFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      return await this.featureFlagModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all feature flags',
      );
    }
  }

  async findFeatureFlagById(id: string): Promise<FeatureFlag> {
    try {
      const featureFlag = await this.featureFlagModel.findById(id).exec();
      if (!featureFlag) {
        throw new NotFoundException('Feature flag not found');
      }
      return featureFlag;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find feature flag by id',
      );
    }
  }

  async updateFeatureFlag(
    id: string,
    updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    try {
      const updatedFeatureFlag = await this.featureFlagModel
        .findByIdAndUpdate(id, updateFeatureFlagDto, { new: true })
        .exec();
      if (!updatedFeatureFlag) {
        throw new NotFoundException('Feature flag not found');
      }
      return updatedFeatureFlag;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update feature flag');
    }
  }

  async deleteFeatureFlag(id: string): Promise<FeatureFlag> {
    try {
      const deletedFeatureFlag = await this.featureFlagModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedFeatureFlag) {
        throw new NotFoundException('Feature flag not found');
      }
      return deletedFeatureFlag;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete feature flag');
    }
  }
}
