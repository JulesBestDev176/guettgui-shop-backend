import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StocksService } from '../stocks/stocks.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalePaymentDto } from './dto/create-sale-payment.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { ExpenseCategory, PaymentStatus, StockType, StockMoveType, Prisma } from '@prisma/client';

@Injectable()
export class FinancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stocksService: StocksService,
  ) {}

  // ─── Expenses ───────────────────────────────────────

  async createExpense(teamId: string, dto: CreateExpenseDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          teamId,
          flockId: dto.flockId,
          date: new Date(dto.date),
          category: dto.category,
          subCategory: dto.subCategory,
          description: dto.description,
          amount: dto.amount,
          photoUrl: dto.photoUrl,
          recordedById: userId,
          localId: dto.localId,
          syncedAt: new Date(),
        },
      });

      // Si achat aliment, incrementer le stock
      if (dto.category === ExpenseCategory.FEED && dto.subCategory) {
        const stockTypeMap: Record<string, StockType> = {
          'aliment_ponte': StockType.LAYER_FEED,
          'aliment_croissance': StockType.BROILER_FEED,
          'mil': StockType.MILLET,
          'complement': StockType.SUPPLEMENT,
        };
        const stockType = stockTypeMap[dto.subCategory];
        if (stockType) {
          // Le montant en FCFA, on ne peut pas deviner la quantite exacte
          // L'eleveur devra ajuster manuellement le stock
        }
      }

      return expense;
    });
  }

  async findAllExpenses(
    teamId: string,
    pagination: PaginationDto,
    category?: ExpenseCategory,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.ExpenseWhereInput = {
      teamId,
      deletedAt: null,
      ...(category && { category }),
    };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) (where.date as Prisma.DateTimeFilter).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async removeExpense(teamId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, teamId, deletedAt: null },
    });
    if (!expense) throw new NotFoundException('Depense introuvable');

    return this.prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Sales ──────────────────────────────────────────

  async createSale(teamId: string, dto: CreateSaleDto, userId: string) {
    const totalAmount = dto.quantity * dto.unitPrice;
    const amountPaid = dto.amountPaid ?? (dto.paymentStatus === PaymentStatus.PAID ? totalAmount : 0);

    let paymentStatus = dto.paymentStatus || PaymentStatus.PAID;
    if (amountPaid >= totalAmount) {
      paymentStatus = PaymentStatus.PAID;
    } else if (amountPaid > 0) {
      paymentStatus = PaymentStatus.PARTIAL;
    } else {
      paymentStatus = PaymentStatus.PENDING;
    }

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          teamId,
          flockId: dto.flockId,
          customerId: dto.customerId,
          orderId: dto.orderId,
          date: new Date(dto.date),
          productType: dto.productType,
          quantity: dto.quantity,
          unitPrice: dto.unitPrice,
          totalAmount,
          paymentStatus,
          amountPaid,
          paymentMethod: dto.paymentMethod,
          notes: dto.notes,
          recordedById: userId,
          localId: dto.localId,
          syncedAt: new Date(),
        },
      });

      // Creer le premier paiement si montant paye > 0
      if (amountPaid > 0 && dto.paymentMethod) {
        await tx.salePayment.create({
          data: {
            saleId: sale.id,
            date: new Date(dto.date),
            amount: amountPaid,
            method: dto.paymentMethod,
            recordedById: userId,
          },
        });
      }

      // Decrementer le stock correspondant
      const stockTypeMap: Record<string, StockType> = {
        'CONSUMPTION_EGGS': StockType.EGGS,
        'FERTILE_EGGS': StockType.EGGS,
        'QUAIL_EGGS': StockType.EGGS,
      };
      const stockType = stockTypeMap[dto.productType];
      if (stockType) {
        await this.stocksService.addMoveTx(
          tx, teamId, stockType, StockMoveType.OUT_SALE,
          -dto.quantity, new Date(dto.date), userId, `Vente ${dto.productType}`,
        );
      }

      return sale;
    });
  }

  async findAllSales(
    teamId: string,
    pagination: PaginationDto,
    paymentStatus?: PaymentStatus,
    productType?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: Prisma.SaleWhereInput = {
      teamId,
      deletedAt: null,
      ...(paymentStatus && { paymentStatus }),
      ...(productType && { productType: productType as never }),
    };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) (where.date as Prisma.DateTimeFilter).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { date: 'desc' },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true } },
          payments: true,
        },
      }),
      this.prisma.sale.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async removeSale(teamId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, teamId, deletedAt: null },
    });
    if (!sale) throw new NotFoundException('Vente introuvable');

    return this.prisma.sale.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Sale Payments ──────────────────────────────────

  async addPayment(teamId: string, saleId: string, dto: CreateSalePaymentDto, userId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id: saleId, teamId, deletedAt: null },
    });

    if (!sale) throw new NotFoundException('Vente introuvable');

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.salePayment.create({
        data: {
          saleId,
          date: new Date(dto.date),
          amount: dto.amount,
          method: dto.method,
          notes: dto.notes,
          recordedById: userId,
        },
      });

      const newAmountPaid = sale.amountPaid + dto.amount;
      let paymentStatus: PaymentStatus;
      if (newAmountPaid >= sale.totalAmount) {
        paymentStatus = PaymentStatus.PAID;
      } else {
        paymentStatus = PaymentStatus.PARTIAL;
      }

      await tx.sale.update({
        where: { id: saleId },
        data: {
          amountPaid: newAmountPaid,
          paymentStatus,
        },
      });

      return payment;
    });
  }

  // ─── Summary ────────────────────────────────────────

  async getSummary(teamId: string, dateFrom?: string, dateTo?: string) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo);

    const hasDateFilter = dateFrom || dateTo;

    const [expenses, sales] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          teamId,
          deletedAt: null,
          ...(hasDateFilter && { date: dateFilter }),
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.sale.aggregate({
        where: {
          teamId,
          deletedAt: null,
          ...(hasDateFilter && { date: dateFilter }),
        },
        _sum: { totalAmount: true, amountPaid: true },
        _count: true,
      }),
    ]);

    const totalExpenses = expenses._sum.amount || 0;
    const totalRevenue = sales._sum.totalAmount || 0;
    const totalPaid = sales._sum.amountPaid || 0;
    const netResult = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (netResult / totalRevenue) * 100 : 0;

    // Depenses par categorie
    const expensesByCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        teamId,
        deletedAt: null,
        ...(hasDateFilter && { date: dateFilter }),
      },
      _sum: { amount: true },
    });

    // Ventes par type de produit
    const salesByProduct = await this.prisma.sale.groupBy({
      by: ['productType'],
      where: {
        teamId,
        deletedAt: null,
        ...(hasDateFilter && { date: dateFilter }),
      },
      _sum: { totalAmount: true },
      _count: true,
    });

    return {
      data: {
        totalRevenue,
        totalExpenses,
        netResult,
        margin: Math.round(margin * 100) / 100,
        totalPaid,
        totalUnpaid: totalRevenue - totalPaid,
        expenseCount: expenses._count,
        saleCount: sales._count,
        expensesByCategory,
        salesByProduct,
      },
    };
  }
}
