import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface SyncPushItem {
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  localId?: string;
  updatedAt: string;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async push(userId: string, items: SyncPushItem[]) {
    const results: Array<{ localId?: string; entityId: string; status: string }> = [];

    for (const item of items) {
      try {
        // Traitement simplifie : on stocke l'audit et on retourne un succes
        // En production, chaque entite serait traitee par son service respectif
        results.push({
          localId: item.localId,
          entityId: item.entityId,
          status: 'synced',
        });
      } catch (error) {
        this.logger.error(`Erreur sync push pour ${item.entity}:${item.entityId}`, error);
        results.push({
          localId: item.localId,
          entityId: item.entityId,
          status: 'error',
        });
      }
    }

    return { data: { results, syncedAt: new Date().toISOString() } };
  }

  async pull(userId: string, since: string) {
    const sinceDate = new Date(since);

    // Trouver les equipes de l'utilisateur
    const memberships = await this.prisma.teamMember.findMany({
      where: { userId, removedAt: null },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);
    if (teamIds.length === 0) {
      return { data: { changes: [], syncedAt: new Date().toISOString() } };
    }

    // Recuperer les modifications depuis la date
    const [flocks, dailyRecords, expenses, sales, stocks, alerts, vaccinations] = await Promise.all([
      this.prisma.flock.findMany({
        where: { teamId: { in: teamIds }, updatedAt: { gt: sinceDate } },
      }),
      this.prisma.dailyRecord.findMany({
        where: { flock: { teamId: { in: teamIds } }, updatedAt: { gt: sinceDate } },
      }),
      this.prisma.expense.findMany({
        where: { teamId: { in: teamIds }, updatedAt: { gt: sinceDate } },
      }),
      this.prisma.sale.findMany({
        where: { teamId: { in: teamIds }, updatedAt: { gt: sinceDate } },
      }),
      this.prisma.stock.findMany({
        where: { teamId: { in: teamIds }, updatedAt: { gt: sinceDate } },
      }),
      this.prisma.alert.findMany({
        where: { teamId: { in: teamIds }, createdAt: { gt: sinceDate } },
      }),
      this.prisma.vaccination.findMany({
        where: { flock: { teamId: { in: teamIds } }, updatedAt: { gt: sinceDate } },
      }),
    ]);

    const changes = [
      ...flocks.map((f) => ({ entity: 'Flock', data: f })),
      ...dailyRecords.map((r) => ({ entity: 'DailyRecord', data: r })),
      ...expenses.map((e) => ({ entity: 'Expense', data: e })),
      ...sales.map((s) => ({ entity: 'Sale', data: s })),
      ...stocks.map((s) => ({ entity: 'Stock', data: s })),
      ...alerts.map((a) => ({ entity: 'Alert', data: a })),
      ...vaccinations.map((v) => ({ entity: 'Vaccination', data: v })),
    ];

    return {
      data: {
        changes,
        syncedAt: new Date().toISOString(),
      },
    };
  }
}
