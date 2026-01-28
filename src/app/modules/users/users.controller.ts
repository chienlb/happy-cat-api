import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  Req,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImportStudentsDto } from './dto/import-students.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ok } from '../../common/response/api-response';
import { UserRole } from './schema/user.schema';

import { JwtStrategy } from '../auths/strategies/jwt.strategy';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../pagination/pagination.dto';
import mongoose, { ClientSession } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnyARecord } from 'dns';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Create a new user',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      const callerRole = (req.user as { role?: UserRole })?.role;
      const result = await this.usersService.createUser(
        createUserDto,
        undefined,
        callerRole,
      );
      return ok(result, 'User created successfully', 200);
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      throw new BadRequestException(error?.message ?? 'Bad request');
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'The page number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'The number of users per page',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const users = await this.usersService.findAllUsers(paginationDto);
    return ok(users, 'Users retrieved successfully');
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User retrieved successfully');
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateUserById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.updateUserById(id, dto);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User updated successfully');
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteUserById(@Param('id') id: string) {
    const user = await this.usersService.removeUserById(id);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User deleted successfully');
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get user by slug' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'slug', description: 'The slug of the user' })
  async getUserBySlug(@Param('slug') slug: string) {
    const user = await this.usersService.getUserBySlug(slug);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User retrieved successfully');
  }

  @Post('import-from-excel')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import students from Excel file' })
  @ApiBody({
    description: 'Excel file containing student data (columns: fullname, email, birthDate, gender, phone)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx or .xls)',
        },
        groupId: {
          type: 'string',
          description: 'Group/Class ID to add students to',
        },
        autoEnroll: {
          type: 'boolean',
          default: true,
          description: 'Automatically add students to the group',
        },
        sendInviteEmail: {
          type: 'boolean',
          default: true,
          description: 'Send invite email with login credentials',
        },
        autoPassword: {
          type: 'string',
          description: 'Default password for all students (if not provided, random passwords will be generated)',
        },
      },
      required: ['file', 'groupId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Students imported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - no permission' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async importStudentsFromExcel(
    @UploadedFile() file: any,
    @Body() importDto: ImportStudentsDto,
    @Req() req: Request,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Excel file is required');
      }

      // Validate file extension
      const allowedExtensions = ['.xlsx', '.xls', '.csv'];
      const fileName = file.originalname.toLowerCase();
      const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

      if (!hasValidExtension) {
        throw new BadRequestException(
          `Invalid file format. Allowed formats: ${allowedExtensions.join(', ')}`,
        );
      }

      const userId = (req.user as { sub?: string })?.sub || '';
      const result = await this.usersService.importStudentsFromExcel(
        file,
        importDto,
        userId,
      );

      return ok(result, result.message, 201);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to import students',
      );
    }
  }
}
