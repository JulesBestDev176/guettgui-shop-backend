import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const teamId = request.params?.teamId || request.body?.teamId;

    if (!userId || !teamId) {
      throw new ForbiddenException('Acces refuse');
    }

    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!member || member.removedAt) {
      throw new ForbiddenException('Vous n\'etes pas membre de cette equipe');
    }

    request.teamMember = member;
    return true;
  }
}
