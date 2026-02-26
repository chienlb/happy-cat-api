import { UnitDocument } from "../units/schema/unit.schema";
import { UserDocument } from "../users/schema/user.schema";
import { GroupDocument } from "../groups/schema/group.schema";
import { PaymentDocument } from "../payments/schema/payment.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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
}