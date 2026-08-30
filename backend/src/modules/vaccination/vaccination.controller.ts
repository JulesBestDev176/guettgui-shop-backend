import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VaccinationService } from './vaccination.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { MarkDoneDto } from './dto/mark-done.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FlockType } from '@prisma/client';

@Controller('teams/:teamId')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Vaccination')
@ApiBearerAuth()
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

  @Post('vaccination-protocols')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer un protocole de vaccination' })
  createProtocol(@Param('teamId') teamId: string, @Body() dto: CreateProtocolDto) {
    return this.vaccinationService.createProtocol(teamId, dto);
  }

  @Get('vaccination-protocols')
  @ApiOperation({ summary: 'Liste des protocoles de vaccination' })
  findAllProtocols(
    @Param('teamId') teamId: string,
    @Query('flockType') flockType?: FlockType,
  ) {
    return this.vaccinationService.findAllProtocols(teamId, flockType);
  }

  @Delete('vaccination-protocols/:id')
  @ApiOperation({ summary: 'Supprimer un protocole de vaccination' })
  deleteProtocol(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.vaccinationService.deleteProtocol(teamId, id);
  }

  @Get('vaccinations')
  @ApiOperation({ summary: 'Calendrier des vaccinations' })
  findAllVaccinations(
    @Param('teamId') teamId: string,
    @Query('flockId') flockId?: string,
  ) {
    return this.vaccinationService.findAllVaccinations(teamId, flockId);
  }

  @Patch('vaccinations/:id/done')
  @ApiOperation({ summary: 'Marquer une vaccination comme faite' })
  markDone(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: MarkDoneDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.vaccinationService.markDone(teamId, id, dto, userId);
  }
}
