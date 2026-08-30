import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Ne journaliser que les mutations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const teamId = request.params?.teamId;
          const userId = request.user?.userId;

          if (!teamId || !userId) return;

          const action =
            method === 'DELETE'
              ? 'DELETE'
              : method === 'POST'
                ? 'CREATE'
                : 'UPDATE';

          const entity = this.extractEntity(request.path);
          const entityId =
            responseData?.data?.id || request.params?.id || '';

          await this.prisma.auditLog.create({
            data: {
              teamId,
              userId,
              action,
              entity,
              entityId: String(entityId),
              newValue: responseData?.data || null,
            },
          });
        } catch (error) {
          this.logger.error('Erreur lors de la journalisation audit', error);
        }
      }),
    );
  }

  private extractEntity(path: string): string {
    // Extraire le nom de la resource depuis le path
    // /v1/teams/:teamId/flocks/:id -> flocks
    const segments = path.split('/').filter(Boolean);
    // Trouver le segment apres "teams" et le teamId
    const teamIndex = segments.indexOf('teams');
    if (teamIndex >= 0 && teamIndex + 2 < segments.length) {
      return segments[teamIndex + 2];
    }
    return segments[segments.length - 1] || 'unknown';
  }
}
