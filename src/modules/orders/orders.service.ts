import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(dto: CheckoutDto, userId?: string) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { seller: true },
    });

    if (products.length !== productIds.length) {
      const found = new Set(products.map((p) => p.id));
      const missing = productIds.filter((id) => !found.has(id));
      throw new BadRequestException(
        `Produits introuvables : ${missing.join(", ")}`,
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.basePrice;
      return {
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const deliveryFee = 1500;
    const total = subtotal + deliveryFee;

    const code = await this.generateCode();

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code,
          userId: userId ?? null,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          status: OrderStatus.CREATED,
          subtotal,
          deliveryFee,
          total,
          items: { create: items },
          history: {
            create: { status: OrderStatus.CREATED, note: "Commande créée" },
          },
        },
        include: { items: true, history: true },
      });

      return order;
    });
  }

  async list(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true, history: true },
    });
    if (!order) {
      throw new NotFoundException("Commande introuvable");
    }
    return order;
  }

  async track(code: string, phone: string) {
    const order = await this.prisma.order.findFirst({
      where: { code, customerPhone: phone },
      include: { items: true, history: true },
    });
    if (!order) {
      throw new NotFoundException("Commande introuvable");
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, note?: string) {
    const order = await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: { status },
        include: { items: true, payment: true, history: true },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: order.id, status, note },
      });

      return updated;
    });
  }

  async listSellerOrders(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new NotFoundException("Profil vendeur introuvable");
    }

    return this.prisma.order.findMany({
      where: { items: { some: { sellerId: seller.id } } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getSellerOrder(userId: string, orderId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new NotFoundException("Profil vendeur introuvable");
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        items: { some: { sellerId: seller.id } },
      },
      include: { items: true, payment: true, history: true },
    });
    if (!order) {
      throw new NotFoundException("Commande introuvable");
    }
    return order;
  }

  async markPreparing(userId: string, orderId: string) {
    const order = await this.getSellerOrder(userId, orderId);

    if (
      order.status !== OrderStatus.PAID &&
      order.status !== OrderStatus.SELLER_CONFIRMED
    ) {
      throw new ForbiddenException(
        "La commande ne peut pas passer en préparation dans son état actuel",
      );
    }

    return this.updateStatus(orderId, OrderStatus.PREPARING, "Mise en préparation par le vendeur");
  }

  private async generateCode(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    const count = await this.prisma.order.count({
      where: {
        code: { startsWith: `GG-${dateStr}` },
      },
    });

    return `GG-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
}
