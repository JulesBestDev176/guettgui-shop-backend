"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { listProducts, listCategories } from "@/lib/api";
import type { Product, Category } from "@/lib/types";

const saleModes = ["A l'unite", "En lot", "Ramasse"];

interface Filters {
  category: string;
  city: string;
  q: string;
  page: number;
}

function FilterPanel({
  categories,
  filters,
  onFilterChange,
}: {
  categories: Category[];
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
}) {
  return (
    <aside className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold">Filtres</h2>
        <button
          className="text-xs font-medium text-brand"
          onClick={() => onFilterChange({ category: "", city: "", q: "", page: 1 })}
        >
          Reinitialiser
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="mb-2.5 text-[13px] font-semibold">Localisation</h3>
          <div className="relative mb-2">
            <select
              className="flex h-10 w-full appearance-none items-center rounded-lg bg-page px-3 text-[13px] font-medium text-ink outline-none"
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value, page: 1 })}
            >
              <option value="">Toutes les villes</option>
              {["Dakar", "Thies", "Saint-Louis", "Kaolack", "Ziguinchor", "Touba", "Tambacounda", "Kolda"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-muted" />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Categorie</h3>
          <label className="mb-2.5 flex min-h-[36px] items-center gap-2.5 font-body text-[13px] cursor-pointer">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${filters.category === "" ? "bg-brand" : "border-2 border-gray-300"}`}>
              {filters.category === "" && <span className="h-2 w-2 rounded-sm bg-white" />}
            </span>
            <button onClick={() => onFilterChange({ category: "", page: 1 })} className="text-left">
              Toutes
            </button>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="mb-2.5 flex min-h-[36px] items-center gap-2.5 font-body text-[13px] cursor-pointer">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${filters.category === cat.slug ? "bg-brand" : "border-2 border-gray-300"}`}>
                {filters.category === cat.slug && <span className="h-2 w-2 rounded-sm bg-white" />}
              </span>
              <button onClick={() => onFilterChange({ category: cat.slug, page: 1 })} className="text-left">
                {cat.name}
              </button>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Etat</h3>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-brand-soft px-3 py-2 text-xs font-semibold text-brand-dark">Vivant</span>
            <span className="rounded-lg bg-page px-3 py-2 text-xs font-medium text-muted">Pret a cuire</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Prix (FCFA)</h3>
          <div className="mb-3 flex gap-2">
            <div className="flex h-10 flex-1 items-center rounded-lg bg-page px-3 font-body text-[13px] text-muted">Min</div>
            <div className="flex h-10 flex-1 items-center rounded-lg bg-page px-3 font-body text-[13px] text-muted">Max</div>
          </div>
          <div className="relative h-1 rounded bg-gray-200">
            <div className="absolute left-[15%] right-[30%] h-1 rounded bg-brand" />
            <span className="absolute left-[15%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[3px] border-brand bg-white" />
            <span className="absolute left-[70%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[3px] border-brand bg-white" />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div>
          <h3 className="mb-3 text-[13px] font-semibold">Mode de vente</h3>
          {saleModes.map((item) => (
            <label key={item} className="mb-2.5 flex items-center gap-2.5 font-body text-[13px]">
              <span className="h-[18px] w-[18px] rounded border-2 border-gray-300" />
              {item}
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        <label className="flex items-center justify-between text-[13px] font-semibold">
          Livraison disponible
          <span className="relative h-[22px] w-[38px] rounded-full bg-brand">
            <span className="absolute right-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-white" />
          </span>
        </label>
      </div>
    </aside>
  );
}

export default function CataloguePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pageCount: number }>({
    page: 1, limit: 12, total: 0, pageCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    city: "",
    q: "",
    page: 1,
  });

  const fetchProducts = useCallback(async (currentFilters: Filters) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: currentFilters.page, limit: 12 };
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.city) params.city = currentFilters.city;
      if (currentFilters.q) params.q = currentFilters.q;

      const res = await listProducts(params);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleFilterChange = (updates: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const { page, pageCount } = meta;
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < pageCount - 2) pages.push("...");
      pages.push(pageCount);
    }
    return pages;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <div className="font-body mb-2 text-xs text-muted">
        Accueil · Catalogue{filters.city ? ` · ` : ""}{filters.city && <span className="text-brand">{filters.city}</span>}
      </div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Catalogue des produits</h1>
          <p className="font-body text-sm text-muted">
            {meta.total} offres disponibles{filters.city ? <> pres de <strong className="text-ink">{filters.city}</strong></> : ""}
          </p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="flex h-11 min-w-[44px] items-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold shadow-sm lg:hidden">
          <Filter size={16} />
          Filtres
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[268px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel categories={categories} filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div>
          <div className="mb-5 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between md:px-4">
            <span className="text-[13px] font-medium text-muted">
              {meta.total} resultats · <strong className="text-ink">page {meta.page} / {meta.pageCount || 1}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-muted">Trier par</span>
              <button className="flex h-9 items-center gap-4 rounded-lg bg-page px-3 text-[13px] font-semibold">
                Plus proche
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : products.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-muted">Aucun produit trouve.</p>
              <button
                className="mt-3 text-sm font-semibold text-brand"
                onClick={() => handleFilterChange({ category: "", city: "", q: "", page: 1 })}
              >
                Reinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
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

          {meta.pageCount > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {pageNumbers().map((page, i) =>
                typeof page === "string" ? (
                  <span key={`ellipsis-${i}`} className="flex h-10 w-10 items-center justify-center text-sm text-muted">
                    {page}
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                      page === meta.page ? "bg-brand text-white" : "bg-white text-ink shadow-sm hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 lg:hidden">
          <div className="ml-auto h-full max-w-sm overflow-y-auto rounded-xl bg-page p-4 pb-24">
            <button className="mb-3 ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm" onClick={() => setDrawerOpen(false)}>
              <X size={18} />
            </button>
            <FilterPanel categories={categories} filters={filters} onFilterChange={(updates) => { handleFilterChange(updates); setDrawerOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
