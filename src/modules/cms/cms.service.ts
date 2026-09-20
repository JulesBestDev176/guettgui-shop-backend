import { Injectable, NotFoundException } from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PrismaService } from '@/prisma/prisma.service';
import slugify from 'slugify';

export class CreateCmsPageDto {
  @IsString() title: string;
  @IsString() content: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

export class UpdateCmsPageDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() content?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

export class CreateFaqDto {
  @IsString() question: string;
  @IsString() answer: string;
  @IsString() @IsOptional() audience?: string;
  @IsInt() @Min(0) @IsOptional() sortOrder?: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

export class UpdateFaqDto {
  @IsString() @IsOptional() question?: string;
  @IsString() @IsOptional() answer?: string;
  @IsString() @IsOptional() audience?: string;
  @IsInt() @Min(0) @IsOptional() sortOrder?: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Pages
  getPages() {
    return this.prisma.cmsPage.findMany({ where: { isActive: true }, orderBy: { slug: 'asc' } });
  }

  async getPage(slug: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { slug } });
    if (!page) throw new NotFoundException('Page introuvable');
    return page;
  }

  async createPage(dto: CreateCmsPageDto) {
    const slug = slugify(dto.title, { lower: true, strict: true });
    return this.prisma.cmsPage.create({ data: { ...dto, slug } });
  }

  async updatePage(slug: string, dto: UpdateCmsPageDto) {
    await this.getPage(slug);
    return this.prisma.cmsPage.update({ where: { slug }, data: dto });
  }

  async deletePage(slug: string) {
    await this.getPage(slug);
    return this.prisma.cmsPage.delete({ where: { slug } });
  }

  // FAQ
  getFaqs(audience?: string) {
    return this.prisma.faqItem.findMany({
      where: {
        isActive: true,
        ...(audience ? { audience: { in: [audience, 'all'] } } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createFaq(dto: CreateFaqDto) {
    return this.prisma.faqItem.create({ data: dto });
  }

  async updateFaq(id: string, dto: UpdateFaqDto) {
    return this.prisma.faqItem.update({ where: { id }, data: dto });
  }

  async deleteFaq(id: string) {
    return this.prisma.faqItem.delete({ where: { id } });
  }
}
