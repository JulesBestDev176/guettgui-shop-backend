"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown, MapPin, MapIcon, ShieldCheck, Truck, Lock, Package, Star, Store, Tag } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES as STATIC_CATEGORIES } from "@/lib/categories-data";
import { listProducts, listShops, listCategories } from "@/lib/api";
import type { Product, Shop, Category } from "@/lib/types";

/* ─────────────────────────────────────────
   1. LOCATION BAR
───────────────────────────────────────── */
export function LocationBar() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="rounded-2xl border border-border bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
          <div className="flex items-start gap-3 md:min-w-[240px]">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <MapPin size={18} />
            </span>
            <div>
              <p className="font-semibold text-ink">Trouvez les offres près de chez vous</p>
              <p className="font-body mt-0.5 text-xs text-muted">
                Indiquez votre zone pour afficher les vendeurs disponibles.
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 font-body text-xs font-semibold text-brand">
                <Truck size={13} />
                Livraison disponible dans{" "}
                <span className="underline underline-offset-2">14 régions</span>
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
            {[
              { label: "Région", value: "Dakar" },
              { label: "Département", value: "Choisir" },
              { label: "Commune / Ville", value: "Choisir" },
            ].map(({ label, value }) => (
              <label key={label} className="flex-1">
                <span className="mb-1 block font-body text-xs font-medium text-muted">{label}</span>
                <span className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-page px-3 font-body text-sm text-ink">
                  {value}
                  <ChevronDown size={14} className="text-muted" />
                </span>
              </label>
            ))}
            <Link
              href="/catalogue"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white sm:self-end"
            >
              Voir les offres <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   2. CATEGORIES (from API, local icon fallback)
───────────────────────────────────────── */

// Map slug → local icon for fallback
const ICON_MAP: Record<string, string> = Object.fromEntries(
  STATIC_CATEGORIES.map((c) => [c.slug, c.icon])
);

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listCategories()
      .then((cats) => setCategories(cats.filter((c) => !c.parentId && c.isActive).slice(0, 8)))
      .catch(() => {
        // Fallback to static categories if API fails
        setCategories(
          STATIC_CATEGORIES.map((c) => ({
            id: c.slug,
            slug: c.slug,
            name: c.label,
            iconUrl: c.icon,
            isActive: true,
            parentId: null,
            _count: { products: c.count },
          } as unknown as Category))
        );
      });
  }, []);

  const displayed = categories.length > 0 ? categories : STATIC_CATEGORIES.map((c) => ({
    id: c.slug, slug: c.slug, name: c.label, iconUrl: c.icon,
    isActive: true, parentId: null, _count: { products: c.count },
  } as unknown as Category));

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Explorez les catégories</h2>
          <p className="font-body mt-1 text-sm text-muted">
            Animaux et produits d&apos;élevage auprès de vendeurs vérifiés.
          </p>
        </div>
        <Link href="/catalogue" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline whitespace-nowrap">
          Voir toutes <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2 md:grid-cols-8 md:gap-3">
        {displayed.map((cat) => {
          const icon = cat.iconUrl || ICON_MAP[cat.slug];
          return (
            <Link
              key={cat.slug}
              href={`/catalogue?categoryId=${cat.id}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-3 text-center transition-all hover:border-brand hover:shadow-sm md:p-4"
            >
              {icon ? (
                <img src={icon} alt={cat.name} className="h-12 w-12 object-contain md:h-14 md:w-14" />
              ) : (
                <Tag size={32} className="text-brand/40" />
              )}
              <span className="text-[12px] font-bold text-ink leading-tight md:text-[13px]">{cat.name}</span>
              <span className="font-body text-[10px] text-muted md:text-[11px]">
                {cat._count?.products ?? 0} offres
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. PRODUITS POPULAIRES
───────────────────────────────────────── */
export function PopularProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    listProducts({ featured: true, limit: 4 })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Produits populaires</h2>
          <p className="font-body mt-1 text-sm text-muted">Les offres les plus consultées près de chez vous.</p>
        </div>
        <Link href="/catalogue" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline whitespace-nowrap">
          Voir le catalogue <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            name={p.name}
            price={p.basePrice}
            category={p.category?.name}
            vendor={p.shop?.name ?? "Éleveur"}
            city={p.shop?.city?.name ?? p.shop?.region?.name}
            image={p.images?.[0]?.url}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. BOUTIQUES POPULAIRES
───────────────────────────────────────── */
export function PopularBoutiquesSection() {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    listShops({ verified: true, limit: 4 })
      .then((res) => setShops(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (shops.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Boutiques populaires</h2>
          <p className="font-body mt-1 text-sm text-muted">
            Des éleveurs vérifiés et bien notés près de chez vous.
          </p>
        </div>
        <Link href="/boutiques" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline whitespace-nowrap">
          Voir toutes <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shops.map((b) => (
          <Link
            key={b.slug}
            href={`/boutiques/${b.slug}`}
            className="group block rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Cover */}
            <div className="relative h-20 bg-brand/10">
              {b.coverUrl ? (
                <img src={b.coverUrl} alt="" className="h-full w-full object-cover opacity-30" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-brand-soft to-green-100" />
              )}
              <div className="absolute -bottom-5 left-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white shadow">
                  {b.avatarUrl ? (
                    <img src={b.avatarUrl} alt={b.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-soft">
                      <Store size={20} className="text-brand" />
                    </div>
                  )}
                </div>
                {b.verified && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                    <ShieldCheck size={9} />
                  </span>
                )}
              </div>
            </div>
            {/* Content */}
            <div className="px-3 pb-3 pt-7">
              <h3 className="font-bold text-sm text-ink group-hover:text-brand transition-colors truncate">
                {b.name}
              </h3>
              <p className="font-body text-xs text-muted truncate">Éleveur</p>
              <div className="mt-1.5 flex items-center gap-1 font-body text-xs text-muted">
                <MapPin size={10} className="text-brand" />
                {b.city?.name ?? b.region?.name ?? "Sénégal"}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                {b.ratingAvg > 0 ? (
                  <span className="flex items-center gap-1 font-body text-xs">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <strong className="text-ink">{b.ratingAvg.toFixed(1)}</strong>
                    <span className="text-muted">({b.reviewCount})</span>
                  </span>
                ) : (
                  <span className="font-body text-xs text-muted">
                    {b._count?.products ?? 0} produits
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   6. COMMENT ÇA MARCHE
───────────────────────────────────────── */
const STEPS = [
  { n: 1, title: "Choisissez votre zone",       text: "Découvrez les offres disponibles près de chez vous.", icon: MapIcon },
  { n: 2, title: "Sélectionnez un produit",     text: "Comparez les produits et les vendeurs vérifiés.",     icon: Package },
  { n: 3, title: "Payez par Mobile Money",      text: "Votre paiement reste sécurisé jusqu'à la livraison.", iconImg: "/icons/paiement.png" },
  { n: 4, title: "Recevez votre commande",      text: "Livraison à domicile ou retrait chez le vendeur.",    icon: Truck },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 md:px-6">
      <div className="rounded-2xl bg-ink px-6 py-10 text-gray-300">
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-white md:text-2xl">
            Commandez simplement, en toute confiance
          </h2>
          <p className="font-body mt-1 text-sm text-gray-400">
            De la ferme jusqu&apos;à chez vous, en quatre étapes.
          </p>
        </div>
        <div className="relative mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0">
          {STEPS.map(({ n, title, text, icon: Icon, iconImg }, i) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              {i < STEPS.length - 1 && (
                <div className="absolute left-[calc(50%+32px)] top-6 hidden h-px w-[calc(100%-64px)] border-t-2 border-dashed border-brand/40 md:block" />
              )}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white shadow">
                {n}
              </div>
              <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                {iconImg ? (
                  <img src={iconImg} alt={title} className="h-8 w-8 object-contain" />
                ) : Icon ? (
                  <Icon size={26} className="text-brand" strokeWidth={1.6} />
                ) : null}
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
              <p className="font-body mt-1.5 max-w-[160px] text-xs leading-relaxed text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   7. TRUST BAR
───────────────────────────────────────── */
const TRUST = [
  { icon: ShieldCheck, title: "Vendeurs vérifiés",  sub: "Des éleveurs de confiance" },
  { icon: Lock,        title: "Paiement protégé",   sub: "Mobile Money sécurisé" },
  { icon: Truck,       title: "Suivi de commande",  sub: "Soyez informé à chaque étape" },
];

export function TrustBar() {
  return (
    <section className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col divide-y divide-border px-4 py-6 md:flex-row md:divide-x md:divide-y-0 md:px-6">
        {TRUST.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex flex-1 items-center gap-4 py-4 md:justify-center md:py-0 md:px-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
              <Icon size={20} className="text-brand" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="font-body text-xs text-muted">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
