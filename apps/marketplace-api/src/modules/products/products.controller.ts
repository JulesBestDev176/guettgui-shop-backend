import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Produits')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les produits' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'shopSlug', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'price_asc', 'price_desc', 'rating'] })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('shopSlug') shopSlug?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    return this.products.findAll({
      categoryId,
      shopSlug,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sort: sort as any,
    });
  }

  @Get('mine')
  @ApiOperation({ summary: 'Mes produits' })
  findMine(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.products.findMine(user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Détail produit' })
  findBySlug(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un produit' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateProductDto) {
    return this.products.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un produit' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un produit' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.products.remove(id, user.id);
  }

  @Delete('images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une image produit' })
  removeImage(@Param('imageId') imageId: string, @CurrentUser() user: { id: string }) {
    return this.products.removeImage(imageId, user.id);
  }
}
