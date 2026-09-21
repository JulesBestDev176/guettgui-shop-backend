import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const ORDER_SELECT = {
  id: true,
  code: true,
  customerName: true,
  customerPhone: true,
  deliveryAddress: true,
  note: true,
  status: true,
  subtotal: true,
  total: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      name: true,
      unitPrice: true,
      quantity: true,
      total: true,
      product: { select: { id: true, slug: true, images: { take: 1, select: { url: true } } } },
    },
  },
  history: { orderBy: { createdAt: 'desc' as const }, select: { status: true, note: true, createdAt: true } },
};

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY],
  [OrderStatus.READY]: [OrderStatus.DELIVERED],
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId?: string) {
    // Fetch products and compute prices
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE', deletedAt: null },
      include: { priceOptions: true },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('Un ou plusieurs produits sont indisponibles');
    }

    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      let unitPrice = product.basePrice;
      if (item.priceOptionId) {
        const opt = product.priceOptions.find((o) => o.id === item.priceOptionId);
        if (opt) unitPrice = opt.price;
      }
      return {
        productId: item.productId,
        name: product.name,
        unitPrice,
        quantity: item.quantity,
        total: unitPrice * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.total, 0);
    const total = subtotal;

    return this.prisma.order.create({
      data: {
        userId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        deliveryAddress: dto.deliveryAddress,
        note: dto.note,
        subtotal,
        total,
        items: { create: orderItems },
        history: { create: { status: OrderStatus.PENDING, note: 'Commande créée' } },
      },
      select: ORDER_SELECT,
    });
  }

  async findByCode(code: string) {
    const order = await this.prisma.order.findUnique({ where: { code }, select: ORDER_SELECT });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async findShopOrders(userId: string, status?: OrderStatus, page = 1, limit = 20) {
    const shop = await this.prisma.shop.findUniqueOrThrow({ where: { userId }, select: { id: true } });
    const skip = (page - 1) * limit;
    const where: any = { items: { some: { product: { shopId: shop.id } } } };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: ORDER_SELECT }),
      this.prisma.order.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findMyOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: ORDER_SELECT,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return { data: items, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, userId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id }, select: { status: true, items: { select: { product: { select: { shop: { select: { userId: true } } } } } } } });
    if (!order) throw new NotFoundException();

    // Check shop ownership
    const isOwner = order.items.some((i) => i.product.shop.userId === userId);
    if (!isOwner) throw new ForbiddenException();

    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(`Transition de ${order.status} vers ${dto.status} non autorisée`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      select: ORDER_SELECT,
    });
  }
}
