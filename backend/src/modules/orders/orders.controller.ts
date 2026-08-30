import {
  Controller, Get, Post, Patch,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';

@Controller('teams/:teamId/orders')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer une commande' })
  create(
    @Param('teamId') teamId: string,
    @Body() dto: CreateOrderDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.ordersService.create(teamId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des commandes' })
  findAll(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(teamId, pagination, status);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Changer le statut d\'une commande' })
  updateStatus(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.ordersService.updateStatus(teamId, id, dto, userId);
  }
}
