import {
  Controller, Get, Post, Param, Query, Body,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('teams/:teamId/stocks')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Stocks')
@ApiBearerAuth()
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  @ApiOperation({ summary: 'Etat des stocks' })
  findAll(@Param('teamId') teamId: string) {
    return this.stocksService.findAll(teamId);
  }

  @Get(':id/moves')
  @ApiOperation({ summary: 'Historique des mouvements d\'un stock' })
  getMoves(
    @Param('teamId') teamId: string,
    @Param('id') stockId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.stocksService.getMoves(teamId, stockId, pagination);
  }

  @Post(':id/adjust')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Correction manuelle d\'un stock' })
  adjust(
    @Param('teamId') teamId: string,
    @Param('id') stockId: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.stocksService.adjust(teamId, stockId, dto, userId);
  }
}
