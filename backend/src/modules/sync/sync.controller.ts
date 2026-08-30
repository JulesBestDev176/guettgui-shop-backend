import {
  Controller, Get, Post, Body, Query,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiTags('Sync')
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer les modifications locales' })
  push(
    @CurrentUser('userId') userId: string,
    @Body() body: { items: Array<{ entity: string; entityId: string; action: 'CREATE' | 'UPDATE' | 'DELETE'; payload: Record<string, unknown>; localId?: string; updatedAt: string }> },
  ) {
    return this.syncService.push(userId, body.items);
  }

  @Get('pull')
  @ApiOperation({ summary: 'Recevoir les modifications du serveur' })
  pull(
    @CurrentUser('userId') userId: string,
    @Query('since') since: string,
  ) {
    return this.syncService.pull(userId, since);
  }
}
