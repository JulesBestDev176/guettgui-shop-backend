import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "../../database/prisma.service";
import { AuthUser } from "../../common/types/auth-user";
import { CreateDeliveryZoneDto } from "./dto/create-delivery-zone.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateSellerApplicationDto } from "./dto/create-seller-application.dto";
import { RegisterSellerDto } from "./dto/register-seller.dto";

@Injectable()
export class SellersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async getSellerByUserId(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new NotFoundException("Profil vendeur introuvable");
    }
    return seller;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async registerSeller(dto: RegisterSellerDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException("Ce telephone est deja utilise");
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email ?? null,
        passwordHash: await argon2.hash(dto.password),
        role: "SELLER",
        seller: {
          create: {
            shopName: dto.shopName,
            city: dto.city,
            region: dto.region,
            description: dto.description,
            status: "PENDING_REVIEW",
            subscription: {
              create: { status: "TRIAL", endDate },
            },
          },
        },
      },
      include: { seller: { include: { subscription: true } } },
    });

    const payload = { id: user.id, phone: user.phone, role: user.role };
    return {
      user: payload,
      seller: user.seller,
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "30d"),
      }),
    };
  }

  async createApplication(dto: CreateSellerApplicationDto, user: AuthUser) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const seller = await this.prisma.seller.create({
      data: {
        userId: user.id,
        shopName: dto.shopName,
        city: dto.city,
        region: dto.region,
        status: "PENDING_REVIEW",
        subscription: {
          create: {
            status: "TRIAL",
            endDate,
          },
        },
      },
      include: { subscription: true },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });

    return seller;
  }

  async dashboard(userId: string) {
    const seller = await this.getSellerByUserId(userId);

    const [ordersCount, revenue, activeProducts, ratingAvg] =
      await Promise.all([
        this.prisma.orderItem.count({
          where: { sellerId: seller.id },
        }),
        this.prisma.orderItem.aggregate({
          where: { sellerId: seller.id },
          _sum: { total: true },
        }),
        this.prisma.product.count({
          where: { sellerId: seller.id, status: "ACTIVE" },
        }),
        this.prisma.review.aggregate({
          where: { product: { sellerId: seller.id } },
          _avg: { rating: true },
        }),
      ]);

    return {
      revenueMonth: revenue._sum.total ?? 0,
      ordersCount,
      activeProducts,
      ratingAverage: ratingAvg._avg.rating
        ? Math.round(ratingAvg._avg.rating * 10) / 10
        : 0,
    };
  }

  async listProducts(userId: string) {
    const seller = await this.getSellerByUserId(userId);

    return this.prisma.product.findMany({
      where: { sellerId: seller.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createProduct(user: AuthUser, dto: CreateProductDto) {
    const seller = await this.getSellerByUserId(user.id);

    let slug = this.slugify(dto.name);

    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return this.prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: dto.categoryId,
        name: dto.name,
        slug,
        description: dto.description,
        basePrice: dto.basePrice,
        stock: dto.stock,
        unit: dto.unit,
        city: seller.city,
        status: "DRAFT",
      },
      include: {
        images: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async listDeliveryZones(userId: string) {
    const seller = await this.getSellerByUserId(userId);

    return this.prisma.deliveryZone.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async createDeliveryZone(userId: string, dto: CreateDeliveryZoneDto) {
    const seller = await this.getSellerByUserId(userId);

    return this.prisma.deliveryZone.create({
      data: {
        sellerId: seller.id,
        name: dto.name,
        region: dto.region,
        city: dto.city,
        fee: dto.fee,
        estimatedTime: dto.estimatedTime,
        minimumOrderAmount: dto.minimumOrderAmount,
        active: dto.active ?? true,
      },
    });
  }

  async toggleDeliveryZone(userId: string, id: string) {
    const seller = await this.getSellerByUserId(userId);

    const zone = await this.prisma.deliveryZone.findFirst({
      where: { id, sellerId: seller.id },
    });
    if (!zone) {
      throw new NotFoundException("Zone introuvable");
    }

    return this.prisma.deliveryZone.update({
      where: { id },
      data: { active: !zone.active },
    });
  }

  async stats(userId: string) {
    const seller = await this.getSellerByUserId(userId);

    const [revenueAgg, orderCount] = await Promise.all([
      this.prisma.orderItem.aggregate({
        where: { sellerId: seller.id },
        _sum: { total: true },
      }),
      this.prisma.orderItem.count({
        where: { sellerId: seller.id },
      }),
    ]);

    const revenue = revenueAgg._sum.total ?? 0;
    const averageBasket = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    return {
      revenue,
      averageBasket,
      productViews: orderCount,
      conversionRate: 0,
    };
  }
}
