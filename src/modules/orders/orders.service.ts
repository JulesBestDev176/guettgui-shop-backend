import { Injectable, NotFoundException } from "@nestjs/common";
import { CheckoutDto } from "./dto/checkout.dto";

type OrderStatus = "PAYMENT_PENDING" | "PAID" | "PREPARING" | "IN_DELIVERY" | "DELIVERED" | "CANCELLED";

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, {
    id: string;
    code: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    status: OrderStatus;
    total: number;
    items: CheckoutDto["items"];
    createdAt: string;
  }>();

  checkout(dto: CheckoutDto) {
    const id = crypto.randomUUID();
    const code = `CMD-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(this.orders.size + 1).padStart(4, "0")}`;
    const total = dto.items.reduce((sum, item) => sum + item.quantity * 3500, 1500);
    const order = {
      id,
      code,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      deliveryAddress: dto.deliveryAddress,
      status: "PAYMENT_PENDING" as OrderStatus,
      total,
      items: dto.items,
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  list() {
    return [...this.orders.values()];
  }

  findById(id: string) {
    const order = this.orders.get(id);
    if (!order) {
      throw new NotFoundException("Commande introuvable");
    }
    return order;
  }

  track(code: string, phone: string) {
    const order = [...this.orders.values()].find((item) => item.code === code && item.customerPhone === phone);
    if (!order) {
      throw new NotFoundException("Commande introuvable");
    }
    return order;
  }

  updateStatus(id: string, status: OrderStatus) {
    const order = this.findById(id);
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }
}
