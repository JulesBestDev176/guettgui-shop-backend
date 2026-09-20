import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { MarkDoneDto } from './dto/mark-done.dto';
import { FlockType } from '@prisma/client';

@Injectable()
export class VaccinationService {
  constructor(private readonly prisma: PrismaService) {}

  async createProtocol(teamId: string, dto: CreateProtocolDto) {
    return this.prisma.vaccinationProtocol.create({
      data: { teamId, ...dto },
    });
  }

  async findAllProtocols(teamId: string, flockType?: FlockType) {
    return this.prisma.vaccinationProtocol.findMany({
      where: {
        teamId,
        ...(flockType && { flockType }),
      },
      orderBy: [{ flockType: 'asc' }, { dayOfAdmin: 'asc' }],
    });
  }

  async deleteProtocol(teamId: string, id: string) {
    const protocol = await this.prisma.vaccinationProtocol.findFirst({
      where: { id, teamId },
    });

    if (!protocol) throw new NotFoundException('Protocole introuvable');

    return this.prisma.vaccinationProtocol.delete({ where: { id } });
  }

  async findAllVaccinations(teamId: string, flockId?: string) {
    const where: Record<string, unknown> = {
      flock: { teamId, deletedAt: null },
    };

    if (flockId) {
      where.flockId = flockId;
    }

    return this.prisma.vaccination.findMany({
      where: where as never,
      orderBy: { scheduledDate: 'asc' },
      include: {
        flock: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async markDone(teamId: string, id: string, dto: MarkDoneDto, userId: string) {
    const vaccination = await this.prisma.vaccination.findFirst({
      where: { id },
      include: { flock: { select: { teamId: true } } },
    });

    if (!vaccination || vaccination.flock.teamId !== teamId) {
      throw new NotFoundException('Vaccination introuvable');
    }

    return this.prisma.vaccination.update({
      where: { id },
      data: {
        isDone: true,
        actualDate: dto.actualDate ? new Date(dto.actualDate) : new Date(),
        doseGiven: dto.doseGiven,
        doneById: userId,
        notes: dto.notes,
      },
    });
  }
}
