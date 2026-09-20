"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, Search, Drumstick, Beef, Package, Wrench, Wheat, Bird, Egg, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/brand";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { howItWorks, locationFields } from "@/lib/marketplace-data";
import { listCategories, listProducts } from "@/lib/api";
import { productImages } from "@/lib/product-images";
import type { Category, Product } from "@/lib/types";

const categoryIconMap: Record<string, LucideIcon> = {
  Drumstick,
  Beef,
  Package,
  Wrench,
  Wheat,
  Bird,
  Egg,
  ShoppingBag,
};

const fallbackIcons: LucideIcon[] = [Drumstick, Bird, Egg, Package, Beef, Wheat, Wrench, ShoppingBag];

function getCategoryIcon(category: Category, index: number): LucideIcon {
  if (category.icon && categoryIconMap[category.icon]) {
    return categoryIconMap[category.icon];
  }
  return fallbackIcons[index % fallbackIcons.length];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prodsRes] = await Promise.all([
          listCategories(),
          listProducts({ limit: 4 }),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prodsRes?.data) ? prodsRes.data : Array.isArray(prodsRes) ? prodsRes : []);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const heroImage = products[0]?.images?.[0]?.url || productImages.hero;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">

        {/* -- Hero -- */}
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-body text-sm font-medium text-brand">
                + 280 vendeurs verifies · 14 regions
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink md:text-[40px] md:leading-[1.1]">
                Achetez vos produits{" "}
                <span className="text-brand">frais</span> partout au{" "}
                <span className="text-brand">Senegal</span>
              </h1>
              <p className="font-body mt-4 max-w-md text-base leading-relaxed text-muted">
                Poulet de chair, local, ameliore, vivant ou pret a cuire.
                Commandez chez des vendeurs verifies avec livraison pres de chez vous.
              </p>

              <div className="mt-8 flex max-w-md items-center rounded-lg bg-white p-1.5 pl-4 shadow-sm">
                <Search size={18} className="text-muted shrink-0" />
                <input
                  className="h-10 flex-1 min-w-0 bg-transparent pl-2.5 text-sm outline-none placeholder:text-muted font-body"
                  placeholder="Ex : poulet de chair a Dakar"
                />
                <Link
                  href="/catalogue"
                  className="flex h-10 shrink-0 items-center rounded-md bg-brand px-3 sm:px-5 text-sm font-semibold text-white"
                >
                  <span className="sm:hidden"><Search size={16} /></span>
                  <span className="hidden sm:inline">Rechercher</span>
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/catalogue"
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white"
                >
                  Voir les produits
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/devenir-vendeur"
                  className="inline-flex h-12 items-center rounded-lg border border-brand px-5 text-sm font-semibold text-brand"
                >
                  Devenir vendeur
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={heroImage}
                  alt="Produit frais Guett Gui"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* -- Location bar -- */}
        <section className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-brand" />
              <span className="text-sm font-semibold">Choisissez votre zone</span>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
              {locationFields.map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-1 block font-body text-xs font-medium text-muted">{field.label}</span>
                  <span className="flex h-10 items-center justify-between rounded-lg bg-page px-3 font-body text-sm text-ink">
                    {field.value}
                    <ChevronDown size={14} className="text-muted" />
                  </span>
                </label>
              ))}
              <Link
                href="/catalogue"
                className="flex h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-semibold text-white"
              >
                Voir les offres
              </Link>
            </div>
          </div>
        </section>

        {/* -- Categories -- */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <SectionTitle title="Categories" action="Tout voir" />
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5 rounded-xl bg-white px-3 py-5 shadow-sm animate-pulse">
                  <span className="h-11 w-11 rounded-lg bg-gray-200" />
                  <span className="h-3 w-16 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {categories.map((cat, index) => {
                const Icon = getCategoryIcon(cat, index);
                return (
                  <Link
                    key={cat.id}
                    href={`/catalogue?category=${cat.slug}`}
                    className="flex flex-col items-center gap-2.5 rounded-xl bg-white px-3 py-5 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-semibold text-ink">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* -- Produits populaires -- */}
        <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
          <SectionTitle title="Produits populaires" action="Voir le catalogue" />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                    <div className="h-6 w-24 rounded bg-gray-200 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  price={product.basePrice}
                  category={product.category?.name}
                  vendor={product.seller?.shopName || "Vendeur"}
                  city={product.city}
                  image={product.images?.[0]?.url}
                  livraison={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* -- Comment ca marche -- */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold md:text-2xl">Comment ca marche ?</h2>
              <p className="font-body mt-1 text-sm text-muted">Commandez en 4 etapes simples</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
              {howItWorks.map(({ title, text, icon: Icon }, index) => (
                <div key={title} className="text-center">
                  <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                  <p className="font-body mt-1.5 text-xs leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
