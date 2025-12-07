import { Controller, Param } from '@nestjs/common';
import { SupportsService } from './supports.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { Body, Get, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupportStatus } from './schema/support.schema';
import { UpdateSupportDto } from './dto/update-support.dto';

@ApiTags('Supports')
@Controller('supports')
export class SupportsController {
  constructor(private readonly supportsService: SupportsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new support' })
  @ApiBody({ type: CreateSupportDto, description: 'The support to create', examples: { example1: { value: { userId: '1234567890', subject: 'Support subject', message: 'Support message', attachments: ['attachment1', 'attachment2'] } } } })
  @ApiResponse({ status: 201, description: 'Support created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  createSupport(@Body() createSupportDto: CreateSupportDto) {
    return this.supportsService.createSupport(createSupportDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a support by id' })
  @ApiParam({ name: 'id', description: 'The id of the support' })
  @ApiResponse({ status: 200, description: 'Support found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getSupportById(@Param('id') id: string) {
    return this.supportsService.getSupportById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supports' })
  @ApiResponse({ status: 200, description: 'Supports found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getSupports() {
    return this.supportsService.getSupports();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all supports by user id' })
  @ApiParam({ name: 'userId', description: 'The id of the user' })
  @ApiResponse({ status: 200, description: 'Supports found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getSupportsByUserId(@Param('userId') userId: string) {
    return this.supportsService.getSupportsByUserId(userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get all supports by status' })
  @ApiParam({ name: 'status', description: 'The status of the supports' })
  @ApiResponse({ status: 200, description: 'Supports found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getSupportsByStatus(@Param('status') status: SupportStatus) {
    return this.supportsService.getSupportsByStatus(status);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a support by id' })
  @ApiParam({ name: 'id', description: 'The id of the support' })
  @ApiBody({ type: UpdateSupportDto })
  @ApiResponse({ status: 200, description: 'Support updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  updateSupport(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportsService.updateSupport(id, updateSupportDto);
  }
}