import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';
import { PaginationDto } from '../pagination/pagination.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }
  async createBlog(createBlogDto: CreateBlogDto) {
    try {
      const { title, slug, content, author, isActive, isFeatured } = createBlogDto;
      const newBlog = new this.blogModel({
        title,
        content,
        author,
        isActive: isActive || true,
        isFeatured: isFeatured || false,
      });

      if (!newBlog) {
        throw new Error('Failed to create blog');
      }

      const createdBlog = await newBlog.save();
      return createdBlog;
    } catch (error) {
      throw new Error('Failed to create blog');
    }
  }

  async findAllBlogs(paginationDto: PaginationDto) {
    try {
      const page = paginationDto.page || 1;
      const limit = paginationDto.limit || 10;

      const [blogs, total] = await Promise.all([
        this.blogModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        this.blogModel.countDocuments()
      ]);

      if (blogs.length === 0) {
        throw new Error('No blogs found');
      }

      return {
        data: blogs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };

    } catch (error) {
      throw new Error('Failed to retrieve blogs: ' + error.message);
    }
  }

  async findBlogById(id: string) {
    try {
      const blog = await this.blogModel.findById(id).exec();
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    } catch (error) {
      throw new Error('Failed to retrieve blog');
    }
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, { new: true }).exec();
      if (!updatedBlog) {
        throw new Error('Blog not found');
      }
      return updatedBlog;
    } catch (error) {
      throw new Error('Failed to update blog');
    }
  }

  async deleteBlog(id: string) {
    try {
      const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
      if (!deletedBlog) {
        throw new Error('Blog not found');
      }
      return deletedBlog;
    } catch (error) {
      throw new Error('Failed to delete blog');
    }
  }
}
