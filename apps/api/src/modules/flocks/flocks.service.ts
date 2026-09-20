import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFlockDto } from './dto/create-flock.dto';
import { UpdateFlockDto } from './dto/update-flock.dto';
import { CloseFlockDto } from './dto/close-flock.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { FlockType, FlockStatus, Prisma } from '@prisma/client';

@Injectable()
export class FlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(teamId: string, dto: CreateFlockDto, userId: string) {
    const males = dto.initialMales || 0;
    const females = dto.initialFemales || 0;
    const total = dto.initialTotal || males + females;

    let expectedEndDate: Date | undefined;
    if (dto.type === FlockType.BROILER && dto.broilerDurationDays) {
      const start = new Date(dto.startDate);
      expectedEndDate = new Date(start.getTime() + dto.broilerDurationDays * 24 * 60 * 60 * 1000);
    }

    const flock = await this.prisma.flock.create({
      data: {
        teamId,
        name: dto.name,
        type: dto.type,
        breed: dto.breed,
        startDate: new Date(dto.startDate),
        initialMales: males,
        initialFemales: females,
        initialTotal: total,
        currentMales: males,
        currentFemales: females,
        currentTotal: total,
        targetLayingRate: dto.targetLayingRate,
        broilerDurationDays: dto.broilerDurationDays,
        incubationDays: dto.incubationDays,
        expectedEndDate,
        notes: dto.notes,
        photoUrl: dto.photoUrl,
      },
    });

    // Creer les vaccinations automatiques basees sur les protocoles
    await this.createVaccinations(teamId, flock.id, dto.type, new Date(dto.startDate));

    return flock;
  }

  async findAll(
    teamId: string,
    pagination: PaginationDto,
    type?: FlockType,
    status?: FlockStatus,
  ) {
    const where: Prisma.FlockWhereInput = {
      teamId,
      deletedAt: null,
      ...(type && { type }),
      ...(status && { status }),
    };

    const orderBy: Prisma.FlockOrderByWithRelationInput = pagination.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder || 'desc' }
      : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.flock.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.prisma.flock.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async findOne(teamId: string, id: string) {
    const flock = await this.prisma.flock.findFirst({
      where: { id, teamId, deletedAt: null },
      include: {
        _count: {
          select: { dailyRecords: true, incubationBatches: true, vaccinations: true },
        },
      },
    });

    if (!flock) {
      throw new NotFoundException('Lot introuvable');
    }

    return flock;
  }

  async update(teamId: string, id: string, dto: UpdateFlockDto) {
    const flock = await this.prisma.flock.findFirst({
      where: { id, teamId, deletedAt: null },
    });

    if (!flock) {
      throw new NotFoundException('Lot introuvable');
    }

    if (flock.status === FlockStatus.COMPLETED) {
      throw new BadRequestException('Impossible de modifier un lot cloture');
    }

    const updateData: Prisma.FlockUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.breed !== undefined) updateData.breed = dto.breed;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.photoUrl !== undefined) updateData.photoUrl = dto.photoUrl;
    if (dto.targetLayingRate !== undefined) updateData.targetLayingRate = dto.targetLayingRate;
    if (dto.broilerDurationDays !== undefined) updateData.broilerDurationDays = dto.broilerDurationDays;

    return this.prisma.flock.update({
      where: { id },
      data: updateData,
    });
  }

  async close(teamId: string, id: string, dto: CloseFlockDto) {
    const flock = await this.prisma.flock.findFirst({
      where: { id, teamId, deletedAt: null, status: FlockStatus.ACTIVE },
    });

    if (!flock) {
      throw new NotFoundException('Lot actif introuvable');
    }

    return this.prisma.flock.update({
      where: { id },
      data: {
        status: FlockStatus.COMPLETED,
        endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
        notes: dto.notes || flock.notes,
      },
    });
  }

  async remove(teamId: string, id: string) {
    const flock = await this.prisma.flock.findFirst({
      where: { id, teamId, deletedAt: null },
    });

    if (!flock) {
      throw new NotFoundException('Lot introuvable');
    }

    return this.prisma.flock.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async createVaccinations(
    teamId: string,
    flockId: string,
    flockType: FlockType,
    startDate: Date,
  ) {
    const protocols = await this.prisma.vaccinationProtocol.findMany({
      where: { teamId, flockType },
      orderBy: { dayOfAdmin: 'asc' },
    });

    if (protocols.length === 0) return;

    const vaccinations = protocols.map((protocol) => {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() + protocol.dayOfAdmin);

      return {
        flockId,
        vaccineName: protocol.name,
        scheduledDate,
        route: protocol.route,
        isDone: false,
      };
    });

    await this.prisma.vaccination.createMany({ data: vaccinations });
  }
}
