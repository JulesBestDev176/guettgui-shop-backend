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
import { UserRole } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Catégories')
@Controller('categories')
export class CategoriesController {
  constructor(private cats: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les catégories (avec sous-catégories)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  findAll(@Query('all') all?: string) {
    return this.cats.findAll(all !== 'true');
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Détail catégorie' })
  findBySlug(@Param('slug') slug: string) {
    return this.cats.findBySlug(slug);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Créer une catégorie [ADMIN]' })
  create(@Body() dto: CreateCategoryDto) {
    return this.cats.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une catégorie [ADMIN]' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.cats.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une catégorie [ADMIN]' })
  remove(@Param('id') id: string) {
    return this.cats.remove(id);
  }
}
