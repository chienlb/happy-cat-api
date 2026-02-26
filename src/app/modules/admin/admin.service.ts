import { UnitDocument } from "../units/schema/unit.schema";
import { UserDocument, UserRole, UserStatus } from "../users/schema/user.schema";
import { GroupDocument } from "../groups/schema/group.schema";
import { PaymentDocument } from "../payments/schema/payment.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as XLSX from 'xlsx';
import { ExportFilterDto, ExportType } from './dto/export-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel("User") private userModel: Model<UserDocument>,
    @InjectModel("Unit") private unitModel: Model<UnitDocument>,
    @InjectModel("Group") private groupModel: Model<GroupDocument>,
    @InjectModel("Payment") private paymentModel: Model<PaymentDocument>
  ) { }

  async getDashboardData() {
    try {
      const totalUsers = await this.userModel.countDocuments();
      const totalUnits = await this.unitModel.countDocuments();
      const totalGroups = await this.groupModel.countDocuments();
      const totalRevenue = await this.paymentModel.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      if (!totalUsers || totalUsers < 0) {
        throw new Error("Invalid total users count");
      }
      if (!totalUnits || totalUnits < 0) {
        throw new Error("Invalid total units count");
      }
      if (!totalGroups || totalGroups < 0) {
        throw new Error("Invalid total groups count");
      }
      if (!totalRevenue || totalRevenue.length === 0) {
        throw new Error("No revenue data found");
      }
      if (totalRevenue[0].total === undefined) {
        throw new Error("Revenue data is missing total field");
      }
      return {
        totalUsers,
        totalUnits,
        totalGroups,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
      };
    } catch (error) {
      throw new Error("Error fetching dashboard data: " + error.message);
    }
  }

  async getRevenueData() {
    try {
      const payments = await this.paymentModel.find();
      if (!payments || payments.length === 0) {
        throw new Error("No payments found");
      }
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
      return { totalRevenue };
    } catch (error) {
      throw new Error("Error fetching revenue data: " + error.message);
    }
  }

  async getUserActivity() {
    try {
      const users = await this.userModel.find();
      if (!users || users.length === 0) {
        throw new Error("No users found");
      }
      const activeUsers = users.filter(user => user.status === "active").length;
      if (activeUsers < 0) {
        throw new Error("Invalid active users count");
      }
      return { activeUsers, totalUsers: users.length };
    } catch (error) {
      throw new Error("Error fetching user activity data: " + error.message);
    }
  }

  async getUnitStatistics() {
    try {
      const units = await this.unitModel.find();
      if (!units || units.length === 0) {
        throw new Error("No units found");
      }
      const activeUnits = units.filter(unit => (unit as any).status === "active").length;
      if (activeUnits < 0) {
        throw new Error("Invalid active units count");
      }
      return { activeUnits, totalUnits: units.length };
    } catch (error) {
      throw new Error("Error fetching unit statistics: " + error.message);
    }
  }

  async getGroupStatistics() {
    try {
      const groups = await this.groupModel.find();
      if (!groups || groups.length === 0) {
        throw new Error("No groups found");
      }
      const activeGroups = groups.filter(group => (group as any).status === "active").length;
      if (activeGroups < 0) {
        throw new Error("Invalid active groups count");
      }
      return { activeGroups, totalGroups: groups.length };
    } catch (error) {
      throw new Error("Error fetching group statistics: " + error.message);
    }
  }

  async getRecentPayments() {
    try {
      const recentPayments = await this.paymentModel.find().sort({ createdAt: -1 }).limit(5);
      return recentPayments;
    } catch (error) {
      throw new Error("Error fetching recent payments: " + error.message);
    }
  }

  async getRecentUsers() {
    const recentUsers = await this.userModel.find().sort({ createdAt: -1 }).limit(5);
    if (!recentUsers || recentUsers.length === 0) {
      throw new Error("No recent users found");
    }
    return recentUsers;
  }

  async getUserByRole(role: string) {
    try {
      const users = await this.userModel.find({ role });
      if (!users || users.length === 0) {
        throw new Error(`No users found with role: ${role}`);
      }
      return users;
    } catch (error) {
      throw new Error("Error fetching users by role: " + error.message);
    }
  }

  async getRevenueByMonth() {
    try {
      const payments = await this.paymentModel.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalRevenue: { $sum: "$amount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      if (!payments || payments.length === 0) {
        throw new Error("No revenue data found");
      }
      return payments.map(payment => ({
        month: payment._id.month,
        year: payment._id.year,
        totalRevenue: payment.totalRevenue
      }));
    } catch (error) {
      throw new Error("Error fetching revenue by month data: " + error.message);
    }
  }

  async getUserByMonth() {
    try {
      const users = await this.userModel.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalUsers: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      if (!users || users.length === 0) {
        throw new Error("No user registration data found");
      }
      return users.map(user => ({
        month: user._id.month,
        year: user._id.year,
        totalUsers: user.totalUsers
      }));
    } catch (error) {
      throw new Error("Error fetching user by month data: " + error.message);
    }
  }

  // ==================== EXCEL EXPORT METHODS ====================

  /**
   * Lấy danh sách đầy đủ users cho export với filters
   */
  async getAllUsersForExport(filters: ExportFilterDto) {
    try {
      const query: any = {};

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.role) {
        query.role = filters.role;
      }
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const users = await this.userModel
        .find(query)
        .populate('parent', 'fullname email')
        .populate('teacher', 'fullname email')
        .select('-password -tokenVerify -codeVerify')
        .sort({ createdAt: -1 })
        .lean();

      return users;
    } catch (error) {
      throw new Error("Error fetching users for export: " + error.message);
    }
  }

  /**
   * Lấy danh sách đầy đủ payments cho export với filters
   */
  async getAllPaymentsForExport(filters: ExportFilterDto) {
    try {
      const query: any = {};

      // Apply filters
      if (filters.paymentStatus) {
        query.status = filters.paymentStatus;
      }
      if (filters.paymentMethod) {
        query.method = filters.paymentMethod;
      }
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const payments = await this.paymentModel
        .find(query)
        .populate('userId', 'fullname email username')
        .populate('subscriptionId', 'packageId startDate endDate')
        .sort({ createdAt: -1 })
        .lean();

      return payments;
    } catch (error) {
      throw new Error("Error fetching payments for export: " + error.message);
    }
  }

  /**
   * Lấy thống kê chi tiết về groups và units
   */
  async getGroupsUnitsStats() {
    try {
      // Groups statistics
      const groupsStats = await this.groupModel.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            byType: [
              { $group: { _id: '$type', count: { $sum: 1 } } },
              { $sort: { _id: 1 } }
            ],
            byVisibility: [
              { $group: { _id: '$visibility', count: { $sum: 1 } } },
              { $sort: { _id: 1 } }
            ],
            active: [
              { $match: { isActive: true } },
              { $count: 'count' }
            ]
          }
        }
      ]);

      // Units statistics
      const unitsStats = await this.unitModel.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
              { $sort: { _id: 1 } }
            ],
            byDifficulty: [
              { $group: { _id: '$difficulty', count: { $sum: 1 } } },
              { $sort: { _id: 1 } }
            ]
          }
        }
      ]);

      return {
        groups: groupsStats[0],
        units: unitsStats[0]
      };
    } catch (error) {
      throw new Error("Error fetching groups and units statistics: " + error.message);
    }
  }

  /**
   * Format users data thành format Excel
   */
  private formatUsersToExcel(users: any[]) {
    return users.map(user => ({
      'Fullname': user.fullname || '',
      'Email': user.email || '',
      'Username': user.username || '',
      'Role': user.role || '',
      'Status': user.status || '',
      'Gender': user.gender || '',
      'Phone': user.phone || '',
      'Birth Date': user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      'Account Package': user.accountPackage || '',
      'Is Verified': user.isVerify ? 'Yes' : 'No',
      'Language': user.language || '',
      'Province': user.province || '',
      'Parent Email': user.parent?.email || '',
      'Teacher Email': user.teacher?.email || '',
      'Created At': user.createdAt ? new Date(user.createdAt).toISOString() : '',
      'Last Login': user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : '',
    }));
  }

  /**
   * Format payments data thành format Excel
   */
  private formatPaymentsToExcel(payments: any[]) {
    return payments.map(payment => ({
      'Transaction ID': payment.transactionId || '',
      'User Name': payment.userId?.fullname || '',
      'User Email': payment.userId?.email || '',
      'User Username': payment.userId?.username || '',
      'Amount': payment.amount || 0,
      'Currency': payment.currency || '',
      'Method': payment.method || '',
      'Status': payment.status || '',
      'Description': payment.description || '',
      'Subscription ID': payment.subscriptionId?._id?.toString() || '',
      'Paid At': payment.paidAt ? new Date(payment.paidAt).toISOString() : '',
      'Created At': payment.createdAt ? new Date(payment.createdAt).toISOString() : '',
    }));
  }

  /**
   * Format revenue by month thành format Excel
   */
  private formatRevenueByMonthToExcel(data: any[]) {
    return data.map(item => ({
      'Year': item.year,
      'Month': item.month,
      'Total Revenue': item.totalRevenue,
    }));
  }

  /**
   * Format user by month thành format Excel
   */
  private formatUserByMonthToExcel(data: any[]) {
    return data.map(item => ({
      'Year': item.year,
      'Month': item.month,
      'Total Users': item.totalUsers,
    }));
  }

  /**
   * Format dashboard data thành format Excel
   */
  private formatDashboardToExcel(data: any) {
    return [
      { 'Metric': 'Total Users', 'Value': data.totalUsers },
      { 'Metric': 'Total Units', 'Value': data.totalUnits },
      { 'Metric': 'Total Groups', 'Value': data.totalGroups },
      { 'Metric': 'Total Revenue', 'Value': data.totalRevenue },
    ];
  }

  /**
   * Format groups and units statistics thành format Excel
   */
  private formatGroupsUnitsStatsToExcel(data: any) {
    const groupsData = [
      { 'Metric': 'Total Groups', 'Value': data.groups.total[0]?.count || 0 },
      { 'Metric': 'Active Groups', 'Value': data.groups.active[0]?.count || 0 },
      ...data.groups.byType.map((item: any) => ({
        'Metric': `Groups by Type - ${item._id}`,
        'Value': item.count
      })),
      ...data.groups.byVisibility.map((item: any) => ({
        'Metric': `Groups by Visibility - ${item._id}`,
        'Value': item.count
      }))
    ];

    const unitsData = [
      { 'Metric': 'Total Units', 'Value': data.units.total[0]?.count || 0 },
      ...data.units.byStatus.map((item: any) => ({
        'Metric': `Units by Status - ${item._id}`,
        'Value': item.count
      })),
      ...data.units.byDifficulty.map((item: any) => ({
        'Metric': `Units by Difficulty - ${item._id}`,
        'Value': item.count
      }))
    ];

    return { groupsData, unitsData };
  }

  /**
   * Main method để export data thành Excel file
   */
  async exportToExcel(filters: ExportFilterDto): Promise<Buffer> {
    try {
      let workbook: XLSX.WorkBook;
      let worksheet: XLSX.WorkSheet;
      let data: any[];

      switch (filters.type) {
        case ExportType.USERS:
          const users = await this.getAllUsersForExport(filters);
          data = this.formatUsersToExcel(users);
          worksheet = XLSX.utils.json_to_sheet(data);
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
          break;

        case ExportType.PAYMENTS:
          const payments = await this.getAllPaymentsForExport(filters);
          data = this.formatPaymentsToExcel(payments);
          worksheet = XLSX.utils.json_to_sheet(data);
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
          break;

        case ExportType.REVENUE_BY_MONTH:
          const revenueData = await this.getRevenueByMonth();
          data = this.formatRevenueByMonthToExcel(revenueData);
          worksheet = XLSX.utils.json_to_sheet(data);
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue by Month');
          break;

        case ExportType.USER_BY_MONTH:
          const userData = await this.getUserByMonth();
          data = this.formatUserByMonthToExcel(userData);
          worksheet = XLSX.utils.json_to_sheet(data);
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users by Month');
          break;

        case ExportType.DASHBOARD_SUMMARY:
          const dashboardData = await this.getDashboardData();
          data = this.formatDashboardToExcel(dashboardData);
          worksheet = XLSX.utils.json_to_sheet(data);
          workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard');
          break;

        case ExportType.GROUPS_UNITS_STATISTICS:
          const stats = await this.getGroupsUnitsStats();
          const formattedStats = this.formatGroupsUnitsStatsToExcel(stats);
          
          workbook = XLSX.utils.book_new();
          
          const groupsSheet = XLSX.utils.json_to_sheet(formattedStats.groupsData);
          XLSX.utils.book_append_sheet(workbook, groupsSheet, 'Groups Statistics');
          
          const unitsSheet = XLSX.utils.json_to_sheet(formattedStats.unitsData);
          XLSX.utils.book_append_sheet(workbook, unitsSheet, 'Units Statistics');
          break;

        default:
          throw new Error('Invalid export type');
      }

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return buffer;
    } catch (error) {
      throw new Error("Error exporting to Excel: " + error.message);
    }
  }
}