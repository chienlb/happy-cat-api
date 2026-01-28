import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { DiscussionsService } from './discussions.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ok, error } from '../../common/response/api-response';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/schema/user.schema';

@Controller('announcements')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  /**
   * POST /announcements - Tạo thông báo mới (chỉ admin) với file upload
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'attachments', maxCount: 5 },
    ]),
  )
  async createAnnouncement(
    @Body() createDto: CreateAnnouncementDto,
    @UploadedFiles()
    files: {
      thumbnail?: any[];
      attachments?: any[];
    },
    @CurrentUser() user: any,
  ) {
    const thumbnail = files?.thumbnail?.[0];
    const attachments = files?.attachments;

    const announcement = await this.discussionsService.createAnnouncement(
      createDto,
      user._id,
      thumbnail,
      attachments,
    );

    return ok(
      announcement,
      'Announcement created successfully',
      HttpStatus.CREATED,
    );
  }

  /**
   * GET /announcements - Lấy danh sách thông báo
   */
  @Get()
  async getAnnouncements(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('audience') audience?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
  ) {
    const announcements = await this.discussionsService.findAllAnnouncements(
      page,
      limit,
      audience,
      type,
      priority,
      status,
    );

    return ok(announcements, 'Announcements fetched successfully');
  }

  /**
   * GET /announcements/search - Tìm kiếm thông báo
   */
  @Get('search')
  async searchAnnouncements(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!query || query.length < 2) {
      return error(
        'Search query must be at least 2 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.discussionsService.searchAnnouncements(
      query,
      page,
      limit,
    );

    return ok(result, 'Search results found');
  }

  /**
   * GET /announcements/pinned - Lấy thông báo đã ghim
   */
  @Get('pinned')
  async getPinnedAnnouncements() {
    const announcements =
      await this.discussionsService.getPinnedAnnouncements();

    return ok(announcements, 'Pinned announcements fetched successfully');
  }

  /**
   * GET /announcements/type/:type - Lấy thông báo theo loại
   */
  @Get('type/:type')
  async getAnnouncementsByType(
    @Param('type') type: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.discussionsService.getAnnouncementsByType(
      type,
      page,
      limit,
    );

    return ok(result, `Announcements of type ${type} fetched`);
  }

  /**
   * GET /announcements/:id - Lấy chi tiết 1 thông báo
   */
  @Get(':id')
  async getAnnouncementById(@Param('id') id: string) {
    const announcement =
      await this.discussionsService.findAnnouncementById(id);

    return ok(announcement, 'Announcement fetched successfully');
  }

  /**
   * PATCH /announcements/:id - Cập nhật thông báo (chỉ admin)
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    const announcement = await this.discussionsService.updateAnnouncement(
      id,
      updateDto,
      user._id,
    );

    return ok(announcement, 'Announcement updated successfully');
  }

  /**
   * DELETE /announcements/:id - Xóa thông báo (chỉ admin)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAnnouncement(@Param('id') id: string) {
    await this.discussionsService.deleteAnnouncement(id);

    return ok(null, 'Announcement deleted successfully');
  }

  /**
   * POST /announcements/:id/pin - Ghim thông báo (chỉ admin)
   */
  @Post(':id/pin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async pinAnnouncement(@Param('id') id: string) {
    const announcement = await this.discussionsService.pinAnnouncement(id);

    return ok(announcement, 'Announcement pinned successfully');
  }

  /**
   * POST /announcements/:id/unpin - Bỏ ghim thông báo (chỉ admin)
   */
  @Post(':id/unpin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async unpinAnnouncement(@Param('id') id: string) {
    const announcement = await this.discussionsService.unpinAnnouncement(id);

    return ok(announcement, 'Announcement unpinned successfully');
  }

  /**
   * POST /announcements/:id/view - Đánh dấu đã xem
   */
  @Post(':id/view')
  async markAsViewed(@Param('id') id: string, @CurrentUser() user: any) {
    const announcement = await this.discussionsService.markAsViewed(
      id,
      user._id,
    );

    return ok(announcement, 'Marked as viewed');
  }
}
