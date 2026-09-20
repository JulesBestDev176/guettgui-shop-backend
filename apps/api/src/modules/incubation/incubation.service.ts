import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StocksService } from '../stocks/stocks.service';
import { CreateIncubatorDto } from './dto/create-incubator.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Candling1Dto, Candling2Dto } from './dto/candling.dto';
import { HatchResultDto } from './dto/hatch-result.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { IncubationStatus, StockType, StockMoveType } from '@prisma/client';

@Injectable()
export class IncubationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stocksService: StocksService,
  ) {}

  // ─── Incubators ─────────────────────────────────────

  async createIncubator(teamId: string, dto: CreateIncubatorDto) {
    return this.prisma.incubator.create({
      data: { teamId, name: dto.name, capacity: dto.capacity },
    });
  }

  async findAllIncubators(teamId: string) {
    return this.prisma.incubator.findMany({
      where: { teamId },
      include: {
        _count: { select: { batches: { where: { status: { not: IncubationStatus.COMPLETED } } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Batches ────────────────────────────────────────

  async createBatch(teamId: string, dto: CreateBatchDto, userId: string) {
    // Verifier couveuse
    const incubator = await this.prisma.incubator.findFirst({
      where: { id: dto.incubatorId, teamId, isActive: true },
    });
    if (!incubator) throw new NotFoundException('Couveuse introuvable');

    // Verifier lot source
    const flock = await this.prisma.flock.findFirst({
      where: { id: dto.sourceFlockId, teamId, deletedAt: null },
    });
    if (!flock) throw new NotFoundException('Lot source introuvable');

    const loadDate = new Date(dto.loadDate);
    const incubationDays = flock.incubationDays || (flock.type === 'QUAIL' ? 17 : 24);

    // Calculer les dates
    const candling1Date = new Date(loadDate);
    candling1Date.setDate(candling1Date.getDate() + 7);

    const candling2Date = new Date(loadDate);
    candling2Date.setDate(candling2Date.getDate() + 14);

    const expectedHatchDate = new Date(loadDate);
    expectedHatchDate.setDate(expectedHatchDate.getDate() + incubationDays);

    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.incubationBatch.create({
        data: {
          teamId,
          incubatorId: dto.incubatorId,
          sourceFlockId: dto.sourceFlockId,
          loadDate,
          eggsLoaded: dto.eggsLoaded,
          candling1Date,
          candling2Date,
          expectedHatchDate,
          status: IncubationStatus.INCUBATING,
          notes: dto.notes,
        },
      });

      // Decrementer le stock d'oeufs
      await this.stocksService.addMoveTx(
        tx, teamId, StockType.EGGS, StockMoveType.OUT_INCUBATION,
        -dto.eggsLoaded, loadDate, userId, `Chargement couveuse ${incubator.name}`,
      );

      return batch;
    });
  }

  async findAllBatches(teamId: string, pagination: PaginationDto, status?: IncubationStatus) {
    const where: Record<string, unknown> = { teamId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.incubationBatch.findMany({
        where: where as never,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { loadDate: 'desc' },
        include: {
          incubator: { select: { id: true, name: true } },
          sourceFlock: { select: { id: true, name: true, type: true } },
        },
      }),
      this.prisma.incubationBatch.count({ where: where as never }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async candling1(teamId: string, batchId: string, dto: Candling1Dto) {
    const batch = await this.findBatch(teamId, batchId);

    if (batch.status !== IncubationStatus.INCUBATING) {
      throw new BadRequestException('Ce lot de couveuse n\'est pas en incubation');
    }

    return this.prisma.incubationBatch.update({
      where: { id: batchId },
      data: {
        eggsFertile: dto.eggsFertile,
        eggsClear: dto.eggsClear,
        eggsDeadJ7: dto.eggsDeadJ7 || 0,
        fertilityRate: batch.eggsLoaded > 0
          ? (dto.eggsFertile / batch.eggsLoaded) * 100
          : 0,
        status: IncubationStatus.CANDLING_1,
      },
    });
  }

  async candling2(teamId: string, batchId: string, dto: Candling2Dto) {
    const batch = await this.findBatch(teamId, batchId);

    if (batch.status !== IncubationStatus.CANDLING_1) {
      throw new BadRequestException('Le premier mirage doit etre effectue avant le deuxieme');
    }

    return this.prisma.incubationBatch.update({
      where: { id: batchId },
      data: {
        eggsAliveJ14: dto.eggsAliveJ14,
        eggsDeadJ14: dto.eggsDeadJ14 || 0,
        status: IncubationStatus.CANDLING_2,
      },
    });
  }

  async hatch(teamId: string, batchId: string, dto: HatchResultDto) {
    const batch = await this.findBatch(teamId, batchId);

    if (![IncubationStatus.CANDLING_1, IncubationStatus.CANDLING_2, IncubationStatus.INCUBATING].includes(batch.status as any)) {
      throw new BadRequestException('Ce lot de couveuse ne peut pas recevoir de resultat d\'eclosion');
    }

    const fertile = batch.eggsFertile || batch.eggsLoaded;
    const hatchRate = fertile > 0 ? (dto.chicksHatched / fertile) * 100 : 0;
    const overallRate = batch.eggsLoaded > 0 ? (dto.chicksHatched / batch.eggsLoaded) * 100 : 0;

    return this.prisma.incubationBatch.update({
      where: { id: batchId },
      data: {
        chicksHatched: dto.chicksHatched,
        eggsUnhatched: dto.eggsUnhatched,
        chicksAliveD1: dto.chicksAliveD1,
        chicksDeadD0: dto.chicksDeadD0,
        actualHatchDate: dto.actualHatchDate ? new Date(dto.actualHatchDate) : new Date(),
        hatchRate,
        overallRate,
        status: IncubationStatus.COMPLETED,
      },
    });
  }

  private async findBatch(teamId: string, batchId: string) {
    const batch = await this.prisma.incubationBatch.findFirst({
      where: { id: batchId, teamId },
    });

    if (!batch) {
      throw new NotFoundException('Lot de couveuse introuvable');
    }

    return batch;
  }
}
