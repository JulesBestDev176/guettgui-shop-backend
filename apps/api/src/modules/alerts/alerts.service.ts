import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import {
  AlertType, AlertPriority, FlockStatus, FlockType,
  IncubationStatus, PaymentStatus, OrderStatus,
} from '@prisma/client';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId: string, pagination: PaginationDto) {
    const where = { teamId, isDismissed: false };

    const [data, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.alert.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async markAsRead(teamId: string, id: string) {
    const alert = await this.prisma.alert.findFirst({
      where: { id, teamId },
    });
    if (!alert) throw new NotFoundException('Alerte introuvable');

    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async dismiss(teamId: string, id: string) {
    const alert = await this.prisma.alert.findFirst({
      where: { id, teamId },
    });
    if (!alert) throw new NotFoundException('Alerte introuvable');

    return this.prisma.alert.update({
      where: { id },
      data: { isDismissed: true },
    });
  }

  // ─── Alert generation methods (called by cron) ─────

  async checkLowStock(teamId: string) {
    const stocks = await this.prisma.stock.findMany({
      where: { teamId },
    });

    for (const stock of stocks) {
      if (stock.currentQty <= stock.alertThreshold) {
        await this.createAlertIfNotExists(teamId, AlertType.LOW_STOCK, AlertPriority.HIGH, {
          title: `Stock bas : ${stock.name}`,
          message: `Le stock de ${stock.name} est a ${stock.currentQty} ${stock.unit} (seuil: ${stock.alertThreshold})`,
          referenceId: stock.id,
        });
      }
    }
  }

  async checkCandlingDue(teamId: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const batches = await this.prisma.incubationBatch.findMany({
      where: {
        teamId,
        status: { in: [IncubationStatus.INCUBATING] },
        candling1Date: new Date(tomorrowDate),
      },
      include: { incubator: true },
    });

    for (const batch of batches) {
      await this.createAlertIfNotExists(teamId, AlertType.CANDLING_DUE, AlertPriority.HIGH, {
        title: 'Mirage a faire demain',
        message: `Le mirage J7 du lot ${batch.incubator.name} est prevu pour demain`,
        referenceId: batch.id,
      });
    }

    // Check candling 2
    const batchesC2 = await this.prisma.incubationBatch.findMany({
      where: {
        teamId,
        status: { in: [IncubationStatus.CANDLING_1] },
        candling2Date: new Date(tomorrowDate),
      },
      include: { incubator: true },
    });

    for (const batch of batchesC2) {
      await this.createAlertIfNotExists(teamId, AlertType.CANDLING_DUE, AlertPriority.HIGH, {
        title: 'Mirage J14 a faire demain',
        message: `Le mirage J14 du lot ${batch.incubator.name} est prevu pour demain`,
        referenceId: batch.id,
      });
    }
  }

  async checkHatchDue(teamId: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const batches = await this.prisma.incubationBatch.findMany({
      where: {
        teamId,
        status: { not: IncubationStatus.COMPLETED },
        expectedHatchDate: new Date(tomorrowDate),
      },
      include: { incubator: true },
    });

    for (const batch of batches) {
      await this.createAlertIfNotExists(teamId, AlertType.HATCH_DUE, AlertPriority.HIGH, {
        title: 'Eclosion prevue demain',
        message: `L'eclosion du lot ${batch.incubator.name} est prevue pour demain`,
        referenceId: batch.id,
      });
    }
  }

  async checkVaccinationDue(teamId: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const vaccinations = await this.prisma.vaccination.findMany({
      where: {
        flock: { teamId, deletedAt: null, status: FlockStatus.ACTIVE },
        scheduledDate: new Date(tomorrowDate),
        isDone: false,
      },
      include: { flock: { select: { name: true } } },
    });

    for (const vacc of vaccinations) {
      await this.createAlertIfNotExists(teamId, AlertType.VACCINATION_DUE, AlertPriority.HIGH, {
        title: `Vaccination a faire : ${vacc.vaccineName}`,
        message: `Le vaccin ${vacc.vaccineName} pour le lot ${vacc.flock.name} est prevu pour demain`,
        referenceId: vacc.id,
      });
    }
  }

  async checkHighMortality(teamId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const flocks = await this.prisma.flock.findMany({
      where: { teamId, deletedAt: null, status: FlockStatus.ACTIVE },
    });

    for (const flock of flocks) {
      const records = await this.prisma.dailyRecord.findMany({
        where: { flockId: flock.id, date: { gte: sevenDaysAgo } },
      });

      const totalMortality = records.reduce((sum, r) => sum + r.mortalityCount, 0);
      const mortalityRate = flock.initialTotal > 0 ? (totalMortality / flock.initialTotal) * 100 : 0;

      if (mortalityRate > 2) {
        await this.createAlertIfNotExists(teamId, AlertType.HIGH_MORTALITY, AlertPriority.HIGH, {
          title: `Mortalite anormale : ${flock.name}`,
          message: `Taux de mortalite de ${mortalityRate.toFixed(1)}% sur 7 jours pour le lot ${flock.name}`,
          referenceId: flock.id,
        });
      }
    }
  }

  async checkLowLayingRate(teamId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const flocks = await this.prisma.flock.findMany({
      where: {
        teamId, deletedAt: null, status: FlockStatus.ACTIVE,
        type: { in: [FlockType.BREEDER, FlockType.LAYER, FlockType.QUAIL] },
      },
      include: { team: { select: { targetLayingRate: true } } },
    });

    for (const flock of flocks) {
      const records = await this.prisma.dailyRecord.findMany({
        where: { flockId: flock.id, date: { gte: sevenDaysAgo } },
      });

      if (records.length === 0) continue;

      const totalEggs = records.reduce((sum, r) => sum + (r.eggsLaid || 0), 0);
      const females = flock.currentFemales || flock.currentTotal;
      if (females <= 0 || records.length === 0) continue;

      const layingRate = (totalEggs / (females * records.length)) * 100;
      const target = flock.targetLayingRate || flock.team.targetLayingRate;

      if (layingRate < target - 10) {
        await this.createAlertIfNotExists(teamId, AlertType.LOW_LAYING_RATE, AlertPriority.MEDIUM, {
          title: `Taux de ponte bas : ${flock.name}`,
          message: `Taux de ponte de ${layingRate.toFixed(1)}% (objectif: ${target}%) pour le lot ${flock.name}`,
          referenceId: flock.id,
        });
      }
    }
  }

  async checkOldDebts(teamId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await this.prisma.sale.findMany({
      where: {
        teamId,
        deletedAt: null,
        paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL] },
        date: { lte: thirtyDaysAgo },
      },
      include: { customer: { select: { firstName: true, lastName: true } } },
    });

    for (const sale of sales) {
      const customerName = sale.customer
        ? `${sale.customer.firstName} ${sale.customer.lastName}`
        : 'Client inconnu';

      await this.createAlertIfNotExists(teamId, AlertType.OLD_DEBT, AlertPriority.LOW, {
        title: `Creance ancienne : ${customerName}`,
        message: `Vente de ${sale.totalAmount} FCFA du ${sale.date.toISOString().split('T')[0]} impayee depuis plus de 30 jours`,
        referenceId: sale.id,
      });
    }
  }

  async checkMissingRecords(teamId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const activeFlocks = await this.prisma.flock.findMany({
      where: { teamId, deletedAt: null, status: FlockStatus.ACTIVE },
    });

    for (const flock of activeFlocks) {
      const record = await this.prisma.dailyRecord.findUnique({
        where: { flockId_date: { flockId: flock.id, date: new Date(yesterdayDate) } },
      });

      if (!record) {
        await this.createAlertIfNotExists(teamId, AlertType.MISSING_RECORD, AlertPriority.LOW, {
          title: `Saisie manquante : ${flock.name}`,
          message: `Aucune saisie quotidienne pour le lot ${flock.name} hier`,
          referenceId: flock.id,
        });
      }
    }
  }

  async checkSlaughterDue(teamId: string) {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const flocks = await this.prisma.flock.findMany({
      where: {
        teamId,
        deletedAt: null,
        status: FlockStatus.ACTIVE,
        type: FlockType.BROILER,
        expectedEndDate: { lte: sevenDaysFromNow, gte: new Date() },
      },
    });

    for (const flock of flocks) {
      await this.createAlertIfNotExists(teamId, AlertType.SLAUGHTER_DUE, AlertPriority.MEDIUM, {
        title: `Abattage prevu : ${flock.name}`,
        message: `Le lot ${flock.name} arrive a terme dans les 7 prochains jours`,
        referenceId: flock.id,
      });
    }
  }

  async checkOrdersDue(teamId: string) {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const orders = await this.prisma.order.findMany({
      where: {
        teamId,
        status: OrderStatus.CONFIRMED,
        requestedDate: { lte: threeDaysFromNow, gte: new Date() },
      },
      include: { customer: { select: { firstName: true, lastName: true } } },
    });

    for (const order of orders) {
      await this.createAlertIfNotExists(teamId, AlertType.ORDER_DUE, AlertPriority.MEDIUM, {
        title: `Commande a livrer`,
        message: `Commande de ${order.quantity} ${order.productType} pour ${order.customer.firstName} ${order.customer.lastName} a livrer prochainement`,
        referenceId: order.id,
      });
    }
  }

  private async createAlertIfNotExists(
    teamId: string,
    type: AlertType,
    priority: AlertPriority,
    data: { title: string; message: string; referenceId?: string },
  ) {
    // Eviter les doublons: verifier si une alerte similaire existe dans les 24h
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const existing = await this.prisma.alert.findFirst({
      where: {
        teamId,
        type,
        referenceId: data.referenceId,
        isDismissed: false,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (existing) return;

    await this.prisma.alert.create({
      data: {
        teamId,
        type,
        priority,
        title: data.title,
        message: data.message,
        referenceId: data.referenceId,
      },
    });
  }
}
