import {
  Controller,
  Post,
  Put,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { Assignment } from './schema/assignment.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { UserRole } from '../users/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/app/common/decorators/role.decorator';

@Controller('assignments')
@ApiTags('Assignments')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.ADMIN, UserRole.TEACHER)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create an assignment (upload file included)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Assignment 1' },
        description: {
          type: 'string',
          example: 'Description of assignment',
        },
        type: { type: 'string', example: 'reading' },
        lessonId: {
          type: 'string',
          example: '669999999999999999999999',
        },
        classId: {
          type: 'string',
          example: '669999999999999999999999',
        },
        dueDate: { type: 'string', example: '2025-12-31' },
        maxScore: { type: 'number', example: 100 },
        isPublished: { type: 'boolean', example: true },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: Assignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file: any,
    @Req() req: Request,
  ) {
    return this.assignmentsService.create((req as any).user.userId, createAssignmentDto, file);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Assignment 1' },
      },
    },
  })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: 'Assignment updated successfully',
    type: Assignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Req() req: Request,
  ) {
    return this.assignmentsService.updateAssignment(id, (req as any).user.userId, updateAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({
    status: 200,
    description: 'Assignment deleted successfully',
    type: Assignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async delete(@Param('id') id: string, @Req() req: Request) {
    return this.assignmentsService.deleteAssignment(id, (req as any).user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment retrieved successfully',
    type: Assignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getById(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentById(id);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get assignments by class ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: [Assignment],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getByClassId(
    @Param('classId') classId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.assignmentsService.getAssignmentsByClassId(
      classId,
      page,
      limit,
      sort,
      order,
    );
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get assignments by lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: [Assignment],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getByLessonId(
    @Param('lessonId') lessonId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.assignmentsService.getAssignmentsByLessonId(
      lessonId,
      page,
      limit,
      sort,
      order,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get assignments by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: [Assignment],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.assignmentsService.getAssignmentsByUserId(
      userId,
      page,
      limit,
      sort,
      order,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
    type: [Assignment],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.assignmentsService.getAllAssignments(page, limit, sort, order);
  }
}
