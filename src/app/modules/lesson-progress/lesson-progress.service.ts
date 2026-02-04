import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LessonProgress,
  LessonProgressDocument,
} from './schema/lesson-progress.schema';
import { Model } from 'mongoose';
import { LessonsService } from '../lessons/lessons.service';
import { UsersService } from '../users/users.service';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { LessonDocument } from '../lessons/schema/lesson.schema';
import { UnitsService } from '../units/units.service';
import { Types } from 'mongoose';
import { BadgesService } from '../badges/badges.service';
import { UserBadgesService } from '../user-badges/user-badges.service';
import { UserDocument } from '../users/schema/user.schema';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectModel(LessonProgress.name)
    private lessonProgressModel: Model<LessonProgressDocument>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LessonsService))
    private readonly lessonsService: LessonsService,
    private readonly unitsService: UnitsService,
    private readonly badgesService: BadgesService,
    private readonly userBadgesService: UserBadgesService,
  ) {}

  async createLessonPrgress(
    createLessonProgressDto: CreateLessonProgressDto,
  ): Promise<LessonProgressDocument> {
    try {
      const user = await this.usersService.findUserById(
        createLessonProgressDto.userId.toString(),
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const lesson = await this.lessonsService.findLessonById(
        createLessonProgressDto.lessonId.toString(),
      );
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      user.exp = user.exp
        ? user.exp + createLessonProgressDto.progress * 10
        : createLessonProgressDto.progress * 10;
      user.streakDays = user.streakDays ? user.streakDays + 1 : 1;
      user.totalLessonsCompleted = user.totalLessonsCompleted ? user.totalLessonsCompleted + 1 : 1;
      await user.save();
      
      // Check and award badges based on user achievements
      await this.checkAndAwardBadges(user);
      
      const lessonProgress = new this.lessonProgressModel(
        createLessonProgressDto,
      );
      return lessonProgress.save();
    } catch (error) {
      throw new Error('Failed to create lesson progress: ' + error.message);
    }
  }

  async findLessonPrgressByUserId(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    data: LessonProgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    try {
      const user = await this.usersService.findUserById(userId.toString());
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const lessonProgress = await this.lessonProgressModel
        .find({ userId: user._id })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.lessonProgressModel.countDocuments({
        userId: user._id,
      });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const currentPage = Math.max(1, Math.min(paginationDto.page, totalPages));
      return {
        data: lessonProgress,
        total: total,
        totalPages: totalPages,
        currentPage: currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        limit: paginationDto.limit,
      };
    } catch (error) {
      throw new Error(
        'Failed to find lesson progress by user id: ' + error.message,
      );
    }
  }

  async findLessonPrgressByLessonId(
    lessonId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    data: LessonProgressDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  }> {
    try {
      const lesson = await this.lessonsService.findLessonById(
        lessonId.toString(),
      );
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      const lessonProgress = await this.lessonProgressModel
        .find({ lessonId: lesson._id })
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .sort({ [paginationDto.sort]: paginationDto.order === 'asc' ? 1 : -1 });
      const total = await this.lessonProgressModel.countDocuments({
        lessonId: lesson._id,
      });
      const totalPages = Math.ceil(total / paginationDto.limit);
      const currentPage = Math.max(1, Math.min(paginationDto.page, totalPages));
      return {
        data: lessonProgress,
        total: total,
        totalPages: totalPages,
        currentPage: currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        limit: paginationDto.limit,
      };
    } catch (error) {
      throw new Error(
        'Failed to find lesson progress by lesson id: ' + error.message,
      );
    }
  }

  async updateLessonPrgress(
    lessonId: string,
    updateLessonPrgressDto: UpdateLessonProgressDto,
  ): Promise<LessonProgressDocument> {
    try {
      const lesson = await this.lessonsService.findLessonById(
        lessonId.toString(),
      );
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      const lessonProgress = await this.lessonProgressModel.findByIdAndUpdate(
        lesson._id,
        updateLessonPrgressDto,
        { new: true },
      );
      if (!lessonProgress) {
        throw new NotFoundException('Lesson progress not found');
      }
      return lessonProgress;
    } catch (error) {
      throw new Error('Failed to update lesson progress: ' + error.message);
    }
  }

  async deleteLessonProgress(lessonId: string): Promise<void> {
    try {
      const lesson = await this.lessonsService.findLessonById(
        lessonId.toString(),
      );
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      await this.lessonProgressModel.findByIdAndDelete(lesson._id);
    } catch (error) {
      throw new Error('Failed to delete lesson progress: ' + error.message);
    }
  }

  async getLessonByUserId(
    userId: string,
    unitId: string,
    orderIndex: number,
  ): Promise<LessonProgressDocument> {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const unit = await this.unitsService.findUnitById(unitId);
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }
      const lessonProgress = await this.lessonProgressModel.findOne({
        userId: new Types.ObjectId(userId),
        unitId: new Types.ObjectId(unitId),
        orderIndex: orderIndex,
      });
      if (!lessonProgress) {
        throw new NotFoundException('Lesson progress not found');
      }
      return lessonProgress;
    } catch (error) {
      throw new Error('Failed to get lesson by user id: ' + error.message);
    }
  }

  /**
   * Check user achievements and automatically award badges
   * @param user - The user document to check badges for
   */
  private async checkAndAwardBadges(user: UserDocument): Promise<void> {
    try {
      // Lấy tất cả badges đang active từ database
      const allBadges = await this.badgesService.findAllBadges(1, 1000);
      
      for (const badge of allBadges.badges) {
        if (!badge.isActive) continue;

        // Check if user already has this badge
        const existingUserBadge = await this.userBadgesService
          .findUserBadgesByUserId(user._id.toString(), {
            page: 1,
            limit: 1000,
            sort: 'createdAt',
            order: 'desc',
          });

        const alreadyHasBadge = existingUserBadge.userBadges.some(
          (ub) => ub.badgeId.toString() === badge._id.toString(),
        );

        if (alreadyHasBadge) continue;

        // Check badge conditions based on triggerEvent
        let shouldAward = false;
        let reason = '';

        switch (badge.triggerEvent) {
          case 'complete_lesson':
            if ((user.totalLessonsCompleted ?? 0) >= (badge.requiredValue || 1)) {
              shouldAward = true;
              reason = `Hoàn thành ${user.totalLessonsCompleted ?? 0} bài học`;
            }
            break;

          case 'login_streak':
            if ((user.streakDays ?? 0) >= (badge.requiredValue || 1)) {
              shouldAward = true;
              reason = `Duy trì học ${user.streakDays ?? 0} ngày liên tiếp`;
            }
            break;

          case 'reach_exp':
            if ((user.exp ?? 0) >= (badge.requiredValue || 0)) {
              shouldAward = true;
              reason = `Đạt ${user.exp ?? 0} điểm kinh nghiệm`;
            }
            break;

          case 'reach_level':
            if ((user.progressLevel ?? 0) >= (badge.requiredValue || 0)) {
              shouldAward = true;
              reason = `Đạt cấp độ ${user.progressLevel ?? 0}`;
            }
            break;

          default:
            // Custom logic or manual award only
            break;
        }

        // Award the badge if conditions are met
        if (shouldAward) {
          await this.userBadgesService.createUserBadge({
            userId: user._id.toString(),
            badgeId: badge._id.toString(),
            awardedAt: new Date(),
            reason: reason,
          });

          // Optionally award bonus XP for getting badge
          user.exp = (user.exp || 0) + 100;
          await user.save();

          console.log(`Badge "${badge.name}" awarded to user ${user.username}`);
        }
      }
    } catch (error) {
      console.error('Error checking and awarding badges:', error.message);
      // Don't throw error to prevent lesson progress creation from failing
    }
  }
}
