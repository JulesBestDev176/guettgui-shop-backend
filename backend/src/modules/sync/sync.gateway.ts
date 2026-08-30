import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({ namespace: '/sync', cors: true })
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SyncGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Trouver les equipes de l'utilisateur
      const memberships = await this.prisma.teamMember.findMany({
        where: { userId, removedAt: null },
        select: { teamId: true },
      });

      // Rejoindre les rooms des equipes
      for (const membership of memberships) {
        client.join(`team:${membership.teamId}`);
      }

      (client as unknown as { userId: string }).userId = userId;
      this.logger.log(`Client connecte: ${userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client deconnecte`);
  }

  notifyTeam(teamId: string, event: string, data: unknown) {
    this.server.to(`team:${teamId}`).emit(event, data);
  }
}
