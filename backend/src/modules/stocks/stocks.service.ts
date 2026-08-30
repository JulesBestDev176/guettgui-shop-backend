import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { StockType, StockMoveType, Prisma } from '@prisma/client';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId: string) {
    const stocks = await this.prisma.stock.findMany({
      where: { teamId },
      orderBy: { type: 'asc' },
    });

    return stocks;
  }

  async getMoves(teamId: string, stockId: string, pagination: PaginationDto) {
    const stock = await this.prisma.stock.findFirst({
      where: { id: stockId, teamId },
    });

    if (!stock) {
      throw new NotFoundException('Stock introuvable');
    }

    const where = { stockId };
    const [data, total] = await Promise.all([
      this.prisma.stockMove.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockMove.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async adjust(teamId: string, stockId: string, dto: AdjustStockDto, userId: string) {
    const stock = await this.prisma.stock.findFirst({
      where: { id: stockId, teamId },
    });

    if (!stock) {
      throw new NotFoundException('Stock introuvable');
    }

    const difference = dto.newQuantity - stock.currentQty;
    const moveDate = dto.date ? new Date(dto.date) : new Date();

    return this.prisma.$transaction(async (tx) => {
      // Creer le mouvement d'ajustement
      await tx.stockMove.create({
        data: {
          stockId,
          type: StockMoveType.ADJUSTMENT,
          quantity: difference,
          date: moveDate,
          description: dto.description || 'Correction manuelle',
          recordedById: userId,
        },
      });

      // Mettre a jour le stock
      return tx.stock.update({
        where: { id: stockId },
        data: { currentQty: dto.newQuantity },
      });
    });
  }

  /**
   * Ajouter un mouvement de stock dans le cadre d'une transaction existante.
   * Utilise par DailyRecordsService, IncubationService, FinancesService, etc.
   */
  async addMoveTx(
    tx: Prisma.TransactionClient,
    teamId: string,
    stockType: StockType,
    moveType: StockMoveType,
    quantity: number,
    date: Date,
    userId: string,
    description?: string,
    expenseId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: { teamId_type: { teamId, type: stockType } },
    });

    if (!stock) return;

    await tx.stockMove.create({
      data: {
        stockId: stock.id,
        type: moveType,
        quantity,
        date,
        description,
        expenseId,
        recordedById: userId,
      },
    });

    await tx.stock.update({
      where: { id: stock.id },
      data: { currentQty: { increment: quantity } },
    });
  }
}
