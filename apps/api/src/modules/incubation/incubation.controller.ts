import {
  Controller, Get, Post, Patch,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IncubationService } from './incubation.service';
import { CreateIncubatorDto } from './dto/create-incubator.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Candling1Dto, Candling2Dto } from './dto/candling.dto';
import { HatchResultDto } from './dto/hatch-result.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IncubationStatus } from '@prisma/client';

@Controller('teams/:teamId')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Incubation')
@ApiBearerAuth()
export class IncubationController {
  constructor(private readonly incubationService: IncubationService) {}

  // ─── Incubators ─────────────────────────────────────

  @Post('incubators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une couveuse' })
  createIncubator(
    @Param('teamId') teamId: string,
    @Body() dto: CreateIncubatorDto,
  ) {
    return this.incubationService.createIncubator(teamId, dto);
  }

  @Get('incubators')
  @ApiOperation({ summary: 'Liste des couveuses' })
  findAllIncubators(@Param('teamId') teamId: string) {
    return this.incubationService.findAllIncubators(teamId);
  }

  // ─── Batches ────────────────────────────────────────

  @Post('incubation-batches')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer un lot de couveuse' })
  createBatch(
    @Param('teamId') teamId: string,
    @Body() dto: CreateBatchDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.incubationService.createBatch(teamId, dto, userId);
  }

  @Get('incubation-batches')
  @ApiOperation({ summary: 'Liste des lots de couveuse' })
  findAllBatches(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('status') status?: IncubationStatus,
  ) {
    return this.incubationService.findAllBatches(teamId, pagination, status);
  }

  @Patch('incubation-batches/:id/candling-1')
  @ApiOperation({ summary: 'Saisir le mirage J7' })
  candling1(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: Candling1Dto,
  ) {
    return this.incubationService.candling1(teamId, id, dto);
  }

  @Patch('incubation-batches/:id/candling-2')
  @ApiOperation({ summary: 'Saisir le mirage J14' })
  candling2(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: Candling2Dto,
  ) {
    return this.incubationService.candling2(teamId, id, dto);
  }

  @Patch('incubation-batches/:id/hatch')
  @ApiOperation({ summary: 'Saisir le resultat d\'eclosion' })
  hatch(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: HatchResultDto,
  ) {
    return this.incubationService.hatch(teamId, id, dto);
  }
}
