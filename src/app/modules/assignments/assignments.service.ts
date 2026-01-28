import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment, AssignmentDocument } from './schema/assignment.schema';
import { Model } from 'mongoose';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UsersService } from '../users/users.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { NotificationJobsService } from '../notification-jobs/notification-jobs.service';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
    private usersService: UsersService,
    private cloudflareService: CloudflareService,
    private notificationJobsService: NotificationJobsService,
  ) { }

  async create(createAssignmentDto: CreateAssignmentDto, file?: any) {
    const user = await this.usersService.findUserById(
      createAssignmentDto.createdBy,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      !createAssignmentDto.classId ||
      !createAssignmentDto.lessonId ||
      !createAssignmentDto.dueDate ||
      !createAssignmentDto.maxScore ||
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
    const assignment = new this.assignmentModel({
      ...createAssignmentDto,
      attachments: attachmentUrl ? [attachmentUrl] : [],
      createdBy: user._id,
    });

    const saved = await assignment.save();

    this.notificationJobsService
      .notifyNewAssignment(
        saved._id.toString(),
        (saved.classId as any)?.toString?.() ?? String(createAssignmentDto.classId),
      )
      .catch((e) => this.logger.warn('Failed to enqueue new-assignment notification:', (e as Error).message));

    return saved;
  }

  async updateAssignment(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    try {
      const user = await this.usersService.findUserById(
        updateAssignmentDto.updatedBy || '',
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const assignment = await this.assignmentModel.findById(id);
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      await assignment.updateOne({
        ...updateAssignmentDto,
        ...(updateAssignmentDto.updatedBy && { updatedBy: user._id }),
      });
      return assignment;
    } catch (error) {
      throw new BadRequestException('Failed to update assignment', error);
    }
  }

  async deleteAssignment(id: string, updatedBy: string) {
    try {
      const user = await this.usersService.findUserById(updatedBy || '');
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const assignment = await this.assignmentModel.findById(id);
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      await assignment.updateOne({ isDeleted: true, updatedBy: user._id });
      return assignment;
    } catch (error) {
      throw new BadRequestException('Failed to delete assignment', error);
    }
  }

  async getAssignmentById(id: string) {
    try {
      const assignment = await this.assignmentModel.findOne({
        _id: id,
        isDeleted: false,
      });
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
}
