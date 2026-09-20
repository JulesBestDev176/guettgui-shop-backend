import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ShopsService } from './shops.service';
import { UpdateShopDto } from './dto/create-shop.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Boutiques')
@Controller('shops')
export class ShopsController {
  constructor(private shops: ShopsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les boutiques' })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'verified', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('regionId') regionId?: string,
    @Query('verified') verified?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.shops.findAll({
      regionId,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Ma boutique' })
  findMine(@CurrentUser() user: { id: string }) {
    return this.shops.findMine(user.id);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Statistiques de ma boutique' })
  getStats(@CurrentUser() user: { id: string }) {
    return this.shops.getStats(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Modifier ma boutique' })
  update(@CurrentUser() user: { id: string }, @Body() dto: UpdateShopDto) {
    return this.shops.update(user.id, dto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Détail boutique publique' })
  findBySlug(@Param('slug') slug: string) {
    return this.shops.findBySlug(slug);
  }

  // Admin routes
  @Roles(UserRole.ADMIN)
  @Post(':id/verify')
  @ApiOperation({ summary: 'Vérifier une boutique [ADMIN]' })
  verify(@Param('id') id: string) {
    return this.shops.verify(id);
  }

  @Roles(UserRole.ADMIN)
  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspendre une boutique [ADMIN]' })
  suspend(@Param('id') id: string) {
    return this.shops.suspend(id);
  }

  @Roles(UserRole.ADMIN)
  @Post(':id/activate')
  @ApiOperation({ summary: 'Activer une boutique [ADMIN]' })
  activate(@Param('id') id: string) {
    return this.shops.activate(id);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  @ApiOperation({ summary: 'Statistiques globales plateforme [ADMIN]' })
  adminStats() {
    return this.shops.getAdminStats();
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/pending')
  @ApiOperation({ summary: 'Boutiques en attente de vérification [ADMIN]' })
  pendingShops(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.shops.getPendingShops(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
