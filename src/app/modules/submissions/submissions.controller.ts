import { Controller, Delete, Param } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Body, Post, Get, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { SubmissionDocument } from './schema/submission.schema';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a submission with file upload' })
  @ApiBody({
    type: CreateSubmissionDto,
    description: 'The submission data',
    examples: {
      normal: {
        summary: 'Example of a normal submission',
        value: {
          assignmentId: '1234567890',
          studentId: '1234567890',
          studentAnswers: {
            question1: 'Answer 1',
            question2: 'Answer 2',
          },
          submittedAt: '2021-01-01',
          score: 10,
          feedback: 'Good job!',
          attachments: ['attachment1', 'attachment2'],
          status: 'submitted',
          gradedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The submission has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFiles() files?: any[],
  ): Promise<SubmissionDocument> {
    return this.submissionsService.createSubmission(createSubmissionDto, files);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a submission by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the submission',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The submission has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSubmissionById(
    @Param('id') id: string,
  ): Promise<SubmissionDocument> {
    return this.submissionsService.getSubmissionById(id);
  }

  @Get('assignment/:assignmentId')
  @ApiOperation({ summary: 'Get submissions by assignment id' })
  @ApiParam({
    name: 'assignmentId',
    description: 'The id of the assignment',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The submissions have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSubmissionsByAssignmentId(
    @Param('assignmentId') assignmentId: string,
  ): Promise<SubmissionDocument[]> {
    return this.submissionsService.getSubmissionsByAssignmentId(assignmentId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get submissions by student id' })
  @ApiParam({
    name: 'studentId',
    description: 'The id of the student',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The submissions have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSubmissionsByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<SubmissionDocument[]> {
    return this.submissionsService.getSubmissionsByStudentId(studentId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a submission' })
  @ApiParam({
    name: 'id',
    description: 'The id of the submission',
    example: '1234567890',
  })
  @ApiBody({
    type: UpdateSubmissionDto,
    description: 'The submission data',
    examples: {
      normal: {
        summary: 'Example of a normal submission',
        value: {
          studentAnswers: {
            question1: 'Answer 1',
            question2: 'Answer 2',
          },
          submittedAt: '2021-01-01',
          score: 10,
          feedback: 'Good job!',
          attachments: ['attachment1', 'attachment2'],
          status: 'submitted',
          gradedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The submission has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateSubmission(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<SubmissionDocument> {
    return this.submissionsService.updateSubmission(id, updateSubmissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiParam({
    name: 'id',
    description: 'The id of the submission',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The submission has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteSubmission(@Param('id') id: string): Promise<void> {
    return this.submissionsService.deleteSubmission(id);
  }

  @Put(':id/grade')
  @ApiOperation({ summary: 'Grade a submission' })
  @ApiParam({
    name: 'id',
    description: 'The id of the submission',
    example: '1234567890',
  })
  @ApiBody({
    type: CreateSubmissionDto,
    description: 'The submission data',
    examples: {
      normal: {
        summary: 'Example of a normal submission',
        value: {
          studentAnswers: {
            question1: 'Answer 1',
            question2: 'Answer 2',
          },
          submittedAt: '2021-01-01',
          score: 10,
          feedback: 'Good job!',
          attachments: ['attachment1', 'attachment2'],
          status: 'submitted',
          gradedBy: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The submission has been successfully graded.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async gradeSubmission(
    @Param('id') id: string,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<SubmissionDocument> {
    return this.submissionsService.teacherGradeSubmission(
      id,
      createSubmissionDto.gradedBy?.toString() ?? '',
      createSubmissionDto.score ?? 0,
      createSubmissionDto.feedback ?? '',
    );
  }

  @Get(':id/student')
  @ApiOperation({ summary: 'Get a submission by id and student id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the submission',
    example: '1234567890',
  })
  @ApiParam({
    name: 'studentId',
    description: 'The id of the student',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The submission has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSubmissionByIdAndStudentId(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ): Promise<SubmissionDocument> {
    return this.submissionsService.studentViewSubmission(id, studentId);
  }
}
