import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Favoris')
@Controller('favorites')
export class FavoritesController {
  constructor(private favorites: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Mes favoris' })
  findMine(@CurrentUser() user: { id: string }) {
    return this.favorites.findMine(user.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Ajouter/retirer un favori (toggle)' })
  toggle(@Param('productId') productId: string, @CurrentUser() user: { id: string }) {
    return this.favorites.toggle(user.id, productId);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Vérifier si un produit est en favori' })
  check(@Param('productId') productId: string, @CurrentUser() user: { id: string }) {
    return this.favorites.isFavorited(user.id, productId);
  }
}
