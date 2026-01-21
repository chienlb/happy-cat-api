import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { BadgesService } from './badges.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { BadgeType } from './schema/badge.schema';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/schema/user.schema';
import { Roles } from 'src/app/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';

@ApiTags('Badges')
@ApiBearerAuth()
@Controller('badges')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.ADMIN)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new badge (form-data)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('iconUrl'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        iconUrl: { type: 'string', format: 'binary' },
        type: {
          type: 'string',
          enum: Object.values(BadgeType),
        },
        level: { type: 'number' },
        criteria: { type: 'string' },
        isActive: { type: 'boolean' },
      },
      required: ['name', 'type', 'criteria', 'isActive'],
    },
  })
  async createBadge(
    @UploadedFile() file: any,
    @Body() createBadgeDto: CreateBadgeDto,
    @Req() req: any,
  ) {
    const user = req.user; // hoặc interface JwtPayload
    console.log(user);

    // if (!user || !user._id) {
    //   throw new BadRequestException('User not found');
    // }

    return this.badgesService.createBadge(
      {
        ...createBadgeDto,
        createdBy: user?.userId,
        updatedBy: user?.userId,
      },
      file,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all badges' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAllBadges(@Query() query: any) {
    return this.badgesService.findAllBadges(query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get badge by id' })
  @ApiParam({ name: 'id', type: String })
  async findBadgeById(@Param('id') id: string) {
    return this.badgesService.findBadgeById(id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update badge by id' })
  async updateBadgeById(
    @Param('id') id: string,
    @Body() updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.updateBadgeById(id, updateBadgeDto);
  }
}
