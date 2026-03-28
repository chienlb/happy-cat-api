import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import {
  Submission,
  SubmissionDocument,
  SubmissionStatus,
} from './schema/submission.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AssignmentsService } from '../assignments/assignments.service';
import { UsersService } from '../users/users.service';
import { RedisService } from 'src/app/configs/redis/redis.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import {
  ProgressStatus,
  ProgressType,
} from '../progresses/schema/progress.schema';
import { ProgressesService } from '../progresses/progresses.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private assignmentsService: AssignmentsService,
    private usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly cloudflareService: CloudflareService,
    private readonly progressesService: ProgressesService,
  ) {}

  async createSubmission(
    createSubmissionDto: CreateSubmissionDto,
    files?: any[],
  ): Promise<SubmissionDocument> {
    try {
      const assignment = await this.assignmentsService.getAssignmentById(
        createSubmissionDto.assignmentId.toString(),
      );
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      const student = await this.usersService.findUserById(
        createSubmissionDto.studentId.toString(),
      );
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (
        assignment.dueDate &&
        createSubmissionDto.submittedAt &&
        new Date(createSubmissionDto.submittedAt) > new Date(assignment.dueDate)
      ) {
        throw new BadRequestException('Submission date is after the due date');
      }
      // Upload files to Cloudflare R2 if provided
      let attachments = createSubmissionDto.attachments || [];
      if (files && files.length > 0) {
        const uploadedFiles = await Promise.all(
          files.map((file) =>
            this.cloudflareService.uploadFile(file, 'submissions'),
          ),
        );
        const fileUrls = uploadedFiles.map((uploaded) => uploaded.fileUrl);
        attachments = [...attachments, ...fileUrls];
      }

      const submission = new this.submissionModel({
        ...createSubmissionDto,
        assignmentId: assignment._id,
        studentId: student._id,
        attachments: attachments,
        status: SubmissionStatus.SUBMITTED,
      });
      const savedSubmission = await submission.save();

      // Update daily activity streak for submission action.
      this.usersService.updateActivityStreak(student);
      await student.save();

      await this.syncAssignmentProgress({
        userId: student._id.toString(),
        assignmentId: assignment._id.toString(),
        score: savedSubmission.score,
      });

      return savedSubmission;
    } catch (error) {
      throw new Error('Failed to create submission: ' + error.message);
    }
  }

  async getGradedSubmissionsByAssignmentId(
    assignmentId: string,
  ): Promise<SubmissionDocument[]> {
    try {
      const submissions = await this.submissionModel.find({
        assignmentId,
        status: SubmissionStatus.GRADED,
      });
      if (!submissions) {
        throw new NotFoundException('Graded submissions not found');
      }
      const result = {
        data: submissions,
      };
      return result.data;
    } catch (error) {
      throw new Error('Failed to get graded submissions: ' + error.message);
    }
  }

  async getSubmissionById(id: string): Promise<SubmissionDocument> {
    try {
      const cacheKey = `submission:id=${id}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const submission = await this.submissionModel.findById(id);
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      const result = {
        data: submission,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      throw new Error('Failed to get submission: ' + error.message);
    }
  }

  async getSubmissionsByAssignmentId(
    assignmentId: string,
  ): Promise<SubmissionDocument[]> {
    try {
      const cacheKey = `submissions:assignment-id=${assignmentId}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const submissions = await this.submissionModel.find({ assignmentId });
      if (!submissions) {
        throw new NotFoundException('Submissions not found');
      }
      const result = {
        data: submissions,
      };
      await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);
      return result.data;
    } catch (error) {
      throw new Error('Failed to get submissions: ' + error.message);
    }
  }

  async getSubmissionsByStudentId(
    studentId: string,
  ): Promise<SubmissionDocument[]> {
    try {
      const submissions = await this.submissionModel.find({ studentId }).populate('assignmentId', 'title').populate('userId', 'fullname');
      if (!submissions) {
        throw new NotFoundException('Submissions not found');
      }
      const result = {
        data: submissions,
      };
      return result.data;
    } catch (error) {
      throw new Error('Failed to get submissions: ' + error.message);
    }
  }

  async updateSubmission(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<SubmissionDocument> {
    try {
      const submission = await this.submissionModel.findByIdAndUpdate(
        id,
        updateSubmissionDto,
        { new: true },
      );
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      return submission;
    } catch (error) {
      throw new Error('Failed to update submission: ' + error.message);
    }
  }

  async deleteSubmission(id: string): Promise<void> {
    try {
      const submission = await this.submissionModel.findByIdAndDelete(id);
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
    } catch (error) {
      throw new Error('Failed to delete submission: ' + error.message);
    }
  }

  async teacherGradeSubmission(
    id: string,
    teacherId: string,
    score: number,
    feedback: string,
  ): Promise<SubmissionDocument> {
    try {
      const submission = await this.submissionModel.findByIdAndUpdate(
        id,
        {
          status: SubmissionStatus.GRADED,
          gradedBy: teacherId,
          score,
          feedback,
        },
        { new: true },
      );
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      await this.syncAssignmentProgress({
        userId: submission.studentId.toString(),
        assignmentId: submission.assignmentId.toString(),
        score,
      });

      return submission;
    } catch (error) {
      throw new Error('Failed to grade submission: ' + error.message);
    }
  }

  async studentViewSubmission(
    id: string,
    studentId: string,
  ): Promise<SubmissionDocument> {
    try {
      const submission = await this.submissionModel.findById(id);
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      if (submission.studentId.toString() !== studentId) {
        throw new ForbiddenException(
          'You are not allowed to view this submission',
        );
      }
      return submission;
    } catch (error) {
      throw new Error('Failed to view submission: ' + error.message);
    }
  }

  private async syncAssignmentProgress(input: {
    userId: string;
    assignmentId: string;
    score?: number;
  }): Promise<void> {
    const progressPayload = {
      userId: input.userId,
      assignmentId: input.assignmentId,
      type: ProgressType.ASSIGNMENT,
      progressPercent: 100,
      timeSpent: 0,
      score: input.score,
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    };

    try {
      await this.progressesService.createProgress(progressPayload);
    } catch {
      await this.progressesService.updateProgress(progressPayload);
    }
  }

  async getAllSubmissionsByAssignmentId(assignmentId: string): Promise<SubmissionDocument[]> {
    try {
      const submissions = await this.submissionModel.find({ assignmentId: new mongoose.Types.ObjectId(assignmentId) }).populate('studentId', 'fullname email');
      return submissions;
    } catch (error) {
      throw new Error('Failed to get submissions: ' + error.message);
    }
  }
}
