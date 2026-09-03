import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  listFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            seller: { select: { shopName: true } },
            category: true,
          },
        },
      },
    });
  }

  addFavorite(userId: string, productId: string) {
    return this.prisma.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            seller: { select: { shopName: true } },
            category: true,
          },
        },
      },
    });
  }

  async removeFavorite(userId: string, productId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId, productId },
    });
    return { deleted: true };
  }
}
