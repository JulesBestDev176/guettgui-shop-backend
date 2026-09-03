import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/types/auth-user";
import { CheckoutDto } from "./dto/checkout.dto";
import { OrdersService } from "./orders.service";

@ApiTags("orders")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("checkout")
  checkout(@Body() dto: CheckoutDto) {
    return this.ordersService.checkout(dto);
  }

  @Post("quick-orders")
  quickOrder(@Body() dto: CheckoutDto) {
    return this.ordersService.checkout(dto);
  }

  @Get("orders/track")
  track(@Query("code") code: string, @Query("phone") phone: string) {
    return this.ordersService.track(code, phone);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("orders")
  orders(@CurrentUser() user: AuthUser) {
    return this.ordersService.list(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("orders/:id")
  order(@Param("id") id: string) {
    return this.ordersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/orders")
  sellerOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.listSellerOrders(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/orders/:id")
  sellerOrder(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.ordersService.getSellerOrder(user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Patch("seller/orders/:id/preparing")
  markPreparing(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.ordersService.markPreparing(user.id, id);
  }
}
