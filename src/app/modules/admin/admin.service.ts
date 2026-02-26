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
  ) {}

  async getDashboardData() {
    const totalUsers = await this.userModel.countDocuments();
    const totalUnits = await this.unitModel.countDocuments();
    const totalGroups = await this.groupModel.countDocuments();
    const totalPayments = await this.paymentModel.countDocuments();
    
    return {
      totalUsers,
      totalUnits,
      totalGroups,
      totalPayments
    };
  }

  async getRevenueData() {
    const payments = await this.paymentModel.find();
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return { totalRevenue };
  }

  async getUserActivity() {
    const users = await this.userModel.find();
    const activeUsers = users.filter(user => user.status === "active").length;
    return { activeUsers, totalUsers: users.length };
  }

  async getUnitStatistics() {
    const units = await this.unitModel.find();
    const occupiedUnits = units.filter(unit => unit.isActive === "active").length;
    return { occupiedUnits, totalUnits: units.length };
  }

  async getGroupStatistics() {
    const groups = await this.groupModel.find();
    const activeGroups = groups.filter(group => group.isActive === true).length;
    return { activeGroups, totalGroups: groups.length };
  }

  async getRecentPayments() {
    const recentPayments = await this.paymentModel.find().sort({ createdAt: -1 }).limit(5);
    return recentPayments;
  }

  async getRecentUsers() {
    const recentUsers = await this.userModel.find().sort({ createdAt: -1 }).limit(5);
    if (!recentUsers || recentUsers.length === 0) {
      throw new Error("No recent users found");
    }
    return recentUsers;
  }

  async getUserByRole(role: string) {
    const users = await this.userModel.find({ role });
    return users;
  }

  async getRevenueByMonth() {
    const payments = await this.paymentModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    return payments.map(payment => ({
      month: payment._id.month,
      year: payment._id.year,
      totalRevenue: payment.totalRevenue
    }));
  }

  async getUserByMonth() {
    const users = await this.userModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalUsers: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    return users.map(user => ({
      month: user._id.month,
      year: user._id.year,
      totalUsers: user.totalUsers
    }));
  }
}