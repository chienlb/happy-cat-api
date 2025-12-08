import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schema/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    private readonly usersService: UsersService,
  ) { }

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    try {
      const user = await this.usersService.findUserById(
        createFeedbackDto.userId.toString(),
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const feedback = new this.feedbackModel({
        ...createFeedbackDto,
        userId: user._id,
      });
      return await feedback.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create feedback: ' + error.message,
      );
    }
  }

  async findAllFeedbacks(
    page: number,
    limit: number,
  ): Promise<{
    data: Feedback[];
    total: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const feedbacks = await this.feedbackModel
        .find()
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.feedbackModel.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      return {
        data: feedbacks,
        total,
        totalPages,
        nextPage: nextPage ?? page,
        prevPage: prevPage ?? page,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all feedbacks: ' + error.message,
      );
    }
  }

  async findFeedbackById(id: string): Promise<Feedback> {
    try {
      const feedback = await this.feedbackModel.findById(id).exec();
      if (!feedback) {
        throw new NotFoundException('Feedback not found');
      }
      return feedback;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find feedback by id: ' + error.message,
      );
    }
  }

  async updateFeedback(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    try {
      const updatedFeedback = await this.feedbackModel
        .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
        .exec();
      if (!updatedFeedback) {
        throw new NotFoundException('Feedback not found');
      }
      return updatedFeedback;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update feedback: ' + error.message,
      );
    }
  }

  async deleteFeedback(id: string): Promise<Feedback> {
    try {
      const deletedFeedback = await this.feedbackModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedFeedback) {
        throw new NotFoundException('Feedback not found');
      }
      return deletedFeedback;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete feedback: ' + error.message,
      );
    }
  }
}
