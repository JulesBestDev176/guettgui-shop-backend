import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShopStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateShopDto } from './dto/create-shop.dto';

const SHOP_PUBLIC_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  phone: true,
  coverUrl: true,
  address: true,
  since: true,
  verified: true,
  ratingAvg: true,
  reviewCount: true,
  status: true,
  region: { select: { id: true, name: true } },
  city: { select: { id: true, name: true } },
  tags: { select: { id: true, name: true } },
  subscription: { select: { status: true, plan: { select: { code: true, name: true } } } },
  _count: { select: { products: true } },
};

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    regionId?: string;
    verified?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { regionId, verified, page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { status: ShopStatus.ACTIVE, deletedAt: null };
    if (regionId) where.regionId = regionId;
    if (verified !== undefined) where.verified = verified;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.shop.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ verified: 'desc' }, { ratingAvg: 'desc' }],
        select: SHOP_PUBLIC_SELECT,
      }),
      this.prisma.shop.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { slug },
      select: SHOP_PUBLIC_SELECT,
    });
    if (!shop || shop.status !== ShopStatus.ACTIVE) {
      throw new NotFoundException('Boutique introuvable');
    }
    return shop;
  }

  async findMine(userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { userId },
      select: {
        ...SHOP_PUBLIC_SELECT,
        createdAt: true,
        updatedAt: true,
        user: { select: { fullName: true, phone: true, email: true } },
      },
    });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    return shop;
  }

  async update(userId: string, dto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({ where: { userId }, select: { id: true } });
    if (!shop) throw new NotFoundException('Boutique introuvable');

    return this.prisma.shop.update({
      where: { id: shop.id },
      data: dto,
      select: SHOP_PUBLIC_SELECT,
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const shop = await this.prisma.shop.findUnique({ where: { userId }, select: { id: true } });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    return this.prisma.shop.update({ where: { id: shop.id }, data: { avatarUrl } });
  }

  async updateCover(userId: string, coverUrl: string) {
    const shop = await this.prisma.shop.findUnique({ where: { userId }, select: { id: true } });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    return this.prisma.shop.update({ where: { id: shop.id }, data: { coverUrl } });
  }

  // Admin operations
  async verify(id: string) {
    return this.prisma.shop.update({
      where: { id },
      data: { verified: true, status: ShopStatus.ACTIVE },
    });
  }

  async suspend(id: string) {
    return this.prisma.shop.update({ where: { id }, data: { status: ShopStatus.SUSPENDED } });
  }

  async activate(id: string) {
    return this.prisma.shop.update({ where: { id }, data: { status: ShopStatus.ACTIVE } });
  }

  async getStats(userId: string) {
    const shop = await this.prisma.shop.findUniqueOrThrow({ where: { userId }, select: { id: true } });

    const [productCount, activeProducts, orderCount, totalRevenue] = await Promise.all([
      this.prisma.product.count({ where: { shopId: shop.id, deletedAt: null } }),
      this.prisma.product.count({ where: { shopId: shop.id, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.order.count({ where: { items: { some: { product: { shopId: shop.id } } } } }),
      this.prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          items: { some: { product: { shopId: shop.id } } },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      productCount,
      activeProducts,
      orderCount,
      totalRevenue: totalRevenue._sum.total ?? 0,
    };
  }

  // Admin
  async getAdminStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, totalSellers, totalOrders, ordersThisMonth, gmv, gmvThisMonth, pendingShops] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'SELLER' } }),
        this.prisma.order.count(),
        this.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
        this.prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { total: true } }),
        this.prisma.order.aggregate({
          where: { status: 'DELIVERED', createdAt: { gte: startOfMonth } },
          _sum: { total: true },
        }),
        this.prisma.shop.count({ where: { status: 'PENDING' } }),
      ]);

    return {
      totalUsers,
      totalSellers,
      totalOrders,
      ordersThisMonth,
      gmv: gmv._sum.total ?? 0,
      gmvThisMonth: gmvThisMonth._sum.total ?? 0,
      pendingShops,
    };
  }

  async getPendingShops(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: 'PENDING' as any };
    const [items, total] = await Promise.all([
      this.prisma.shop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          verified: true,
          status: true,
          createdAt: true,
          region: { select: { id: true, name: true } },
          user: { select: { fullName: true, phone: true } },
        },
      }),
      this.prisma.shop.count({ where }),
    ]);
    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }
}
