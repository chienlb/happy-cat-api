import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AdminService } from './admin.service';
import { ExportFilterDto, ExportType } from './dto/export-admin.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/schema/user.schema';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardData() {
    return this.adminService.getDashboardData();
  }

  @Get('revenue')
  getRevenueData() {
    return this.adminService.getRevenueData();
  }

  @Get('user-activity')
  getUserActivity() {
    return this.adminService.getUserActivity();
  }

  @Get('unit-statistics')
  getUnitStatistics() {
    return this.adminService.getUnitStatistics();
  }

  @Get('group-statistics')
  getGroupStatistics() {
    return this.adminService.getGroupStatistics();
  }

  @Get('recent-payments')
  getRecentPayments() {
    return this.adminService.getRecentPayments();
  }

  @Get('recent-users')
  getRecentUsers() {
    return this.adminService.getRecentUsers();
  }

  @Get('revenue-by-month')
  getRevenueByMonth() {
    return this.adminService.getRevenueByMonth();
  }

  @Get('user-by-month')
  getUserByMonth() {
    return this.adminService.getUserByMonth();
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Export admin reports to Excel',
    description: 'Export various admin reports (users, payments, revenue, statistics) to Excel file with optional filters'
  })
  @ApiQuery({ 
    name: 'type', 
    enum: ExportType, 
    required: true,
    description: 'Type of report to export'
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    type: String,
    description: 'Filter start date (YYYY-MM-DD)',
    example: '2026-01-01'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    type: String,
    description: 'Filter end date (YYYY-MM-DD)',
    example: '2026-02-26'
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ['active', 'inactive', 'pending', 'blocked', 'deleted'],
    description: 'Filter by user status (for USERS export)'
  })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    enum: ['admin', 'teacher', 'student', 'parent'],
    description: 'Filter by user role (for USERS export)'
  })
  @ApiQuery({ 
    name: 'paymentMethod', 
    required: false, 
    enum: ['paypal', 'vnpay', 'momo', 'stripe'],
    description: 'Filter by payment method (for PAYMENTS export)'
  })
  @ApiQuery({ 
    name: 'paymentStatus', 
    required: false, 
    enum: ['pending', 'success', 'failed', 'refunded'],
    description: 'Filter by payment status (for PAYMENTS export)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Excel file generated successfully',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid filters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportToExcel(
    @Query() filters: ExportFilterDto,
    @Res() response: Response,
  ) {
    try {
      const buffer = await this.adminService.exportToExcel(filters);
      
      // Generate filename with type and date
      const date = new Date().toISOString().split('T')[0];
      const filename = `admin-report-${filters.type.toLowerCase()}-${date}.xlsx`;
      
      // Set response headers
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
      
      return response.send(buffer);
    } catch (error) {
      response.status(500).json({
        statusCode: 500,
        message: error.message || 'Error exporting to Excel',
        error: 'Internal Server Error'
      });
    }
  }
}
