import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export class CreateReviewDto {
  productId: string;
  rating: number; // 1-5
  comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });
    if (existing) throw new ConflictException('Vous avez déjà noté ce produit');

    const review = await this.prisma.review.create({
      data: { userId, ...dto },
      select: { id: true, rating: true, comment: true, createdAt: true },
    });

    // Update product rating
    await this.updateProductRating(dto.productId);
    return review;
  }

  async findForProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { fullName: true, avatarUrl: true } },
        },
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);
    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  private async updateProductRating(productId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });
  }
}
