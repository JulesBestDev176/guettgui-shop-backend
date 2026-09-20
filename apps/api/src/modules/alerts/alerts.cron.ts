import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsService } from './alerts.service';
import { FlockStatus } from '@prisma/client';

@Injectable()
export class AlertsCronService {
  private readonly logger = new Logger(AlertsCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async generateAlerts() {
    this.logger.log('Debut de la generation des alertes...');

    const teams = await this.prisma.team.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    for (const team of teams) {
      try {
        await Promise.all([
          this.alertsService.checkLowStock(team.id),
          this.alertsService.checkCandlingDue(team.id),
          this.alertsService.checkHatchDue(team.id),
          this.alertsService.checkVaccinationDue(team.id),
          this.alertsService.checkHighMortality(team.id),
          this.alertsService.checkLowLayingRate(team.id),
          this.alertsService.checkOldDebts(team.id),
          this.alertsService.checkMissingRecords(team.id),
          this.alertsService.checkSlaughterDue(team.id),
          this.alertsService.checkOrdersDue(team.id),
        ]);
      } catch (error) {
        this.logger.error(`Erreur generation alertes pour equipe ${team.id}`, error);
      }
    }

    this.logger.log('Generation des alertes terminee');
  }

  @Cron('0 3 * * 0')
  async autoArchiveFlocks() {
    this.logger.log('Archivage automatique des lots termines...');

    const threshold = new Date(Date.now() - 90 * 24 * 3600 * 1000);

    const result = await this.prisma.flock.updateMany({
      where: {
        status: FlockStatus.COMPLETED,
        endDate: { lt: threshold },
      },
      data: { status: FlockStatus.ARCHIVED },
    });

    this.logger.log(`${result.count} lot(s) archive(s)`);
  }
}
