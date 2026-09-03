import { Injectable, NotFoundException } from "@nestjs/common";
import { ListProductsQuery } from "./dto/list-products.query";

const categories = [
  { id: "cat-chair", name: "Poulet de chair", slug: "poulet-de-chair" },
  { id: "cat-local", name: "Poulet local", slug: "poulet-local" },
  { id: "cat-lot", name: "Vente en lot", slug: "vente-en-lot" },
  { id: "cat-oeufs", name: "Oeufs", slug: "oeufs" },
  { id: "cat-dinde", name: "Dinde", slug: "dinde" },
];

const products = [
  { id: "prd-1", slug: "poulet-entier-frais", name: "Poulet de chair 2 kg", price: 3500, category: "Poulet de chair", seller: "Ferme Keur Massar", city: "Thies", stock: 45, delivery: true },
  { id: "prd-2", slug: "poulet-local-fermier", name: "Poulet local fermier vivant", price: 4200, category: "Poulet local", seller: "Elevage Ndiaye", city: "Dakar", stock: 28, delivery: true },
  { id: "prd-3", slug: "lot-25-poulets", name: "Lot de 25 poulets locaux", price: 98000, category: "Vente en lot", seller: "Coop Bio Mbour", city: "Mbour", stock: 8, delivery: false },
  { id: "prd-4", slug: "plateau-oeufs-frais", name: "Plateau 30 oeufs frais", price: 4200, category: "Oeufs", seller: "Pondeuses du Sine", city: "Fatick", stock: 62, delivery: true },
];

@Injectable()
export class CatalogService {
  listCategories() {
    return categories;
  }

  listProducts(query: ListProductsQuery) {
    const filtered = products.filter((product) => {
      const matchSearch = !query.q || product.name.toLowerCase().includes(query.q.toLowerCase());
      const matchCategory = !query.category || product.category === query.category;
      const matchCity = !query.city || product.city === query.city;
      const matchDelivery = query.delivery === undefined || product.delivery === (query.delivery === "true");
      return matchSearch && matchCategory && matchCity && matchDelivery;
    });

    return {
      data: filtered,
      meta: {
        page: query.page,
        limit: query.limit,
        total: filtered.length,
        pageCount: Math.ceil(filtered.length / query.limit),
      },
    };
  }

  getProduct(slug: string) {
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      throw new NotFoundException("Produit introuvable");
    }
    return product;
  }

  getRelated(slug: string) {
    const product = this.getProduct(slug);
    return products.filter((item) => item.category === product.category && item.slug !== slug).slice(0, 4);
  }
}
