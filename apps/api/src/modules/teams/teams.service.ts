import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RelayioService } from '../notifications/relayio.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { StockType } from '@prisma/client';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly relayioService: RelayioService,
  ) {}

  async create(dto: CreateTeamDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Creer l'equipe
      const team = await tx.team.create({
        data: {
          name: dto.name,
          location: dto.location,
          currency: dto.currency || 'XOF',
          targetLayingRate: dto.targetLayingRate ?? 70,
          targetFertility: dto.targetFertility ?? 85,
          targetHatchRate: dto.targetHatchRate ?? 82,
        },
      });

      // Ajouter le createur comme OWNER
      await tx.teamMember.create({
        data: {
          userId,
          teamId: team.id,
          role: 'OWNER',
        },
      });

      // Creer les stocks initiaux
      const stockDefs = [
        { type: StockType.LAYER_FEED, name: 'Aliment ponte', currentQty: 0, unit: 'kg', alertThreshold: 50 },
        { type: StockType.BROILER_FEED, name: 'Aliment croissance', currentQty: 0, unit: 'kg', alertThreshold: 50 },
        { type: StockType.MILLET, name: 'Mil', currentQty: 0, unit: 'kg', alertThreshold: 25 },
        { type: StockType.SUPPLEMENT, name: 'Complements/vitamines', currentQty: 0, unit: 'unite', alertThreshold: 2 },
        { type: StockType.VACCINE, name: 'Vaccins', currentQty: 0, unit: 'dose', alertThreshold: 50 },
        { type: StockType.MEDICATION, name: 'Medicaments', currentQty: 0, unit: 'unite', alertThreshold: 2 },
        { type: StockType.EMPTY_TRAYS, name: 'Tablettes vides', currentQty: 0, unit: 'unite', alertThreshold: 10 },
        { type: StockType.EGGS, name: 'Stock oeufs', currentQty: 0, unit: 'oeuf', alertThreshold: 30 },
      ];

      for (const stock of stockDefs) {
        await tx.stock.create({ data: { teamId: team.id, ...stock } });
      }

      return team;
    });
  }

  async findOne(teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, deletedAt: null },
      include: {
        members: {
          where: { removedAt: null },
          include: { user: { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } } },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Equipe introuvable');
    }

    return team;
  }

  async update(teamId: string, dto: UpdateTeamDto) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, deletedAt: null },
    });

    if (!team) {
      throw new NotFoundException('Equipe introuvable');
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: dto,
    });
  }

  async join(dto: JoinTeamDto, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { inviteCode: dto.inviteCode },
    });

    if (!team || team.deletedAt) {
      throw new NotFoundException('Code d\'invitation invalide');
    }

    // Verifier si deja membre
    const existing = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId: team.id } },
    });

    if (existing && !existing.removedAt) {
      throw new ConflictException('Vous etes deja membre de cette equipe');
    }

    // Verifier le nombre de membres (max 5)
    const memberCount = await this.prisma.teamMember.count({
      where: { teamId: team.id, removedAt: null },
    });

    if (memberCount >= 5) {
      throw new BadRequestException('L\'equipe a atteint le nombre maximum de membres (5)');
    }

    if (existing && existing.removedAt) {
      // Re-activer le membre
      return this.prisma.teamMember.update({
        where: { id: existing.id },
        data: { removedAt: null, role: 'MEMBER' },
        include: { team: true },
      });
    }

    return this.prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: 'MEMBER',
      },
      include: { team: true },
    });
  }

  async getMembers(teamId: string) {
    return this.prisma.teamMember.findMany({
      where: { teamId, removedAt: null },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async removeMember(teamId: string, memberId: string, requestingUserId: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id: memberId, teamId, removedAt: null },
    });

    if (!member) {
      throw new NotFoundException('Membre introuvable');
    }

    if (member.userId === requestingUserId) {
      throw new ForbiddenException('Vous ne pouvez pas vous retirer vous-meme');
    }

    if (member.role === 'OWNER') {
      throw new ForbiddenException('Impossible de retirer le proprietaire');
    }

    return this.prisma.teamMember.update({
      where: { id: memberId },
      data: { removedAt: new Date() },
    });
  }

  async regenerateInviteCode(teamId: string) {
    const newCode = this.generateInviteCode();

    return this.prisma.team.update({
      where: { id: teamId },
      data: { inviteCode: newCode },
      select: { id: true, inviteCode: true },
    });
  }

  /**
   * Invite un membre par numero de telephone.
   * Genere un code d'invitation et l'envoie par WhatsApp si RelayIO est configure.
   * Sinon, retourne le code pour partage manuel.
   */
  async inviteMember(teamId: string, phone: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, deletedAt: null },
    });

    if (!team) {
      throw new NotFoundException('Equipe introuvable');
    }

    // Utiliser le code existant ou en generer un nouveau
    let inviteCode = team.inviteCode;
    if (!inviteCode) {
      inviteCode = this.generateInviteCode();
      await this.prisma.team.update({
        where: { id: teamId },
        data: { inviteCode },
      });
    }

    // Tenter l'envoi par WhatsApp via RelayIO
    let sentViaWhatsApp = false;
    if (this.relayioService.isConfigured()) {
      try {
        await this.relayioService.sendInviteCode(phone, inviteCode, team.name);
        sentViaWhatsApp = true;
        this.logger.log(`Invitation envoyee par WhatsApp a ${phone} pour l'equipe ${team.name}`);
      } catch (error) {
        this.logger.error(`Echec envoi WhatsApp a ${phone}: ${error.message}`);
      }
    } else {
      this.logger.log(
        `RelayIO non configure — code d'invitation ${inviteCode} a partager manuellement avec ${phone}`,
      );
    }

    return {
      inviteCode,
      teamName: team.name,
      phone,
      sentViaWhatsApp,
    };
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
