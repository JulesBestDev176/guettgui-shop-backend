import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { DeliveryService } from "./delivery.service";

@ApiTags("delivery")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("DELIVERY", "ADMIN")
@Controller("delivery")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get("available")
  available() {
    return this.deliveryService.available();
  }
}
