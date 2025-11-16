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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ok } from '../../common/response/api-response';
import { UserRole } from './schema/user.schema';

import { JwtStrategy } from '../auths/strategies/jwt.strategy';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Create a new user',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 201, description: 'Created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    const users = await this.usersService.findAll();
    return ok(users, 'Users retrieved successfully');
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Get user by ID' })
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User retrieved successfully');
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ type: UpdateUserDto })
  async updateUserById(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUserById(id, dto);
    if (!user) throw new NotFoundException('User not found.');
    return ok(user, 'User updated successfully');
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUserById(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
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
}
