import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CmsService, CreateCmsPageDto, UpdateCmsPageDto, CreateFaqDto, UpdateFaqDto } from './cms.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private cms: CmsService) {}

  // Pages
  @Public()
  @Get('pages')
  @ApiOperation({ summary: 'Lister les pages CMS' })
  getPages() { return this.cms.getPages(); }

  @Public()
  @Get('pages/:slug')
  @ApiOperation({ summary: 'Lire une page CMS' })
  getPage(@Param('slug') slug: string) { return this.cms.getPage(slug); }

  @Roles(UserRole.ADMIN)
  @Post('pages')
  @ApiOperation({ summary: 'Créer une page CMS [ADMIN]' })
  createPage(@Body() dto: CreateCmsPageDto) { return this.cms.createPage(dto); }

  @Roles(UserRole.ADMIN)
  @Patch('pages/:slug')
  @ApiOperation({ summary: 'Modifier une page CMS [ADMIN]' })
  updatePage(@Param('slug') slug: string, @Body() dto: UpdateCmsPageDto) { return this.cms.updatePage(slug, dto); }

  @Roles(UserRole.ADMIN)
  @Delete('pages/:slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une page CMS [ADMIN]' })
  deletePage(@Param('slug') slug: string) { return this.cms.deletePage(slug); }

  // FAQ
  @Public()
  @Get('faqs')
  @ApiOperation({ summary: 'Lister la FAQ' })
  getFaqs(@Query('audience') audience?: string) { return this.cms.getFaqs(audience); }

  @Roles(UserRole.ADMIN)
  @Post('faqs')
  @ApiOperation({ summary: 'Créer une entrée FAQ [ADMIN]' })
  createFaq(@Body() dto: CreateFaqDto) { return this.cms.createFaq(dto); }

  @Roles(UserRole.ADMIN)
  @Patch('faqs/:id')
  @ApiOperation({ summary: 'Modifier une entrée FAQ [ADMIN]' })
  updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.cms.updateFaq(id, dto); }

  @Roles(UserRole.ADMIN)
  @Delete('faqs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une entrée FAQ [ADMIN]' })
  deleteFaq(@Param('id') id: string) { return this.cms.deleteFaq(id); }
}
