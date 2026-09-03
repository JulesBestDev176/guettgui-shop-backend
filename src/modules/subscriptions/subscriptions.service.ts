import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMySubscription(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      include: { subscription: true },
    });

    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }

    if (!seller.subscription) {
      throw new NotFoundException("Aucun abonnement trouve");
    }

    const subscription = seller.subscription;

    // Auto-expire if endDate has passed
    if (subscription.status !== "EXPIRED" && subscription.endDate < new Date()) {
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
    }

    return subscription;
  }

  async renew(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      include: { subscription: true },
    });

    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }

    if (seller.status !== "APPROVED") {
      throw new ForbiddenException("Votre compte vendeur doit etre approuve pour renouveler");
    }

    const now = new Date();
    const startDate = seller.subscription && seller.subscription.endDate > now
      ? seller.subscription.endDate
      : now;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    if (seller.subscription) {
      return this.prisma.subscription.update({
        where: { id: seller.subscription.id },
        data: {
          status: "ACTIVE",
          amount: 5000,
          startDate,
          endDate,
        },
      });
    }

    return this.prisma.subscription.create({
      data: {
        sellerId: seller.id,
        status: "ACTIVE",
        amount: 5000,
        startDate,
        endDate,
      },
    });
  }
}
