import {
  Controller, Get, Patch, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';

@Controller('teams/:teamId/alerts')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Alerts')
@ApiBearerAuth()
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des alertes' })
  findAll(@Param('teamId') teamId: string, @Query() pagination: PaginationDto) {
    return this.alertsService.findAll(teamId, pagination);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une alerte comme lue' })
  markAsRead(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.alertsService.markAsRead(teamId, id);
  }

  @Patch(':id/dismiss')
  @ApiOperation({ summary: 'Fermer une alerte' })
  dismiss(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.alertsService.dismiss(teamId, id);
  }
}
