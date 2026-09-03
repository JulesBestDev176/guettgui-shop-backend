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

  @Post("seller-applications")
  createApplication(@Body() dto: CreateSellerApplicationDto) {
    return this.sellersService.createApplication(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/dashboard")
  dashboard() {
    return this.sellersService.dashboard();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/products")
  products() {
    return this.sellersService.listProducts();
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
  deliveryZones() {
    return this.sellersService.listDeliveryZones();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Post("seller/delivery-zones")
  createDeliveryZone(@Body() dto: CreateDeliveryZoneDto) {
    return this.sellersService.createDeliveryZone(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Patch("seller/delivery-zones/:id/toggle")
  toggleDeliveryZone(@Param("id") id: string) {
    return this.sellersService.toggleDeliveryZone(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SELLER")
  @Get("seller/stats")
  stats() {
    return this.sellersService.stats();
  }
}
