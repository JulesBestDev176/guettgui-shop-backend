"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search, MapPin, Star, ShieldCheck, Package,
  Heart, ChevronDown, CheckCircle, LayoutGrid, ArrowUpDown, Loader2, Store,
} from "lucide-react";
import { listShops } from "@/lib/api";
import type { Shop } from "@/lib/types";

const REGIONS = ["Toutes les régions", "Dakar", "Thiès", "Kaolack", "Saint-Louis", "Ziguinchor", "Diourbel", "Fatick", "Kolda", "Louga", "Matam", "Sédhiou", "Tambacounda", "Kaffrine"];

export default function BoutiquesPage() {
  const [search,       setSearch]      = useState("");
  const [region,       setRegion]      = useState("Toutes les régions");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [liked,        setLiked]       = useState<Set<string>>(new Set());

  const [shops,   setShops]   = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);

  useEffect(() => {
    setLoading(true);
    const params: Parameters<typeof listShops>[0] = { limit: 50 };
    if (verifiedOnly) params.verified = true;
    if (search.trim()) params.search = search.trim();
    if (region !== "Toutes les régions") {
      // region filter by name — pass as search for now (backend may support it)
    }
    listShops(params)
      .then((res) => {
        setShops(res.data);
        setTotal(res.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, verifiedOnly]);

  function toggleLike(id: string) {
    setLiked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  // Client-side region filter
  const filtered = shops.filter((b) => {
    const matchRegion = region === "Toutes les régions" || b.region?.name === region;
    return matchRegion;
  });

  return (
    <div className="min-h-screen bg-page pb-24 md:pb-8">

      {/* ── Hero ──────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 md:px-6">
        <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-[#f8f4e8] md:min-h-[360px]">
          <img
            src="/boutiques-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "70% top" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, #f8f4e8 0%, #f8f4e8 30%, rgba(248,244,232,0.8) 42%, rgba(248,244,232,0) 58%)",
            }}
          />
          <div className="relative z-10 w-[85%] px-6 py-8 md:w-[42%] md:px-12 md:py-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">
              <CheckCircle size={13} className="text-brand" /> Éleveurs vérifiés
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink md:text-3xl">
              Trouvez les meilleurs éleveurs près de chez vous
            </h1>
            <p className="font-body mt-2 text-sm leading-relaxed text-ink/70 hidden md:block">
              Des éleveurs de confiance pour des animaux en bonne santé
              et des produits de qualité, partout au Sénégal.
            </p>
            <p className="font-body mt-2 text-sm leading-relaxed text-ink/70 md:hidden">
              Des éleveurs de confiance, partout au Sénégal.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-sm md:pr-1.5">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom de boutique, ville, éleveur..."
                className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted font-body min-w-0"
              />
              <button className="hidden md:flex h-9 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-white shrink-0">
                Rechercher
              </button>
              <button className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shrink-0">
                <Search size={16} />
              </button>
            </div>
          </div>

          <p className="absolute right-5 top-5 text-right font-body text-sm font-semibold italic text-ink/80 leading-snug hidden md:block">
            Nos éleveurs<br />font le Sénégal<br />de demain
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">

        {/* Section header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink md:text-2xl">Boutiques vérifiées</h2>
            <p className="font-body mt-0.5 text-sm text-muted hidden md:block">
              Découvrez {filtered.length} boutiques d&apos;éleveurs vérifiés près de chez vous
            </p>
          </div>
          <span className="font-body text-sm text-muted">{filtered.length} boutique{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Filters — desktop */}
        <div className="mb-6 hidden md:flex items-center gap-3">
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-border bg-white pl-8 pr-8 text-sm font-body font-medium text-ink outline-none"
            >
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${
              verifiedOnly ? "border-brand bg-brand-soft text-brand" : "border-border bg-white text-ink hover:border-brand"
            }`}
          >
            <CheckCircle size={14} className={verifiedOnly ? "text-brand" : "text-muted"} />
            Vérifiés uniquement
          </button>

          <div className="relative ml-auto">
            <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <select className="h-10 appearance-none rounded-xl border border-border bg-white pl-8 pr-8 text-sm font-body font-medium text-ink outline-none">
              <option>Mieux notées</option>
              <option>Plus de produits</option>
              <option>Plus récentes</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        {/* Filters — mobile pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar md:hidden">
          <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-ink">
            <MapPin size={13} className="text-muted" /> Région <ChevronDown size={12} />
          </button>
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              verifiedOnly ? "border-brand bg-brand-soft text-brand" : "border-border bg-white text-ink"
            }`}
          >
            <CheckCircle size={13} /> Vérifiés
          </button>
          <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-ink">
            <Star size={13} className="text-muted" /> Mieux notées
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <Search size={40} className="mx-auto mb-3 text-muted/40" />
            <p className="font-semibold">Aucune boutique trouvée</p>
            <button
              onClick={() => { setSearch(""); setRegion("Toutes les régions"); setVerifiedOnly(false); }}
              className="mt-2 text-sm font-semibold text-brand hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <div key={b.slug} className="group relative rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Cover */}
                <div className="relative h-40 rounded-t-2xl overflow-hidden bg-brand/10">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-brand-soft to-green-100" />
                  )}
                </div>

                {/* Avatar */}
                <div className="absolute left-4" style={{ top: "calc(160px - 28px)" }}>
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border-[3px] border-white shadow-md">
                    {b.avatarUrl ? (
                      <img src={b.avatarUrl} alt={b.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand-soft">
                        <Store size={22} className="text-brand" />
                      </div>
                    )}
                  </div>
                  {b.verified && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow">
                      <CheckCircle size={11} />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="px-4 pb-4 pt-9">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/boutiques/${b.slug}`}>
                        <h3 className="font-bold text-ink group-hover:text-brand transition-colors truncate">{b.name}</h3>
                      </Link>
                      <p className="font-body text-xs text-muted truncate">Éleveur</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {b.ratingAvg > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={13} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-ink">{b.ratingAvg.toFixed(1)}</span>
                          <span className="font-body text-xs text-muted">({b.reviewCount})</span>
                        </div>
                      )}
                      <button
                        onClick={() => toggleLike(b.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white"
                      >
                        <Heart size={13} className={liked.has(b.id) ? "fill-red-500 text-red-500" : "text-muted"} />
                      </button>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-2 flex items-center gap-1 font-body text-xs text-muted">
                    <MapPin size={11} className="shrink-0 text-brand" />
                    {[b.city?.name, b.region?.name].filter(Boolean).join(", ") || "Sénégal"}
                  </div>

                  {/* Tags */}
                  {b.tags && b.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {b.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="rounded-full border border-border px-2.5 py-0.5 font-body text-[11px] text-muted">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats + CTA */}
                  <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
                    <span className="flex items-center gap-1 font-body text-xs text-muted">
                      <Package size={12} className="text-brand" /> {b._count?.products ?? 0} produits
                    </span>
                    <Link
                      href={`/boutiques/${b.slug}`}
                      className="ml-auto text-xs font-semibold text-brand hover:underline whitespace-nowrap"
                    >
                      Voir la boutique →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
