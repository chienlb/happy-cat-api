import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Discussion,
  DiscussionDocument,
  AnnouncementStatus,
} from './schema/discussion.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class DiscussionsService {
  private readonly logger = new Logger(DiscussionsService.name);

  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
  ) {}

  /**
   * Tạo thông báo mới (chỉ admin) với file upload
   */
  async createAnnouncement(
    createDto: CreateAnnouncementDto,
    userId: string,
    thumbnail?: any,
    attachments?: any[],
  ): Promise<DiscussionDocument> {
    try {
      // Upload thumbnail if provided
      let thumbnailUrl = createDto.thumbnail;
      if (thumbnail) {
        thumbnailUrl = await this.uploadFile(thumbnail, 'thumbnail');
      }

      // Upload attachments if provided
      let attachmentUrls = createDto.attachments || [];
      if (attachments && attachments.length > 0) {
        const uploadedAttachments = await Promise.all(
          attachments.map((file) => this.uploadFile(file, 'attachment')),
        );
        attachmentUrls = [...attachmentUrls, ...uploadedAttachments];
      }

      const announcement = new this.discussionModel({
        ...createDto,
        authorId: userId,
        thumbnail: thumbnailUrl,
        attachments: attachmentUrls,
        publishedAt:
          createDto.status === AnnouncementStatus.PUBLISHED
            ? new Date()
            : null,
      });

      return await announcement.save();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create announcement: ${message}`);
      throw new BadRequestException(
        `Failed to create announcement: ${message}`,
      );
    }
  }

  /**
   * Lấy tất cả thông báo (với pagination & filter)
   */
  async findAllAnnouncements(
    page: number = 1,
    limit: number = 10,
    audience?: string,
    type?: string,
    priority?: string,
    status?: string,
  ): Promise<{
    data: DiscussionDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      // Filter by status (default PUBLISHED)
      query.status = status || AnnouncementStatus.PUBLISHED;

      // Filter by audience
      if (audience) {
        query.audience = { $in: ['ALL', audience.toUpperCase()] };
      }

      // Filter by type
      if (type) {
        query.type = type.toUpperCase();
      }

      // Filter by priority
      if (priority) {
        query.priority = priority.toUpperCase();
      }

      // Filter out expired announcements
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } },
      ];

      const announcements = await this.discussionModel
        .find(query)
        .populate('authorId', 'fullname avatar')
        .populate('relatedIds.competitionId', 'title')
        .populate('relatedIds.lessonId', 'title')
        .populate('relatedIds.unitId', 'title')
        .populate('relatedIds.groupId', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ isPinned: -1, publishedAt: -1, createdAt: -1 });

      const total = await this.discussionModel.countDocuments(query);

      return {
        data: announcements,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch announcements: ${message}`);
      throw new BadRequestException(
        `Failed to fetch announcements: ${message}`,
      );
    }
  }

  /**
   * Lấy chi tiết 1 thông báo
   */
  async findAnnouncementById(id: string): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel
        .findById(id)
        .populate('authorId', 'fullname avatar')
        .populate('relatedIds.competitionId', 'title')
        .populate('relatedIds.lessonId', 'title')
        .populate('relatedIds.unitId', 'title')
        .populate('relatedIds.groupId', 'name');

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      // Increment view count
      announcement.viewCount = (announcement.viewCount || 0) + 1;
      await announcement.save();

      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to find announcement: ${message}`);
      throw new BadRequestException(`Failed to find announcement: ${message}`);
    }
  }

  /**
   * Cập nhật thông báo (chỉ admin/author)
   */
  async updateAnnouncement(
    id: string,
    updateDto: UpdateAnnouncementDto,
    userId: string,
  ): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel.findById(id);

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      // Update publishedAt nếu status thay đổi sang PUBLISHED
      if (
        updateDto.status === AnnouncementStatus.PUBLISHED &&
        !announcement.publishedAt
      ) {
        updateDto.publishedAt = new Date();
      }

      const updated = await this.discussionModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Announcement not found');
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to update announcement: ${message}`);
      throw new BadRequestException(
        `Failed to update announcement: ${message}`,
      );
    }
  }

  /**
   * Xóa thông báo (chỉ admin)
   */
  async deleteAnnouncement(id: string): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel.findByIdAndDelete(id);

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete announcement: ${message}`);
      throw new BadRequestException(
        `Failed to delete announcement: ${message}`,
      );
    }
  }

  /**
   * Ghim thông báo
   */
  async pinAnnouncement(id: string): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel.findByIdAndUpdate(
        id,
        { isPinned: true },
        { new: true },
      );

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Failed to pin announcement: ${message}`);
    }
  }

  /**
   * Bỏ ghim thông báo
   */
  async unpinAnnouncement(id: string): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel.findByIdAndUpdate(
        id,
        { isPinned: false },
        { new: true },
      );

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to unpin announcement: ${message}`,
      );
    }
  }

  /**
   * Mark as viewed
   */
  async markAsViewed(
    id: string,
    userId: string,
  ): Promise<DiscussionDocument> {
    try {
      const announcement = await this.discussionModel.findByIdAndUpdate(
        id,
        { $addToSet: { viewedBy: new Types.ObjectId(userId) } },
        { new: true },
      );

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      return announcement;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to mark as viewed: ${message}`,
      );
    }
  }

  /**
   * Lấy thông báo theo loại
   */
  async getAnnouncementsByType(
    type: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: DiscussionDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const announcements = await this.discussionModel
        .find({ type: type.toUpperCase(), status: AnnouncementStatus.PUBLISHED })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await this.discussionModel.countDocuments({
        type: type.toUpperCase(),
        status: AnnouncementStatus.PUBLISHED,
      });

      return {
        data: announcements,
        total,
        page,
        limit,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to get announcements by type: ${message}`,
      );
    }
  }

  /**
   * Search thông báo
   */
  async searchAnnouncements(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: DiscussionDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const announcements = await this.discussionModel
        .find({
          status: AnnouncementStatus.PUBLISHED,
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } },
          ],
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await this.discussionModel.countDocuments({
        status: AnnouncementStatus.PUBLISHED,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      });

      return {
        data: announcements,
        total,
        page,
        limit,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to search announcements: ${message}`,
      );
    }
  }

  /**
   * Lấy thông báo đã ghim
   */
  async getPinnedAnnouncements(): Promise<DiscussionDocument[]> {
    try {
      return await this.discussionModel
        .find({
          isPinned: true,
          status: AnnouncementStatus.PUBLISHED,
        })
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to get pinned announcements: ${message}`,
      );
    }
  }

  /**
   * Upload file (thumbnail hoặc attachment)
   */
  async uploadFile(file: any, type: 'thumbnail' | 'attachment'): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException('File size exceeds 10MB limit');
      }

      // Validate file type
      const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
      ];
      if (
        type === 'thumbnail' &&
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ) {
        throw new BadRequestException(
          'Thumbnail must be an image (JPEG, PNG, WebP)',
        );
      }
      if (type === 'attachment' && !allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException('Attachment must be an image or PDF');
      }

      // TODO: Upload to Cloudflare R2
      const mockUrl = `/uploads/${type}/${Date.now()}-${file.originalname}`;
      return mockUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Failed to upload file: ${message}`);
    }
  }
}
