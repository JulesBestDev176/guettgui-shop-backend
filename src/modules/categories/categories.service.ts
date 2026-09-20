import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.category.findMany({
      where: activeOnly ? { isActive: true, parentId: null } : { parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: activeOnly ? { isActive: true } : undefined,
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, slug: true, iconUrl: true, sortOrder: true },
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const cat = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { orderBy: { sortOrder: 'asc' } },
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });
    if (!cat) throw new NotFoundException('Catégorie introuvable');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.uniqueSlug(slugify(dto.name, { lower: true, strict: true }));
    return this.prisma.category.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOrThrow(id);
    const data: any = { ...dto };
    if (dto.name) {
      data.slug = await this.uniqueSlug(
        slugify(dto.name, { lower: true, strict: true }),
        id,
      );
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOrThrow(id);
    return this.prisma.category.delete({ where: { id } });
  }

  private async findOrThrow(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Catégorie introuvable');
    return cat;
  }

  private async uniqueSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base;
    let i = 1;
    while (true) {
      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${base}-${i++}`;
    }
    return slug;
  }
}
