import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthUser } from "../../common/types/auth-user";
import { FavoritesService } from "./favorites.service";

@ApiTags("favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.favoritesService.listFavorites(user.id);
  }

  @Post(":productId")
  add(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.favoritesService.addFavorite(user.id, productId);
  }

  @Delete(":productId")
  remove(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.favoritesService.removeFavorite(user.id, productId);
  }
}
