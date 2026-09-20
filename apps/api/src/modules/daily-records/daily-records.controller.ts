import {
  Controller, Get, Post, Patch,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DailyRecordsService } from './daily-records.service';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { UpdateDailyRecordDto } from './dto/update-daily-record.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('teams/:teamId/daily-records')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('DailyRecords')
@ApiBearerAuth()
export class DailyRecordsController {
  constructor(private readonly dailyRecordsService: DailyRecordsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Saisir un enregistrement quotidien' })
  create(
    @Param('teamId') teamId: string,
    @Body() dto: CreateDailyRecordDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.dailyRecordsService.create(teamId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Historique des saisies quotidiennes' })
  findAll(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('flockId') flockId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dailyRecordsService.findAll(teamId, pagination, flockId, dateFrom, dateTo);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Corriger une saisie quotidienne' })
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDailyRecordDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.dailyRecordsService.update(teamId, id, dto, userId);
  }
}
