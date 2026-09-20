"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Filter, Heart, MapPin, Package, Search, ShoppingCart, Tag, X,
} from "lucide-react";
import { listCategories, listProducts, toggleFavorite, checkFavorite } from "@/lib/api";
import type { Category, Product, ProductListResponse } from "@/lib/types";

const BADGE_COLORS: Record<string, string> = {
  Populaire: "bg-orange-100 text-orange-600",
  Nouveau:   "bg-blue-100 text-blue-600",
  Lot:       "bg-yellow-100 text-yellow-700",
  "Frais du jour": "bg-green-100 text-green-700",
};

const SORT_OPTIONS = [
  { value: "newest",     label: "Plus récent" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating",     label: "Mieux notés" },
];

// ── Skeleton ──
function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-white">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-8 w-20 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ── Category skeleton ──
function CatSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-3">
      <div className="h-10 w-10 rounded-lg bg-gray-200" />
      <div className="h-3 w-14 rounded bg-gray-200" />
      <div className="h-2 w-10 rounded bg-gray-200" />
    </div>
  );
}

// ── Catalog card ──
function CatalogueCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(false);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleFavorite(p.id);
      setLiked(res.favorited);
    } catch {
      setLiked((v) => !v); // optimistic offline
    }
  };

  const image = p.images?.[0]?.url;
  const location = p.shop?.city?.name ?? p.shop?.region?.name ?? "Sénégal";
  const vendor = p.shop?.name ?? "Éleveur";

  return (
    <Link
      href={`/produits/${p.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-soft to-green-100 flex items-center justify-center">
            <Package size={40} className="text-brand/30" />
          </div>
        )}
        {p.badge && (
          <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${BADGE_COLORS[p.badge] ?? "bg-gray-100 text-gray-600"}`}>
            {p.badge}
          </span>
        )}
        {p.shop?.verified && (
          <span className="absolute right-8 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
            Vérifié
          </span>
        )}
        <button
          onClick={handleFav}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
        >
          <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-muted"} />
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-[13px] font-bold text-ink">{p.name}</p>
        <p className="font-body text-[11px] text-muted">{p.category?.name}</p>
        <div className="mt-1 flex items-center gap-1 font-body text-[11px] text-muted">
          <MapPin size={10} className="text-brand" />
          {location} · {vendor}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-sm font-extrabold text-ink">
            {p.basePrice.toLocaleString("fr-SN")} FCFA
          </span>
          <span className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-semibold text-white">
            <ShoppingCart size={13} />
            Voir
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Filter panel ──
function FilterPanel({
  categories,
  activeCatId,
  minPrice,
  maxPrice,
  onCatChange,
  onMinPrice,
  onMaxPrice,
  onReset,
}: {
  categories: Category[];
  activeCatId: string;
  minPrice: string;
  maxPrice: string;
  onCatChange: (id: string) => void;
  onMinPrice: (v: string) => void;
  onMaxPrice: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <aside className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold">Filtres</h2>
        <button className="text-xs font-medium text-brand" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
      <div className="space-y-5">
        {/* Catégories */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Catégorie</h3>
          <label className="mb-2 flex min-h-[36px] cursor-pointer items-center gap-2.5 font-body text-[13px]">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${activeCatId === "" ? "bg-brand" : "border-2 border-gray-300"}`}
              onClick={() => onCatChange("")}
            >
              {activeCatId === "" && <span className="h-2 w-2 rounded-sm bg-white" />}
            </span>
            <button onClick={() => onCatChange("")} className="text-left">
              Toutes
            </button>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="mb-2 flex min-h-[36px] cursor-pointer items-center gap-2.5 font-body text-[13px]">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${activeCatId === cat.id ? "bg-brand" : "border-2 border-gray-300"}`}
                onClick={() => onCatChange(cat.id)}
              >
                {activeCatId === cat.id && <span className="h-2 w-2 rounded-sm bg-white" />}
              </span>
              <button onClick={() => onCatChange(cat.id)} className="text-left">
                {cat.name}
                {cat._count && (
                  <span className="ml-1 text-muted">({cat._count.products})</span>
                )}
              </button>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Prix */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Prix (FCFA)</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPrice(e.target.value)}
              className="min-w-0 h-10 w-full rounded-lg bg-page px-3 font-body text-[13px] text-ink outline-none border border-border focus:border-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPrice(e.target.value)}
              className="min-w-0 h-10 w-full rounded-lg bg-page px-3 font-body text-[13px] text-ink outline-none border border-border focus:border-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Pagination ──
function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  const range = Array.from({ length: Math.min(pages, 5) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, pages - 4));
    return start + i;
  });

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>
      {range.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold ${
            p === page
              ? "border-brand bg-brand text-white"
              : "border-border bg-white text-ink hover:border-brand"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onPage(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Main page ──
export default function CataloguePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters from URL
  const activeCatId  = searchParams.get("categoryId") ?? "";
  const searchQ      = searchParams.get("search") ?? "";
  const sortBy       = (searchParams.get("sort") ?? "newest") as "newest" | "price_asc" | "price_desc" | "rating";
  const currentPage  = parseInt(searchParams.get("page") ?? "1");
  const minPrice     = searchParams.get("minPrice") ?? "";
  const maxPrice     = searchParams.get("maxPrice") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      if (key !== "page") p.delete("page");
      router.push(`/catalogue?${p.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const resetFilters = () => {
    router.push("/catalogue", { scroll: false });
  };

  // Load categories once
  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Load products when params change
  useEffect(() => {
    setLoading(true);
    setResult(null);
    listProducts({
      categoryId: activeCatId || undefined,
      search: searchQ || undefined,
      sort: sortBy,
      page: currentPage,
      limit: 18,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    })
      .then(setResult)
      .catch(() => setResult({ data: [], meta: { total: 0, page: 1, limit: 18, pages: 0 } }))
      .finally(() => setLoading(false));
  }, [activeCatId, searchQ, sortBy, currentPage, minPrice, maxPrice]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCatId),
    [categories, activeCatId]
  );

  const total = result?.meta.total ?? 0;
  const pages = result?.meta.pages ?? 0;
  const products = result?.data ?? [];

  return (
    <>
      <div className="min-h-screen bg-page">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          {/* Breadcrumb */}
          <div className="font-body mb-3 flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span>·</span>
            <Link href="/catalogue" className={!activeCatId ? "font-semibold text-brand" : "hover:text-brand"}>
              Catalogue
            </Link>
            {activeCategory && (
              <>
                <span>·</span>
                <span className="font-semibold text-brand">{activeCategory.name}</span>
              </>
            )}
          </div>

          {/* Header */}
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">
                {activeCategory?.name ?? "Catalogue des produits"}
              </h1>
              <p className="font-body text-sm text-muted">
                {loading ? "Chargement…" : `${total} offre${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 min-w-[44px] items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold shadow-sm lg:hidden"
            >
              <Filter size={16} />
              Filtres
            </button>
          </div>

          {/* Search + sort bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 shadow-sm">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                placeholder="Rechercher un produit…"
                value={searchQ}
                onChange={(e) => updateParam("search", e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
              {searchQ && (
                <button onClick={() => updateParam("search", "")} className="text-muted hover:text-ink">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="h-11 appearance-none rounded-lg border border-border bg-white pl-3 pr-8 text-sm font-medium outline-none shadow-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-muted" />
            </div>
          </div>

          {/* All categories grid (only when no filter active) */}
          {!activeCatId && !searchQ && (
            <div className="mb-6">
              <h2 className="mb-3 text-base font-bold text-ink">Toutes les catégories</h2>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-8 md:gap-3">
                {categories.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => <CatSkeleton key={i} />)
                  : categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateParam("categoryId", cat.id)}
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-3 text-center transition-all hover:border-brand hover:shadow-sm"
                      >
                        {cat.iconUrl ? (
                          <img src={cat.iconUrl} alt={cat.name} className="h-10 w-10 object-contain" />
                        ) : (
                          <Tag size={28} className="text-brand/40" />
                        )}
                        <span className="text-[11px] font-bold text-ink leading-tight">{cat.name}</span>
                        {cat._count && (
                          <span className="font-body text-[10px] text-muted">{cat._count.products} offres</span>
                        )}
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Sub-categories strip */}
          {activeCategory?.children && activeCategory.children.length > 0 && (
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => updateParam("categoryId", activeCategory.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand bg-brand px-3 py-1.5 text-[13px] font-semibold text-white"
              >
                Tout ({activeCategory._count?.products ?? 0})
              </button>
              {activeCategory.children.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => updateParam("categoryId", sub.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-brand"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[268px_1fr]">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <FilterPanel
                categories={categories}
                activeCatId={activeCatId}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCatChange={(id) => updateParam("categoryId", id)}
                onMinPrice={(v) => updateParam("minPrice", v)}
                onMaxPrice={(v) => updateParam("maxPrice", v)}
                onReset={resetFilters}
              />
            </div>

            {/* Products */}
            <div>
              <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                <span className="text-[13px] font-medium text-muted">
                  <strong className="text-ink">{loading ? "…" : total}</strong> résultats
                </span>
                <span className="text-[13px] font-medium text-muted">
                  Page {currentPage} sur {pages || 1}
                </span>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                  <Search size={40} className="mx-auto mb-2 text-muted/40" />
                  <p className="text-sm font-semibold text-ink">Aucun produit trouvé</p>
                  <p className="mt-1 font-body text-xs text-muted">
                    Essayez d&apos;autres filtres ou élargissez votre recherche.
                  </p>
                  <button
                    className="mt-4 text-sm font-semibold text-brand"
                    onClick={resetFilters}
                  >
                    Tout afficher
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((p) => <CatalogueCard key={p.slug} p={p} />)}
                  </div>
                  <Pagination
                    page={currentPage}
                    pages={pages}
                    onPage={(p) => updateParam("page", String(p))}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden">
          <div className="ml-auto h-full max-w-sm overflow-y-auto rounded-xl bg-page p-4 pb-24">
            <button
              className="mb-3 ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm"
              onClick={() => setDrawerOpen(false)}
            >
              <X size={18} />
            </button>
            <FilterPanel
              categories={categories}
              activeCatId={activeCatId}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onCatChange={(id) => { updateParam("categoryId", id); setDrawerOpen(false); }}
              onMinPrice={(v) => updateParam("minPrice", v)}
              onMaxPrice={(v) => updateParam("maxPrice", v)}
              onReset={() => { resetFilters(); setDrawerOpen(false); }}
            />
          </div>
        </div>
      )}
    </>
  );
}
