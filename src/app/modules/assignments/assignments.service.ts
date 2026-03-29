import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment, AssignmentDocument } from './schema/assignment.schema';
import { Model, Types } from 'mongoose';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UsersService } from '../users/users.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { NotificationJobsService } from '../notification-jobs/notification-jobs.service';
import { Group, GroupDocument } from '../groups/schema/group.schema';
import { LessonProgress, LessonProgressDocument } from '../lesson-progress/schema/lesson-progress.schema';
import { Type } from 'class-transformer';
import { UserRole } from '../users/schema/user.schema';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>, 
    @InjectModel(LessonProgress.name) private lessonProgressModel: Model<LessonProgressDocument>,
    private usersService: UsersService,
    private cloudflareService: CloudflareService,
    private notificationJobsService: NotificationJobsService,
  ) { }

  async create(userId: string, createAssignmentDto: CreateAssignmentDto, file?: any) {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (
      !createAssignmentDto.classId &&
      !createAssignmentDto.lessonId &&
      !createAssignmentDto.dueDate &&
      !createAssignmentDto.maxScore &&
      !createAssignmentDto.type
    ) {
      throw new BadRequestException(
        'Class ID, Lesson ID, Due Date, Max Score and Type are required',
      );
    }

    let attachmentUrl: string | null = null;

    if (file) {
      // Upload file trực tiếp lên Cloudflare R2
      const uploadResult = await this.cloudflareService.uploadFile(
        file,
        'assignments',
      );
      attachmentUrl = uploadResult.fileUrl;
    }
    createAssignmentDto.createdBy = new Types.ObjectId(userId);
    if(createAssignmentDto.classId) {
      createAssignmentDto.classId = new Types.ObjectId(createAssignmentDto.classId);
    }
    if(createAssignmentDto.lessonId) {
      createAssignmentDto.lessonId = new Types.ObjectId(createAssignmentDto.lessonId);
    }
    
    const assignment = new this.assignmentModel({
      ...createAssignmentDto,
      attachments: attachmentUrl ? [attachmentUrl] : [],
      createdBy: userId,
    });

    const saved = await assignment.save();

    const classId = (saved.classId as any)?.toString?.();
    const shouldNotifyAllStudents =
      !classId && Boolean(saved.lessonId) && user.role === UserRole.ADMIN;

    if (classId || shouldNotifyAllStudents) {
      this.notificationJobsService
        .notifyNewAssignment({
          assignmentId: saved._id.toString(),
          classId,
          notifyAllStudents: shouldNotifyAllStudents,
        })
        .catch((e) =>
          this.logger.warn(
            'Failed to enqueue new-assignment notification:',
            (e as Error).message,
          ),
        );
    } else {
      this.logger.warn(
        `Skip new-assignment notification because no classId/lesson target for assignment ${saved._id.toString()}`,
      );
    }

    return saved;
  }

  async updateAssignment(id: string, userId: string, updateAssignmentDto: UpdateAssignmentDto) {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      const assignment = await this.assignmentModel.findById(id);
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      await assignment.updateOne({
        ...updateAssignmentDto,
        ...(updateAssignmentDto.updatedBy && { updatedBy: userId }),
      });
      return assignment;
    } catch (error) {
      throw new BadRequestException('Failed to update assignment', error);
    }
  }

  async deleteAssignment(id: string, userId: string) {
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      const assignment = await this.assignmentModel.findById(id);
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      await assignment.updateOne({ isDeleted: true, updatedBy: userId });
      return assignment;
    } catch (error) {
      throw new BadRequestException('Failed to delete assignment', error);
    }
  }

  async getAssignmentById(id: string) {
    try {
      const assignment = await this.assignmentModel.findOne({_id: id});
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      return assignment;
    } catch (error) {
      throw new BadRequestException('Failed to get assignment', error);
    }
  }

  async getAssignmentsByClassId(
    classId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const assignments = await this.assignmentModel
        .find({ classId, isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 });
      if (!assignments) {
        throw new NotFoundException('Assignments not found');
      }
      const total = await this.assignmentModel.countDocuments({
        classId,
      });
      return { assignments, total, page, limit, sort, order };
    } catch (error) {
      throw new BadRequestException('Failed to get assignments', error);
    }
  }

  async getAssignmentsByLessonId(
    lessonId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const assignments = await this.assignmentModel
        .find({ lessonId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 });
      if (!assignments) {
        throw new NotFoundException('Assignments not found');
      }
      const total = await this.assignmentModel.countDocuments({
        lessonId,
      });
      return { assignments, total, page, limit, sort, order };
    } catch (error) {
      throw new BadRequestException('Failed to get assignments', error);
    }
  }

  async getAssignmentsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const assignments = await this.assignmentModel
        .find({
          createdBy: userId,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 });
      if (!assignments) {
        throw new NotFoundException('Assignments not found');
      }
      const total = await this.assignmentModel.countDocuments({
        createdBy: userId,
      });
      return { assignments, total, page, limit, sort, order };
    } catch (error) {
      throw new BadRequestException('Failed to get assignments', error);
    }
  }

  async getAllAssignments(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const assignments = await this.assignmentModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === 'asc' ? 1 : -1 });
      if (!assignments) {
        throw new NotFoundException('Assignments not found');
      }
      const total = await this.assignmentModel.countDocuments();
      return { assignments, total, page, limit, sort, order };
    } catch (error) {
      throw new BadRequestException('Failed to get assignments', error);
    }
  }

  async getAllAssignmentsByUserId(userId: string) {
  try {
    // 1. Lấy group của user
    const groups = await this.groupModel.find({ members: { $in: [userId] } }).lean();
    const groupIds = groups.map((group) => group._id);

    // 2. Lấy assignment của group
    const groupAssignments = await this.assignmentModel
      .find({
        classId: { $in: groupIds },
      })
      .lean();

    // 3. Lấy progress lesson của user
    const lessonProgress = await this.lessonProgressModel
      .find({ userId })
      .lean();

    const lessonIds = lessonProgress.map((lp) => lp.lessonId);

    // 4. Lấy assignment của lesson
    const lessonAssignments = await this.assignmentModel
      .find({
        lessonId: { $in: lessonIds },
      })
      .lean();

    // 5. Map progress theo lessonId
    const lessonProgressMap = new Map(
      lessonProgress.map((lp) => [lp.lessonId.toString(), lp.progress]),
    );

    // 6. Gộp 2 danh sách và loại trùng
    const mergedAssignmentsMap = new Map();

    [...groupAssignments, ...lessonAssignments].forEach((assignment) => {
      mergedAssignmentsMap.set(assignment._id.toString(), {
        ...assignment,
        progress: assignment.lessonId
          ? lessonProgressMap.get(assignment.lessonId.toString()) || 0
          : 0,
      });
    });

    return {
      assignments: Array.from(mergedAssignmentsMap.values()),
    };
  } catch (error) {
    throw new BadRequestException(
      error?.message || 'Failed to get assignments',
    );
  }
}
}
