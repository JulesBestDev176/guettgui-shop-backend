import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StocksService } from '../stocks/stocks.service';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { UpdateDailyRecordDto } from './dto/update-daily-record.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { FlockStatus, StockType, StockMoveType } from '@prisma/client';

@Injectable()
export class DailyRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stocksService: StocksService,
  ) {}

  async create(teamId: string, dto: CreateDailyRecordDto, userId: string) {
    // Verifier que le lot appartient a l'equipe et est actif
    const flock = await this.prisma.flock.findFirst({
      where: { id: dto.flockId, teamId, deletedAt: null, status: FlockStatus.ACTIVE },
    });

    if (!flock) {
      throw new NotFoundException('Lot actif introuvable');
    }

    // Verifier qu'il n'y a pas deja une saisie pour ce jour
    const recordDate = new Date(dto.date);
    const existing = await this.prisma.dailyRecord.findUnique({
      where: { flockId_date: { flockId: dto.flockId, date: recordDate } },
    });

    if (existing) {
      throw new ConflictException('Une saisie existe deja pour ce lot a cette date');
    }

    // Transaction : record + MAJ effectif + MAJ stocks
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.dailyRecord.create({
        data: {
          flockId: dto.flockId,
          date: recordDate,
          recordedById: userId,
          eggsLaid: dto.eggsLaid,
          eggsBroken: dto.eggsBroken,
          eggsCollected: dto.eggsCollected,
          mortalityCount: dto.mortalityCount || 0,
          mortalityCause: dto.mortalityCause,
          feedConsumedKg: dto.feedConsumedKg,
          waterConsumedL: dto.waterConsumedL,
          avgWeightKg: dto.avgWeightKg,
          sampleSize: dto.sampleSize,
          notes: dto.notes,
          photoUrl: dto.photoUrl,
          localId: dto.localId,
          syncedAt: new Date(),
        },
      });

      // Decrementer effectif si mortalite
      const mortality = dto.mortalityCount || 0;
      if (mortality > 0) {
        await tx.flock.update({
          where: { id: dto.flockId },
          data: { currentTotal: { decrement: mortality } },
        });

        // Verifier mortalite totale
        const updatedFlock = await tx.flock.findUnique({ where: { id: dto.flockId } });
        if (updatedFlock && updatedFlock.currentTotal <= 0) {
          await tx.flock.update({
            where: { id: dto.flockId },
            data: { status: FlockStatus.COMPLETED, endDate: recordDate },
          });
        }
      }

      // MAJ stock oeufs (entree)
      if (dto.eggsCollected && dto.eggsCollected > 0) {
        await this.stocksService.addMoveTx(
          tx, teamId, StockType.EGGS, StockMoveType.IN_PRODUCTION,
          dto.eggsCollected, recordDate, userId, 'Collecte quotidienne',
        );
      }

      // MAJ stock aliment (sortie)
      if (dto.feedConsumedKg && dto.feedConsumedKg > 0) {
        const feedType = flock.type === 'BROILER' ? StockType.BROILER_FEED : StockType.LAYER_FEED;
        await this.stocksService.addMoveTx(
          tx, teamId, feedType, StockMoveType.OUT_CONSUMPTION,
          -dto.feedConsumedKg, recordDate, userId, 'Consommation quotidienne',
        );
      }

      return record;
    });
  }

  async update(teamId: string, id: string, dto: UpdateDailyRecordDto, userId: string) {
    const record = await this.prisma.dailyRecord.findFirst({
      where: { id },
      include: { flock: true },
    });

    if (!record || record.flock.teamId !== teamId) {
      throw new NotFoundException('Saisie introuvable');
    }

    return this.prisma.dailyRecord.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async findAll(teamId: string, pagination: PaginationDto, flockId?: string, dateFrom?: string, dateTo?: string) {
    const where: Record<string, unknown> = {
      flock: { teamId, deletedAt: null },
    };

    if (flockId) {
      where.flockId = flockId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.dailyRecord.findMany({
        where: where as never,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { date: 'desc' },
        include: { flock: { select: { id: true, name: true, type: true } } },
      }),
      this.prisma.dailyRecord.count({ where: where as never }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async findByFlock(teamId: string, flockId: string, pagination: PaginationDto) {
    // Verifier que le lot appartient a l'equipe
    const flock = await this.prisma.flock.findFirst({
      where: { id: flockId, teamId, deletedAt: null },
    });

    if (!flock) {
      throw new NotFoundException('Lot introuvable');
    }

    const where = { flockId };
    const [data, total] = await Promise.all([
      this.prisma.dailyRecord.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { date: 'desc' },
      }),
      this.prisma.dailyRecord.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }
}
