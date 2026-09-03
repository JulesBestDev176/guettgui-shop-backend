import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AdminService } from "./admin.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("summary")
  summary() {
    return this.adminService.getSummary();
  }

  @Get("sellers")
  sellers() {
    return this.adminService.listSellers();
  }

  @Patch("sellers/:id/approve")
  approveSeller(@Param("id") id: string) {
    return this.adminService.approveSeller(id);
  }

  @Patch("sellers/:id/reject")
  rejectSeller(@Param("id") id: string) {
    return this.adminService.rejectSeller(id);
  }

  @Get("categories")
  categories() {
    return this.adminService.listCategories();
  }

  @Post("categories")
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }
}
