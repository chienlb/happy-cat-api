import {
  Controller,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UnitsService } from './units.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/schema/user.schema';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Body, Delete, Get, Patch } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PaginationDto } from '../pagination/pagination.dto';

@ApiTags('Units')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: 'Create a new unit (form-data + thumbnail, banner, materials upload)' })
  @ApiBody({
    description: 'Create a new unit',
    type: CreateUnitDto,
    examples: {
      normal: {
        summary: 'Example of a normal unit',
        value: {
          name: 'Unit 1: Greetings',
          description: 'Learn basic greetings and introductions',
          topic: 'Greetings and Introductions',
          slug: 'unit-1-greetings',
          grade: 'Grade 6',
          level: 'A1',
          difficulty: 'easy',
          orderIndex: 1,
          totalLessons: 10,
          objectives: [
            'Understand basic greetings',
            'Learn introduction phrases',
          ],
          materials: {
            textLessons: ['https://example.com/text-lesson-1.pdf'],
            videos: ['https://example.com/video-1.mp4'],
            audios: ['https://example.com/audio-1.mp3'],
            exercises: ['https://example.com/exercise-1'],
          },
          prerequisites: ['507f1f77bcf86cd799439010'],
          estimatedDuration: 120,
          thumbnail: 'https://example.com/thumbnail.jpg',
          banner: 'https://example.com/banner.jpg',
          tags: ['greetings', 'A1', 'self-learning'],
          isActive: 'active',
          createdBy: '507f1f77bcf86cd799439011',
          updatedBy: '507f1f77bcf86cd799439011',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(
    @Body() createUnitDto: CreateUnitDto,
    @UploadedFiles() files?: any[],
    @Req  () req?: any,
  ) {
    const thumbnail = files?.find((f) => f.fieldname === 'thumbnail');
    const banner = files?.find((f) => f.fieldname === 'banner');
    const textLessons = files?.filter((f) => f.fieldname === 'textLessons') ?? [];
    const audios = files?.filter((f) => f.fieldname === 'audios') ?? [];
    const videos = files?.filter((f) => f.fieldname === 'videos') ?? [];
    const exercises = files?.filter((f) => f.fieldname === 'exercises') ?? [];
    return this.unitsService.createUnit(
      req.user.userId,
      createUnitDto,
      undefined,
      thumbnail,
      banner,
      { textLessons, audios, videos, exercises },
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Units fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.unitsService.findAllUnits(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a unit by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Unit ID' })
  @ApiResponse({ status: 200, description: 'Unit fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findById(@Param('id') id: string) {
    return this.unitsService.findUnitById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Unit ID' })
  @ApiBody({ description: 'Update a unit', type: UpdateUnitDto })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  updateById(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.updateUnitById(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Unit ID' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  deleteById(@Param('id') id: string) {
    return this.unitsService.deleteUnitById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a unit by user ID' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Unit fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getUnitByUserId(
    @Param('userId') userId: string,
    @Query('orderIndex') orderIndex: number,
    @Query('unitId') unitId: string,
  ) {
    return this.unitsService.getUnitByUserId(userId, orderIndex, unitId);
  }
}
