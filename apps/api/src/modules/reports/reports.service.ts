import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FlockStatus, FlockType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyReport(teamId: string, date: string) {
    const reportDate = new Date(date);

    const [records, expenses, sales, alerts] = await Promise.all([
      this.prisma.dailyRecord.findMany({
        where: { flock: { teamId, deletedAt: null }, date: reportDate },
        include: { flock: { select: { id: true, name: true, type: true } } },
      }),
      this.prisma.expense.findMany({
        where: { teamId, deletedAt: null, date: reportDate },
      }),
      this.prisma.sale.findMany({
        where: { teamId, deletedAt: null, date: reportDate },
      }),
      this.prisma.alert.findMany({
        where: { teamId, createdAt: { gte: reportDate, lt: new Date(reportDate.getTime() + 86400000) } },
      }),
    ]);

    const totalEggsLaid = records.reduce((sum, r) => sum + (r.eggsLaid || 0), 0);
    const totalEggsCollected = records.reduce((sum, r) => sum + (r.eggsCollected || 0), 0);
    const totalMortality = records.reduce((sum, r) => sum + r.mortalityCount, 0);
    const totalFeedKg = records.reduce((sum, r) => sum + (r.feedConsumedKg || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

    return {
      data: {
        date,
        production: { totalEggsLaid, totalEggsCollected, totalMortality, totalFeedKg },
        finances: { totalExpenses, totalRevenue, netResult: totalRevenue - totalExpenses },
        records,
        expenses,
        sales,
        alertsCount: alerts.length,
      },
    };
  }

  async getWeeklyReport(teamId: string, weekStart: string) {
    const start = new Date(weekStart);
    const end = new Date(start.getTime() + 7 * 86400000);

    const [records, expenses, sales] = await Promise.all([
      this.prisma.dailyRecord.findMany({
        where: { flock: { teamId, deletedAt: null }, date: { gte: start, lt: end } },
        include: { flock: { select: { id: true, name: true, type: true, currentFemales: true, currentTotal: true } } },
      }),
      this.prisma.expense.aggregate({
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.sale.aggregate({
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { totalAmount: true },
        _count: true,
      }),
    ]);

    const totalEggsLaid = records.reduce((sum, r) => sum + (r.eggsLaid || 0), 0);
    const totalMortality = records.reduce((sum, r) => sum + r.mortalityCount, 0);
    const totalFeedKg = records.reduce((sum, r) => sum + (r.feedConsumedKg || 0), 0);

    // Taux de ponte
    const layerRecords = records.filter((r) =>
      [FlockType.BREEDER, FlockType.LAYER, FlockType.QUAIL].includes(r.flock.type),
    );
    const totalFemales = new Set(layerRecords.map((r) => r.flockId)).size > 0
      ? layerRecords.reduce((sum, r) => sum + (r.flock.currentFemales || r.flock.currentTotal || 0), 0)
        / new Set(layerRecords.map((r) => r.flockId)).size
      : 0;

    const daysWithRecords = new Set(layerRecords.map((r) => r.date.toISOString())).size;
    const layingRate = totalFemales > 0 && daysWithRecords > 0
      ? (totalEggsLaid / (totalFemales * daysWithRecords)) * 100
      : 0;

    return {
      data: {
        weekStart,
        weekEnd: end.toISOString().split('T')[0],
        production: {
          totalEggsLaid,
          totalMortality,
          totalFeedKg,
          layingRate: Math.round(layingRate * 10) / 10,
        },
        finances: {
          totalExpenses: expenses._sum.amount || 0,
          totalRevenue: sales._sum.totalAmount || 0,
          expenseCount: expenses._count,
          saleCount: sales._count,
        },
      },
    };
  }

  async getMonthlyReport(teamId: string, month: string) {
    // month = "2026-08"
    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    const [expensesByCategory, salesByProduct, totalExpenses, totalSales, stocks] = await Promise.all([
      this.prisma.expense.groupBy({
        by: ['category'],
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      this.prisma.sale.groupBy({
        by: ['productType'],
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      this.prisma.sale.aggregate({
        where: { teamId, deletedAt: null, date: { gte: start, lt: end } },
        _sum: { totalAmount: true },
      }),
      this.prisma.stock.findMany({ where: { teamId } }),
    ]);

    return {
      data: {
        month,
        finances: {
          totalExpenses: totalExpenses._sum.amount || 0,
          totalRevenue: totalSales._sum.totalAmount || 0,
          netResult: (totalSales._sum.totalAmount || 0) - (totalExpenses._sum.amount || 0),
          expensesByCategory,
          salesByProduct,
        },
        stocks: stocks.map((s) => ({
          type: s.type,
          name: s.name,
          currentQty: s.currentQty,
          unit: s.unit,
        })),
      },
    };
  }

  async getFlockReport(teamId: string, flockId: string) {
    const flock = await this.prisma.flock.findFirst({
      where: { id: flockId, teamId, deletedAt: null },
      include: {
        dailyRecords: { orderBy: { date: 'asc' } },
        incubationBatches: true,
        vaccinations: { orderBy: { scheduledDate: 'asc' } },
      },
    });

    if (!flock) throw new NotFoundException('Lot introuvable');

    const [expenses, sales] = await Promise.all([
      this.prisma.expense.aggregate({
        where: { teamId, flockId, deletedAt: null },
        _sum: { amount: true },
      }),
      this.prisma.sale.aggregate({
        where: { teamId, flockId, deletedAt: null },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalEggs = flock.dailyRecords.reduce((sum, r) => sum + (r.eggsLaid || 0), 0);
    const totalMortality = flock.dailyRecords.reduce((sum, r) => sum + r.mortalityCount, 0);
    const totalFeed = flock.dailyRecords.reduce((sum, r) => sum + (r.feedConsumedKg || 0), 0);

    const totalExpenses = expenses._sum.amount || 0;
    const totalRevenue = sales._sum.totalAmount || 0;
    const costPerAnimal = flock.initialTotal > 0 ? totalExpenses / flock.initialTotal : 0;

    return {
      data: {
        flock: {
          id: flock.id,
          name: flock.name,
          type: flock.type,
          status: flock.status,
          startDate: flock.startDate,
          endDate: flock.endDate,
          initialTotal: flock.initialTotal,
          currentTotal: flock.currentTotal,
        },
        production: {
          totalEggs,
          totalMortality,
          mortalityRate: flock.initialTotal > 0 ? (totalMortality / flock.initialTotal) * 100 : 0,
          totalFeedKg: totalFeed,
          recordCount: flock.dailyRecords.length,
        },
        finances: {
          totalExpenses,
          totalRevenue,
          netResult: totalRevenue - totalExpenses,
          costPerAnimal: Math.round(costPerAnimal),
        },
        incubation: {
          batchCount: flock.incubationBatches.length,
          batches: flock.incubationBatches,
        },
        vaccination: {
          total: flock.vaccinations.length,
          done: flock.vaccinations.filter((v) => v.isDone).length,
          pending: flock.vaccinations.filter((v) => !v.isDone).length,
        },
      },
    };
  }
}
