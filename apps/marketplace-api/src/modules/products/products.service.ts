import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  basePrice: true,
  unit: true,
  stock: true,
  status: true,
  badge: true,
  featured: true,
  ratingAvg: true,
  reviewCount: true,
  viewCount: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  shop: { select: { id: true, name: true, slug: true, verified: true, avatarUrl: true } },
  images: { orderBy: { sortOrder: 'asc' as const }, select: { id: true, url: true, sortOrder: true } },
  priceOptions: { select: { id: true, label: true, price: true, stock: true } },
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    categoryId?: string;
    shopSlug?: string;
    featured?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
  }) {
    const {
      categoryId,
      shopSlug,
      featured,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sort = 'newest',
    } = params;

    const skip = (page - 1) * limit;
    const where: any = { status: ProductStatus.ACTIVE, deletedAt: null };

    if (categoryId) where.categoryId = categoryId;
    if (shopSlug) where.shop = { slug: shopSlug };
    if (featured !== undefined) where.featured = featured;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    const orderBy =
      sort === 'price_asc' ? { basePrice: 'asc' as const }
      : sort === 'price_desc' ? { basePrice: 'desc' as const }
      : sort === 'rating' ? { ratingAvg: 'desc' as const }
      : { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy, select: PRODUCT_SELECT }),
      this.prisma.product.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        ...PRODUCT_SELECT,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { fullName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new NotFoundException('Produit introuvable');
    }

    // increment view count (fire-and-forget)
    this.prisma.product.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return product;
  }

  async findMine(userId: string, page = 1, limit = 20) {
    const shop = await this.prisma.shop.findUniqueOrThrow({ where: { userId }, select: { id: true } });
    const skip = (page - 1) * limit;
    const where = { shopId: shop.id, deletedAt: null };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: PRODUCT_SELECT }),
      this.prisma.product.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async create(userId: string, dto: CreateProductDto) {
    const shop = await this.prisma.shop.findUniqueOrThrow({ where: { userId }, select: { id: true } });
    const { priceOptions, ...rest } = dto;
    const slug = await this.uniqueSlug(slugify(dto.name, { lower: true, strict: true }));

    return this.prisma.product.create({
      data: {
        ...rest,
        slug,
        shopId: shop.id,
        ...(priceOptions?.length && {
          priceOptions: { create: priceOptions },
        }),
      },
      select: PRODUCT_SELECT,
    });
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    await this.assertOwner(id, userId);
    const { priceOptions, ...rest } = dto;
    const data: any = { ...rest };
    if (dto.name) {
      data.slug = await this.uniqueSlug(slugify(dto.name, { lower: true, strict: true }), id);
    }

    if (priceOptions) {
      await this.prisma.priceOption.deleteMany({ where: { productId: id } });
      data.priceOptions = { create: priceOptions };
    }

    return this.prisma.product.update({ where: { id }, data, select: PRODUCT_SELECT });
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: ProductStatus.SUSPENDED },
    });
  }

  async addImage(id: string, userId: string, url: string, sortOrder = 0) {
    await this.assertOwner(id, userId);
    return this.prisma.productImage.create({ data: { productId: id, url, sortOrder } });
  }

  async removeImage(imageId: string, userId: string) {
    const image = await this.prisma.productImage.findUniqueOrThrow({ where: { id: imageId }, include: { product: { select: { shopId: true } } } });
    const shop = await this.prisma.shop.findUniqueOrThrow({ where: { userId }, select: { id: true } });
    if (image.product.shopId !== shop.id) throw new ForbiddenException();
    return this.prisma.productImage.delete({ where: { id: imageId } });
  }

  private async assertOwner(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId }, select: { shop: { select: { userId: true } } } });
    if (!product) throw new NotFoundException('Produit introuvable');
    if (product.shop.userId !== userId) throw new ForbiddenException('Non autorisé');
    return product;
  }

  private async uniqueSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base;
    let i = 1;
    while (true) {
      const existing = await this.prisma.product.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${base}-${i++}`;
    }
    return slug;
  }
}
