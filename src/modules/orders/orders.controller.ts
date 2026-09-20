import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Commandes')
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Passer une commande (visiteur ou connecté)' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user?: { id: string }) {
    return this.orders.create(dto, user?.id);
  }

  @Public()
  @Get('track/:code')
  @ApiOperation({ summary: 'Suivre une commande par code' })
  trackByCode(@Param('code') code: string) {
    return this.orders.findByCode(code);
  }

  @Get('me')
  @ApiOperation({ summary: 'Mes commandes (client)' })
  findMyOrders(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orders.findMyOrders(
      user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('shop')
  @ApiOperation({ summary: 'Commandes de ma boutique' })
  findShopOrders(
    @CurrentUser() user: { id: string },
    @Query('status') status?: OrderStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orders.findShopOrders(
      user.id,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(id, user.id, dto);
  }
}
