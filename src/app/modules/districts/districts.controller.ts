import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(+id, updateDistrictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtsService.remove(+id);
  }
}
