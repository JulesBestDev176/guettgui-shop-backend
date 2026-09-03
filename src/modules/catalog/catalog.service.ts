import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { ListProductsQuery } from "./dto/list-products.query";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async listProducts(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
    };

    if (query.q) {
      where.name = { contains: query.q, mode: "insensitive" };
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.city) {
      where.city = query.city;
    }

    if (query.delivery === "true") {
      where.seller = { zones: { some: { active: true } } };
    }

    const skip = (query.page - 1) * query.limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: "desc" },
        include: {
          seller: { select: { shopName: true } },
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pageCount: Math.ceil(total / query.limit),
      },
    };
  }

  async getProduct(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        seller: { select: { shopName: true, city: true, region: true } },
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        priceOptions: true,
        reviews: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }

    return product;
  }

  async getRelated(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: { categoryId: true },
    });

    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        slug: { not: slug },
        status: "ACTIVE",
      },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { shopName: true } },
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  }
}
