import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthUser } from "../../common/types/auth-user";
import { CreateDeliveryZoneDto } from "./dto/create-delivery-zone.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateSellerApplicationDto } from "./dto/create-seller-application.dto";

@Injectable()
export class SellersService {
  private readonly products = [
    { id: "PRD-001", name: "Poulet entier frais", stock: 24, price: 4500, status: "ACTIVE" },
    { id: "PRD-002", name: "Cuisses de poulet x6", stock: 8, price: 3200, status: "ACTIVE" },
  ];

  private readonly deliveryZones = [
    { id: "zone-1", name: "Thies Nord", region: "Thies", city: "Thies Nord", fee: 1000, estimatedTime: "30-45 min", minimumOrderAmount: 5000, active: true },
    { id: "zone-2", name: "Dakar Plateau", region: "Dakar", city: "Plateau", fee: 6000, estimatedTime: "3-4 h", minimumOrderAmount: 40000, active: false },
  ];

  createApplication(dto: CreateSellerApplicationDto) {
    return {
      id: crypto.randomUUID(),
      ...dto,
      status: "PENDING_REVIEW",
      requiredDocuments: ["IDENTITY"],
    };
  }

  dashboard() {
    return {
      revenueMonth: 287500,
      ordersCount: 42,
      activeProducts: 8,
      ratingAverage: 4.8,
    };
  }

  listProducts() {
    return this.products;
  }

  createProduct(_user: AuthUser, dto: CreateProductDto) {
    const product = {
      id: crypto.randomUUID(),
      ...dto,
      price: dto.basePrice,
      status: "DRAFT",
    };
    this.products.push(product);
    return product;
  }

  listDeliveryZones() {
    return this.deliveryZones;
  }

  createDeliveryZone(dto: CreateDeliveryZoneDto) {
    const zone = { id: crypto.randomUUID(), active: true, ...dto };
    this.deliveryZones.push(zone);
    return zone;
  }

  toggleDeliveryZone(id: string) {
    const zone = this.deliveryZones.find((item) => item.id === id);
    if (!zone) {
      throw new NotFoundException("Zone introuvable");
    }
    zone.active = !zone.active;
    return zone;
  }

  stats() {
    return {
      revenue: 287500,
      averageBasket: 9850,
      productViews: 1284,
      conversionRate: 8.4,
    };
  }
}
