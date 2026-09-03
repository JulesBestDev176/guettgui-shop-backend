import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  productReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true } },
      },
    });
  }

  createOrUpdate(userId: string, productId: string, data: { rating: number; comment?: string }) {
    return this.prisma.review.upsert({
      where: { userId_productId: { userId, productId } },
      create: {
        userId,
        productId,
        rating: data.rating,
        comment: data.comment,
      },
      update: {
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { fullName: true } },
      },
    });
  }
}
