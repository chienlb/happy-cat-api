import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { SubmitPracticeDto } from './dto/submit-practice.dto';

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Post()
  create(@Body() createPracticeDto: CreatePracticeDto) {
    return this.practicesService.create(createPracticeDto);
  }

  @Get()
  findAll() {
    return this.practicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePracticeDto: UpdatePracticeDto) {
    return this.practicesService.update(id, updatePracticeDto);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() submitPracticeDto: SubmitPracticeDto) {
    return this.practicesService.submit(id, submitPracticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practicesService.remove(id);
  }

  @Get('student/:studentId')
  getAllPracticesByStudentId(@Param('studentId') studentId: string) {
    return this.practicesService.getAllPracticesByStudentId(studentId);
  }
}
