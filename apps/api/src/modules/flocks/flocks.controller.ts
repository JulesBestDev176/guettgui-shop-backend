import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FlocksService } from './flocks.service';
import { CreateFlockDto } from './dto/create-flock.dto';
import { UpdateFlockDto } from './dto/update-flock.dto';
import { CloseFlockDto } from './dto/close-flock.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FlockType, FlockStatus } from '@prisma/client';

@Controller('teams/:teamId/flocks')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Flocks')
@ApiBearerAuth()
export class FlocksController {
  constructor(private readonly flocksService: FlocksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer un lot' })
  create(
    @Param('teamId') teamId: string,
    @Body() dto: CreateFlockDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.flocksService.create(teamId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des lots' })
  findAll(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('type') type?: FlockType,
    @Query('status') status?: FlockStatus,
  ) {
    return this.flocksService.findAll(teamId, pagination, type, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail d\'un lot' })
  findOne(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.flocksService.findOne(teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un lot' })
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFlockDto,
  ) {
    return this.flocksService.update(teamId, id, dto);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cloturer un lot' })
  close(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: CloseFlockDto,
  ) {
    return this.flocksService.close(teamId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un lot (soft delete)' })
  remove(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.flocksService.remove(teamId, id);
  }
}
