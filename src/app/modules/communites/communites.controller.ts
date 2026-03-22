import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Communite } from './schema/communite.schema';
import { CreateCommuniteDto } from './dto/create-communite.dto';
import { UpdateCommuniteDto } from './dto/update-communite.dto';
import { CommunitesService } from './communites.service';
import { PaginationDto } from '../pagination/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('communites')
export class CommunitesController {
  constructor(private readonly communitesService: CommunitesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCommunite(
    @Body() createCommuniteDto: CreateCommuniteDto,
    @Req() req: Request & { user?: any },
    @UploadedFile() file?: any,
  ): Promise<Communite> {
    const userId = req.user?.userId;
    createCommuniteDto.userId = userId;

    if (file) {
      createCommuniteDto.file = file;
    }

    return this.communitesService.createCommunite(createCommuniteDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<Communite[]> {
    return this.communitesService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Communite> {
    return this.communitesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommuniteDto: UpdateCommuniteDto,
  ): Promise<Communite> {
    return this.communitesService.update(id, updateCommuniteDto);
  }

  @Post(':id/comment')
  @UseInterceptors(FileInterceptor('file'))
  async comment(
    @Param('id') id: string,
    @Req() req: Request & { user?: any },
    @Body() commentDto: { userId: string; content: string; image?: any },
    @UploadedFile() file?: any,
  ): Promise<Communite> {
    if (file) {
      commentDto.image = file;
    }
    commentDto.userId = req.user?.userId;
    return this.communitesService.comment(id, commentDto);
  }

  @Post(':id/like')
  async like(@Param('id') id: string): Promise<Communite> {
    return this.communitesService.like(id);
  }

  @Get(':user/fullname')
  async getFullname(@Param('user') userId: string): Promise<string> {
    return this.communitesService.getFullname(userId);
  }
}