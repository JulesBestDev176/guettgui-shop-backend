import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';

@Controller('teams/:teamId/reports')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Rapport journalier' })
  getDailyReport(
    @Param('teamId') teamId: string,
    @Query('date') date: string,
  ) {
    return this.reportsService.getDailyReport(teamId, date);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Rapport hebdomadaire' })
  getWeeklyReport(
    @Param('teamId') teamId: string,
    @Query('week') week: string,
  ) {
    return this.reportsService.getWeeklyReport(teamId, week);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Rapport mensuel' })
  getMonthlyReport(
    @Param('teamId') teamId: string,
    @Query('month') month: string,
  ) {
    return this.reportsService.getMonthlyReport(teamId, month);
  }

  @Get('flock/:flockId')
  @ApiOperation({ summary: 'Bilan d\'un lot' })
  getFlockReport(
    @Param('teamId') teamId: string,
    @Param('flockId') flockId: string,
  ) {
    return this.reportsService.getFlockReport(teamId, flockId);
  }
}
