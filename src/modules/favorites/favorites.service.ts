import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, productId } });
    return { favorited: true };
  }

  async findMine(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            unit: true,
            status: true,
            images: { take: 1, select: { url: true } },
            shop: { select: { name: true, slug: true } },
          },
        },
      },
    });
    return favorites.map((f) => f.product);
  }

  async isFavorited(userId: string, productId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return { favorited: !!fav };
  }
}
