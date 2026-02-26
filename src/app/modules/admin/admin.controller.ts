import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
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
}
