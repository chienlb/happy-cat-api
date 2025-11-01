import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  create(@Body() createFeatureFlagDto: CreateFeatureFlagDto) {
    return this.featureFlagsService.create(createFeatureFlagDto);
  }

  @Get()
  findAll() {
    return this.featureFlagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureFlagsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
  ) {
    return this.featureFlagsService.update(+id, updateFeatureFlagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureFlagsService.remove(+id);
  }
}
