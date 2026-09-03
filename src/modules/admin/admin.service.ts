import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [usersCount, sellersCount, ordersCount, revenue] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.seller.count(),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCEEDED" },
      }),
    ]);

    return {
      users: usersCount,
      sellers: sellersCount,
      orders: ordersCount,
      revenue: revenue._sum.amount ?? 0,
    };
  }

  listSellers() {
    return this.prisma.seller.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, phone: true, email: true } },
        subscription: true,
      },
    });
  }

  async approveSeller(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.seller.update({
        where: { id: sellerId },
        data: { status: "APPROVED" },
      });

      // Create trial subscription if none exists
      await tx.subscription.upsert({
        where: { sellerId },
        create: {
          sellerId,
          status: "TRIAL",
          amount: 0,
          startDate: now,
          endDate,
        },
        update: {},
      });

      return updated;
    });
  }

  async rejectSeller(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }

    return this.prisma.seller.update({
      where: { id: sellerId },
      data: { status: "REJECTED" },
    });
  }

  listCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  createCategory(data: { name: string; slug: string; description?: string; icon?: string }) {
    return this.prisma.category.create({ data });
  }
}
