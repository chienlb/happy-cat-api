import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDocument, NotificationType } from './schema/notification.schema';

@Controller('notifications')
@ApiTags('Notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new notification' })
    @ApiBody({ type: CreateNotificationDto, description: 'Create notification data', examples: { 'example': { value: { userId: '123', senderId: '123', title: 'Test', message: 'Test', type: NotificationType.SYSTEM, data: { test: 'test' }, firebaseToken: 'test', isRead: false, readAt: new Date() } } } })
    @ApiResponse({ status: 201, description: 'Notification created successfully', schema: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, senderId: { type: 'string' }, title: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' }, firebaseToken: { type: 'string' }, isRead: { type: 'boolean' }, readAt: { type: 'string' } } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationDocument> {
        return await this.notificationsService.createNotification(createNotificationDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a notification by id' })
    @ApiParam({ name: 'id', type: String, description: 'Notification id' })
    @ApiResponse({ status: 200, description: 'Notification fetched successfully', schema: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, senderId: { type: 'string' }, title: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' }, firebaseToken: { type: 'string' }, isRead: { type: 'boolean' }, readAt: { type: 'string' } } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getNotificationById(@Param('id') id: string): Promise<NotificationDocument> {
        return await this.notificationsService.findNotificationById(id);
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all notifications' })
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit number' })
    @ApiResponse({ status: 200, description: 'Notifications fetched successfully', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, senderId: { type: 'string' }, title: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' }, firebaseToken: { type: 'string' }, isRead: { type: 'boolean' }, readAt: { type: 'string' } } } }, total: { type: 'number' }, totalPages: { type: 'number' }, nextPage: { type: 'number' }, prevPage: { type: 'number' }, limit: { type: 'number' } } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAllNotifications(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<{ data: NotificationDocument[]; total: number; totalPages: number; nextPage: number | null; prevPage: number | null; limit: number }> {
        return await this.notificationsService.findAllNotifications(page, limit);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a notification' })
    @ApiParam({ name: 'id', type: String, description: 'Notification id' })
    @ApiBody({ type: UpdateNotificationDto, description: 'Update notification data', examples: { 'example': { value: { userId: '123', senderId: '123', title: 'Test', message: 'Test', type: NotificationType.SYSTEM, data: { test: 'test' }, firebaseToken: 'test', isRead: false, readAt: new Date() } } } })
    @ApiResponse({ status: 200, description: 'Notification updated successfully', schema: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, senderId: { type: 'string' }, title: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' }, firebaseToken: { type: 'string' }, isRead: { type: 'boolean' }, readAt: { type: 'string' } } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto): Promise<NotificationDocument> {
        return await this.notificationsService.updateNotification(id, updateNotificationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a notification' })
    @ApiParam({ name: 'id', type: String, description: 'Notification id' })
    @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async deleteNotification(@Param('id') id: string): Promise<NotificationDocument> {
        return await this.notificationsService.deleteNotification(id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get notifications by user id' })
    @ApiParam({ name: 'userId', type: String, description: 'User id' })
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit number' })
    @ApiResponse({ status: 200, description: 'Notifications fetched successfully', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, userId: { type: 'string' }, senderId: { type: 'string' }, title: { type: 'string' }, message: { type: 'string' }, type: { type: 'string' }, data: { type: 'object' }, firebaseToken: { type: 'string' }, isRead: { type: 'boolean' }, readAt: { type: 'string' } } } }, total: { type: 'number' }, totalPages: { type: 'number' }, nextPage: { type: 'number' }, prevPage: { type: 'number' }, limit: { type: 'number' } } } })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getNotificationsByUserId(@Param('userId') userId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<{ data: NotificationDocument[]; total: number; totalPages: number; nextPage: number | null; prevPage: number | null; limit: number }> {
        return await this.notificationsService.findNotificationsByUserId(userId, page, limit);
    }
}