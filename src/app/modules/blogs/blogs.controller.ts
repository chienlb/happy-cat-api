import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { ok } from 'assert';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post('create')
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.createBlog(createBlogDto);
  }

  @Get('all')
  findAllBlogs(paginationDto: PaginationDto) {
    return this.blogsService.findAllBlogs(paginationDto);
  }

  @Get('view/:id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findBlogById(id);  
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    const result = this.blogsService.deleteBlog(id);
    return ok(result, 'Blog deleted successfully');
  }
}
