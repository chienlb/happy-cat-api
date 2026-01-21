import {
  Controller,
  HttpException,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag } from './schema/feature-flag.schema';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { FlagScope } from './schema/feature-flag.schema';

@ApiTags('Feature Flags')
@ApiBearerAuth()
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feature flag' })
  @ApiBody({
    type: CreateFeatureFlagDto,
    description: 'The feature flag to create',
    examples: {
      example1: {
        value: {
          flagName: 'feature_flag_1',
          isEnabled: true,
          scope: FlagScope.GLOBAL,
          targetIds: ['1234567890'],
          createdBy: '1234567890',
          updatedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The feature flag has been successfully created.',
    type: CreateFeatureFlagDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async createFeatureFlag(
    @Body() createFeatureFlagDto: CreateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    return this.featureFlagsService.createFeatureFlag(createFeatureFlagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({
    status: 200,
    description: 'The feature flags have been successfully retrieved.',
    type: [FeatureFlag],
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async findAllFeatureFlags(): Promise<FeatureFlag[]> {
    return this.featureFlagsService.findAllFeatureFlags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feature flag by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feature flag',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The feature flag has been successfully retrieved.',
    type: FeatureFlag,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async findFeatureFlagById(@Param('id') id: string): Promise<FeatureFlag> {
    return this.featureFlagsService.findFeatureFlagById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a feature flag by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feature flag',
    type: String,
  })
  @ApiBody({
    type: UpdateFeatureFlagDto,
    description: 'The feature flag to update',
    examples: {
      example1: {
        value: {
          flagName: 'feature_flag_1',
          isEnabled: true,
          scope: FlagScope.GLOBAL,
          targetIds: ['1234567890'],
          createdBy: '1234567890',
          updatedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The feature flag has been successfully updated.',
    type: UpdateFeatureFlagDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async updateFeatureFlagById(
    @Param('id') id: string,
    @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    return this.featureFlagsService.updateFeatureFlag(id, updateFeatureFlagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feature flag by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the feature flag',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The feature flag has been successfully deleted.',
    type: FeatureFlag,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: HttpException })
  async deleteFeatureFlag(@Param('id') id: string): Promise<FeatureFlag> {
    return this.featureFlagsService.deleteFeatureFlag(id);
  }
}
