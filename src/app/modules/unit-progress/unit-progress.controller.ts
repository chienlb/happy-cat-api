import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitProgressService } from './unit-progress.service';
import { CreateUnitProgressDto } from './dto/create-unit-progress.dto';
import { UpdateUnitProgressDto } from './dto/update-unit-progress.dto';

@Controller('unit-progress')
export class UnitProgressController {
  constructor(private readonly unitProgressService: UnitProgressService) {}

  @Post()
  create(@Body() createUnitProgressDto: CreateUnitProgressDto) {
    return this.unitProgressService.create(createUnitProgressDto);
  }

  @Get()
  findAll() {
    return this.unitProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitProgressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitProgressDto: UpdateUnitProgressDto) {
    return this.unitProgressService.update(+id, updateUnitProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitProgressService.remove(+id);
  }
}
