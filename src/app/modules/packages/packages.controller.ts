import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationDto } from '../pagination/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/schema/user.schema';
import { UseGuards } from '@nestjs/common';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new package' })
  @ApiBody({
    type: CreatePackageDto,
    description: 'The package to create',
    examples: {
      normal: {
        summary: 'Example of a normal package',
        value: {
          packageId: '1234567890',
          packageName: 'Package 1',
          packageDescription: 'Package 1 description',
          packagePrice: 100,
          packageDuration: 1,
          packageCreatedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The package has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a package by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the package' })
  @ApiResponse({
    status: 200,
    description: 'The package has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findPackageById(@Param('id') id: string) {
    return this.packagesService.findPackageById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all packages' })
  @ApiQuery({ name: 'page', type: Number, description: 'The page number' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'The number of packages per page',
  })
  @ApiResponse({
    status: 200,
    description: 'The packages have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAllPackages(@Query() paginationDto: PaginationDto) {
    return this.packagesService.findAllPackages(paginationDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a package by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the package' })
  @ApiBody({
    type: UpdatePackageDto,
    description: 'The package to update',
    examples: {
      normal: {
        summary: 'Example of a normal package',
        value: {
          packageId: '1234567890',
          packageName: 'Package 1',
          packageDescription: 'Package 1 description',
          packagePrice: 100,
          packageDuration: 1,
          packageCreatedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The package has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updatePackageById(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.updatePackage(id, updatePackageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a package by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the package' })
  @ApiResponse({
    status: 200,
    description: 'The package has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deletePackageById(@Param('id') id: string) {
    return this.packagesService.deletePackage(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a package by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the package' })
  @ApiResponse({
    status: 200,
    description: 'The package has been successfully restored.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async restorePackageById(@Param('id') id: string) {
    return this.packagesService.restorePackage(id);
  }
}
