import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/types/auth-user";
import { CreateDeliveryZoneDto } from "./dto/create-delivery-zone.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateSellerApplicationDto } from "./dto/create-seller-application.dto";
import { SellersService } from "./sellers.service";

@ApiTags("sellers")
@Controller()
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("seller-applications")
  createApplication(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSellerApplicationDto,
  ) {
    return this.sellersService.createApplication(dto, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/dashboard")
  dashboard(@CurrentUser() user: AuthUser) {
    return this.sellersService.dashboard(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/products")
  products(@CurrentUser() user: AuthUser) {
    return this.sellersService.listProducts(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Post("seller/products")
  createProduct(@CurrentUser() user: AuthUser, @Body() dto: CreateProductDto) {
    return this.sellersService.createProduct(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/delivery-zones")
  deliveryZones(@CurrentUser() user: AuthUser) {
    return this.sellersService.listDeliveryZones(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Post("seller/delivery-zones")
  createDeliveryZone(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateDeliveryZoneDto,
  ) {
    return this.sellersService.createDeliveryZone(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Patch("seller/delivery-zones/:id/toggle")
  toggleDeliveryZone(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.sellersService.toggleDeliveryZone(user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/stats")
  stats(@CurrentUser() user: AuthUser) {
    return this.sellersService.stats(user.id);
  }
}
