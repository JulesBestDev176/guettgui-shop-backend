import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { RelayioService } from './relayio.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService,
    private readonly relayioService: RelayioService,
  ) {}

  async sendAlert(teamId: string, alert: { id: string; type: string; title: string; message: string; priority: string }) {
    const members = await this.prisma.teamMember.findMany({
      where: { teamId, removedAt: null },
      include: { user: true },
    });

    await Promise.all(
      members.map(async (member) => {
        // Push notification (FCM)
        if (member.user.fcmToken) {
          await this.fcmService.send(member.user.fcmToken, {
            title: alert.title,
            body: alert.message,
            data: { alertId: alert.id, type: alert.type },
          });
        }

        // WhatsApp (Relayio) pour les alertes critiques
        if (alert.priority === 'HIGH' && member.user.phone) {
          await this.relayioService.sendNotification(member.user.phone, 'farm_alert', {
            title: alert.title,
            message: alert.message,
          });
        }
      }),
    );
  }
}
