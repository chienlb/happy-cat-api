import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MessageType } from './schema/group-message.schema';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';
import { PaginationDto } from '../pagination/pagination.dto';

@ApiTags('Group Messages')
@ApiBearerAuth()
@Controller('group-messages')
export class GroupMessagesController {
  constructor(private readonly groupMessagesService: GroupMessagesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new group message' })
  @ApiBody({
    type: CreateGroupMessageDto,
    description: 'The group message to create',
    examples: {
      normal: {
        summary: 'Example of a normal group message',
        value: {
          groupId: '1234567890',
          senderId: '1234567890',
          content: 'Hello, how are you?',
          type: MessageType.TEXT,
          attachments: ['1234567890'],
          mentions: ['1234567890'],
          replyTo: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Group message created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createGroupMessageDto: CreateGroupMessageDto) {
    return this.groupMessagesService.createMessage(createGroupMessageDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group message by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({ status: 200, description: 'Group message found successfully' })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findById(@Param('id') id: string) {
    return this.groupMessagesService.findMessageById(id);
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Get all group messages by group id' })
  @ApiParam({
    name: 'groupId',
    description: 'The id of the group',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group messages found successfully',
  })
  @ApiResponse({ status: 404, description: 'Group messages not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findByGroupId(
    @Param('groupId') groupId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.groupMessagesService.findMessagesByGroupId(
      groupId,
      paginationDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a group message by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiBody({
    type: UpdateGroupMessageDto,
    description: 'The group message to update',
    examples: {
      normal: {
        summary: 'Example of a normal group message',
        value: {
          content: 'Hello, how are you?',
          type: MessageType.TEXT,
          attachments: ['1234567890'],
          mentions: ['1234567890'],
          replyTo: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Group message updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  update(
    @Param('id') id: string,
    @Body() updateGroupMessageDto: UpdateGroupMessageDto,
  ) {
    return this.groupMessagesService.editMessage(id, updateGroupMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group message by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  delete(@Param('id') id: string) {
    return this.groupMessagesService.deleteMessage(id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a group message as read by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group message marked as read successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  markAsRead(@Param('id') id: string) {
    return this.groupMessagesService.markMessageAsRead(id);
  }

  @Post(':id/unread')
  @ApiOperation({ summary: 'Mark a group message as unread by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group message marked as unread successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  markAsUnreadByMessageId(@Param('id') id: string) {
    return this.groupMessagesService.markMessageAsUnread(id);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: 'Reply to a group message by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiBody({
    type: CreateGroupMessageDto,
    description: 'The group message to reply to',
    examples: {
      normal: {
        summary: 'Example of a normal group message',
        value: {
          groupId: '1234567890',
          senderId: '1234567890',
          content: 'Hello, how are you?',
          type: MessageType.TEXT,
          attachments: ['1234567890'],
          mentions: ['1234567890'],
          replyTo: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Group message replied successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  replyToMessage(
    @Param('id') id: string,
    @Body() createGroupMessageDto: CreateGroupMessageDto,
  ) {
    return this.groupMessagesService.replyToMessage(id, createGroupMessageDto);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get all replies to a group message by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group message replies found successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getRepliesByMessageId(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.groupMessagesService.getMessageReplies(id, paginationDto);
  }

  @Get(':id/replies-count')
  @ApiOperation({
    summary: 'Get the count of replies to a group message by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the group message',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group message replies count found successfully',
  })
  @ApiResponse({ status: 404, description: 'Group message not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getRepliesCountByMessageId(@Param('id') id: string) {
    return this.groupMessagesService.getMessageRepliesCount(id);
  }

  @Get(':groupId/count')
  @ApiOperation({ summary: 'Get the count of group messages by group id' })
  @ApiParam({
    name: 'groupId',
    description: 'The id of the group',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Group messages count found successfully',
  })
  @ApiResponse({ status: 404, description: 'Group messages not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getGroupCountByGroupId(@Param('groupId') groupId: string) {
    return this.groupMessagesService.getMessageGroupCount(groupId);
  }
}
