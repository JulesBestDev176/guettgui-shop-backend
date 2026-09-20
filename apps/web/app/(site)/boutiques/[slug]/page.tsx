"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Star, ShieldCheck, Phone, Package, Users,
  Share2, MessageCircle, ArrowLeft, Heart, Zap,
  ShoppingCart, CheckCircle, Search, SlidersHorizontal,
  Clock, RotateCcw, ChevronDown, Filter, Loader2, Store,
} from "lucide-react";
import { getShop, listProducts, toggleFavorite, getReviews } from "@/lib/api";
import type { Shop, Product, Review } from "@/lib/types";

const TABS = ["Produits", "À propos", "Avis", "Conditions"] as const;
type Tab = typeof TABS[number];

export default function BoutiqueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [tab, setTab]             = useState<Tab>("Produits");
  const [followed, setFollowed]   = useState(false);
  const [activeCat, setActiveCat] = useState("Tous les produits");
  const [search, setSearch]       = useState("");
  const [minPrice, setMinPrice]   = useState("");
  const [maxPrice, setMaxPrice]   = useState("");
  const [filterMin, setFilterMin] = useState<number | null>(null);
  const [filterMax, setFilterMax] = useState<number | null>(null);
  const [liked, setLiked]         = useState<Set<string>>(new Set());

  const [shop, setShop]           = useState<Shop | null>(null);
  const [products, setProducts]   = useState<Product[]>([]);
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getShop(slug),
      listProducts({ shopSlug: slug, limit: 100 }),
    ])
      .then(([s, res]) => {
        setShop(s);
        setProducts(res.data);
        // Load reviews for all products of this shop
        const productIds = res.data.map((p) => p.id);
        if (productIds.length > 0) {
          Promise.all(productIds.slice(0, 5).map((id) => getReviews(id)))
            .then((results) => setReviews(results.flatMap((r) => r.data).slice(0, 20)))
            .catch(() => {});
        }
      })
      .catch((err) => setError(err.message || "Boutique introuvable"))
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleLike(productId: string) {
    try {
      const res = await toggleFavorite(productId);
      setLiked((prev) => {
        const s = new Set(prev);
        res.favorited ? s.add(productId) : s.delete(productId);
        return s;
      });
    } catch {
      setLiked((prev) => {
        const s = new Set(prev);
        s.has(productId) ? s.delete(productId) : s.add(productId);
        return s;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-3 text-xl font-bold text-ink">Boutique introuvable</h1>
        <p className="mb-6 text-sm text-muted">{error || "Cette boutique n'existe pas ou a été retirée."}</p>
        <Link href="/boutiques" className="text-sm font-semibold text-brand hover:underline">
          Retour aux boutiques
        </Link>
      </div>
    );
  }

  // Derive category list from products
  const cats = ["Tous les produits", ...Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean) as string[]))];

  const filtered = products.filter((p) => {
    const matchCat    = activeCat === "Tous les produits" || p.category?.name === activeCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchMin    = filterMin === null || p.basePrice >= filterMin;
    const matchMax    = filterMax === null || p.basePrice <= filterMax;
    return matchCat && matchSearch && matchMin && matchMax;
  });

  const shopCity   = shop.city?.name ?? "";
  const shopRegion = shop.region?.name ?? "";
  const location   = [shopCity, shopRegion].filter(Boolean).join(", ") || "Sénégal";
  const productCount = shop._count?.products ?? products.length;

  return (
    <main className="min-h-screen bg-page pb-24 md:pb-8">

      {/* ── Cover ─────────────────────────────────── */}
      <div className="relative h-52 w-full overflow-hidden md:h-72">
        {shop.coverUrl ? (
          <img src={shop.coverUrl} alt="Couverture" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-soft to-green-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/20 to-transparent" />
        <Link href="/boutiques" className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow">
          <ArrowLeft size={18} className="text-ink" />
        </Link>
        <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow">
          <Share2 size={16} className="text-ink" />
        </button>
        {/* Desktop tagline */}
        <div className="absolute bottom-6 right-6 text-right text-white hidden md:block">
          <p className="text-2xl font-extrabold leading-tight">
            Des volailles saines<br />pour des familles heureuses
          </p>
          <div className="mt-1.5 flex justify-end">
            <span className="h-0.5 w-12 bg-brand rounded-full" />
          </div>
          <p className="mt-2 flex items-center justify-end gap-3 text-xs text-white/80 font-body">
            <span>Qualité</span><span>·</span><span>Confiance</span><span>·</span><span>Élevage local</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* ── Profile row ───────────────────────────── */}
        <div className="-mt-12 md:-mt-14 flex items-start gap-3 md:gap-4">
          {/* Avatar */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg md:h-28 md:w-28">
            {shop.avatarUrl ? (
              <img src={shop.avatarUrl} alt={shop.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-soft">
                <Store size={36} className="text-brand" />
              </div>
            )}
            {shop.verified && (
              <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow">
                <ShieldCheck size={12} />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="mt-12 md:mt-14 pt-3 flex flex-1 flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0">
              {/* Name row + share on mobile */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-extrabold text-ink md:text-2xl">{shop.name}</h1>
                  {shop.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
                      <CheckCircle size={10} /> Vérifié
                    </span>
                  )}
                </div>
                {/* Share — mobile only */}
                <button className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink">
                  <Share2 size={15} />
                </button>
              </div>
              <p className="font-body mt-0.5 text-sm text-muted">Éleveur</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-body text-xs text-muted">
                <span className="flex items-center gap-1"><MapPin size={11} className="text-brand" />{location}</span>
                {shop.ratingAvg > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <strong className="text-ink">{shop.ratingAvg.toFixed(1)}</strong>
                    <span>({shop.reviewCount} avis)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFollowed(!followed)}
                className={`flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${
                  followed ? "border border-brand bg-brand-soft text-brand" : "bg-brand text-white"
                }`}
              >
                <Heart size={14} className={followed ? "fill-brand" : ""} />
                {followed ? "Abonné" : "Suivre"}
              </button>
              {shop.phone && (
                <a
                  href={`https://wa.me/${shop.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis Guett Gui concernant votre boutique ${shop.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink"
                >
                  <MessageCircle size={15} /> Contacter
                </a>
              )}
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-ink">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile action buttons ─────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
          <button
            onClick={() => setFollowed(!followed)}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
              followed ? "border border-brand bg-brand-soft text-brand" : "bg-brand text-white"
            }`}
          >
            <Heart size={16} className={followed ? "fill-brand" : ""} />
            {followed ? "Abonné" : "Suivre"}
          </button>
          {shop.phone ? (
            <a
              href={`https://wa.me/${shop.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis Guett Gui concernant votre boutique ${shop.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-ink"
            >
              <MessageCircle size={16} /> Contacter
            </a>
          ) : (
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-ink" disabled>
              <MessageCircle size={16} /> Contacter
            </button>
          )}
        </div>

        {/* ── Stats bar ─────────────────────────────── */}
        <div className="mt-4 flex divide-x divide-border rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          {/* Mobile: 2 stats */}
          {[
            { icon: Package, value: productCount, label: "Produits" },
            { icon: Star,    value: shop.reviewCount, label: "Avis" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-1 flex-col items-center justify-center py-4 text-center md:hidden">
              <span className="text-xl font-extrabold text-brand">{value}</span>
              <span className="font-body text-xs text-muted mt-0.5">{label}</span>
            </div>
          ))}
          {/* Desktop: icon + value + label on same line, 3 stats */}
          {[
            { icon: Package,     value: productCount,      label: "Produits" },
            { icon: Star,        value: shop.reviewCount,  label: "Avis" },
            { icon: CheckCircle, value: "98%",             label: "Commandes réussies" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={`d-${label}`} className="hidden md:flex flex-1 items-center justify-center gap-2 px-5 py-4">
              <Icon size={18} className="shrink-0 text-brand" strokeWidth={1.6} />
              <span className="font-extrabold text-ink">{value}</span>
              <span className="font-body text-sm text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Mobile trust pills ────────────────────── */}
        <div className="mt-3 flex gap-2 md:hidden">
          {shop.verified && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
              <ShieldCheck size={12} /> Vendeur vérifié
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
            <Zap size={12} /> Répond rapidement
          </span>
        </div>

        {/* ── Tabs ──────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-between border-b border-border">
          <div className="flex overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {t}{t === "Produits" ? ` ${productCount}` : t === "Avis" ? ` ${shop.reviewCount}` : ""}
              </button>
            ))}
          </div>
          {/* Desktop search/sort */}
          {tab === "Produits" && (
            <div className="hidden md:flex items-center gap-2 pb-1">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 h-9">
                <Search size={14} className="text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher dans la boutique..."
                  className="w-48 bg-transparent text-xs outline-none placeholder:text-muted font-body"
                />
              </div>
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-ink">
                <SlidersHorizontal size={13} /> Plus populaires <ChevronDown size={12} />
              </button>
            </div>
          )}
        </div>

        {/* ── Tab content ───────────────────────────── */}
        <div className="mt-4 md:mt-6">

          {/* PRODUITS */}
          {tab === "Produits" && (
            <div className="flex gap-6">

              {/* Desktop sidebar */}
              <aside className="hidden md:block w-52 shrink-0">
                <div className="sticky top-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-ink">Filtrer les produits</p>
                    <button
                      onClick={() => { setActiveCat("Tous les produits"); setFilterMin(null); setFilterMax(null); setMinPrice(""); setMaxPrice(""); }}
                      className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <RotateCcw size={11} /> Réinitialiser
                    </button>
                  </div>
                  <p className="mb-2 text-xs font-bold text-ink">Catégories</p>
                  <div className="space-y-1.5">
                    {cats.map((c) => {
                      const count = c === "Tous les produits" ? products.length : products.filter((p) => p.category?.name === c).length;
                      return (
                        <label key={c} className="flex cursor-pointer items-center gap-2">
                          <input type="checkbox" checked={activeCat === c} onChange={() => setActiveCat(c)} className="h-4 w-4 accent-brand rounded" />
                          <span className="font-body text-xs text-ink">{c} ({count})</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mb-2 mt-4 text-xs font-bold text-ink">Disponibilité</p>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand rounded" />
                    <span className="font-body text-xs text-ink">En stock ({products.filter((p) => p.status === "ACTIVE").length})</span>
                  </label>
                  <p className="mb-2 mt-4 text-xs font-bold text-ink">Prix (FCFA)</p>
                  <div className="flex items-center gap-2">
                    <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-full rounded-lg border border-border bg-page px-2 py-1.5 text-xs outline-none font-body" />
                    <span className="text-muted text-xs">—</span>
                    <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-full rounded-lg border border-border bg-page px-2 py-1.5 text-xs outline-none font-body" />
                  </div>
                  <button
                    onClick={() => { setFilterMin(minPrice ? Number(minPrice) : null); setFilterMax(maxPrice ? Number(maxPrice) : null); }}
                    className="mt-2 w-full rounded-lg border border-brand py-1.5 text-xs font-semibold text-brand hover:bg-brand-soft"
                  >
                    Appliquer
                  </button>
                </div>
              </aside>

              {/* Product grid */}
              <div className="flex-1 min-w-0">

                {/* Mobile: search + filter + sort + category pills */}
                <div className="md:hidden space-y-3 mb-4">
                  <div className="flex gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-white px-3 h-11">
                      <Search size={15} className="text-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher dans cette boutique..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted font-body"
                      />
                    </div>
                    <button className="flex h-11 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-ink">
                      <Filter size={15} /> Filtrer
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 h-11">
                    <SlidersHorizontal size={14} className="text-muted" />
                    <span className="flex-1 text-sm font-body text-ink">Trier par : <strong>Pertinence</strong></span>
                    <ChevronDown size={14} className="text-muted" />
                  </div>
                  {/* Category pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {cats.map((c) => {
                      const label = c === "Tous les produits" ? "Tous" : c;
                      return (
                        <button
                          key={c}
                          onClick={() => setActiveCat(c)}
                          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                            activeCat === c
                              ? "border-brand bg-brand text-white"
                              : "border-border bg-white text-ink"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop header */}
                <div className="mb-4 hidden md:block">
                  <h2 className="font-bold text-ink">Produits de {shop.name}</h2>
                  <p className="font-body text-xs text-muted">{filtered.length} produits disponibles</p>
                </div>

                {/* Grid — 2 cols mobile, 4 cols desktop */}
                {filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package size={40} className="mx-auto mb-3 text-muted/40" />
                    <p className="text-sm text-muted">Aucun produit trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                    {filtered.map((p) => (
                      <Link key={p.id} href={`/produits/${p.slug}`}>
                        <article className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                          <div className="relative aspect-square overflow-hidden bg-brand/5 md:aspect-[4/3]">
                            {p.images?.[0]?.url ? (
                              <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-brand-soft">
                                <Package size={32} className="text-brand/40" />
                              </div>
                            )}
                            {/* Badge — desktop only */}
                            {p.badge && (
                              <span className="absolute left-2 top-2 hidden md:block rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                                {p.badge}
                              </span>
                            )}
                            <button
                              onClick={(e) => { e.preventDefault(); toggleLike(p.id); }}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
                            >
                              <Heart size={13} className={liked.has(p.id) ? "fill-red-500 text-red-500" : "text-muted"} />
                            </button>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-bold text-ink leading-tight">{p.name}</h3>
                            <p className="font-body mt-0.5 flex items-center gap-1 text-xs text-muted">
                              <MapPin size={10} className="text-brand shrink-0" />
                              {shopCity || "Sénégal"} · {p.unit}
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-1">
                              <div>
                                <span className="font-extrabold text-brand text-base leading-none">
                                  {p.basePrice.toLocaleString("fr-SN")} <span className="text-[10px] font-medium">FCFA</span>
                                </span>
                              </div>
                              {/* Mobile: icon-only cart button */}
                              <button
                                onClick={(e) => e.preventDefault()}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white md:hidden"
                              >
                                <ShoppingCart size={16} />
                              </button>
                              {/* Desktop: text button */}
                              <button
                                onClick={(e) => e.preventDefault()}
                                className="hidden md:flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
                              >
                                <ShoppingCart size={13} /> Ajouter
                              </button>
                            </div>
                            {/* Verified seller row — mobile */}
                            <div className="mt-1.5 flex items-center gap-1 font-body text-[11px] text-muted md:hidden">
                              <CheckCircle size={11} className="text-brand shrink-0" />
                              <span>{shop.name}</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* À PROPOS */}
          {tab === "À propos" && (
            <div className="max-w-xl space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Description</h3>
                <p className="font-body mt-2 text-sm leading-relaxed text-ink">
                  {shop.description || "Aucune description disponible."}
                </p>
              </div>
              <div className="border-t border-border pt-5 space-y-3">
                {[
                  { label: "Localisation",  value: location },
                  shop.phone ? { label: "Téléphone", value: shop.phone } : null,
                  shop.since ? { label: "Membre depuis", value: new Date(shop.since).getFullYear().toString() } : null,
                ].filter(Boolean).map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 font-body text-xs font-semibold text-muted">{label}</span>
                    <span className="font-body text-sm text-ink">{value}</span>
                  </div>
                ))}
              </div>
              {shop.phone && (
                <div className="border-t border-border pt-4">
                  <a href={`tel:${shop.phone}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white">
                    <Phone size={15} /> Appeler l&apos;éleveur
                  </a>
                </div>
              )}
            </div>
          )}

          {/* AVIS */}
          {tab === "Avis" && (
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="text-center shrink-0">
                  <p className="text-4xl font-extrabold text-brand">{shop.ratingAvg > 0 ? shop.ratingAvg.toFixed(1) : "—"}</p>
                  <div className="mt-1 flex gap-0.5 justify-center">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} className={s <= Math.round(shop.ratingAvg) ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                    ))}
                  </div>
                  <p className="font-body mt-1 text-xs text-muted">{shop.reviewCount} avis</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map((s) => {
                    const count = reviews.filter((r) => r.rating === s).length;
                    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="font-body w-3 text-xs text-muted">{s}</span>
                        <div className="flex-1 h-2 rounded-full bg-page overflow-hidden">
                          <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-muted">
                  Aucun avis pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={12} className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-border"} />
                          ))}
                        </div>
                        <span className="font-body text-[11px] text-muted">
                          {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {r.comment && <p className="font-body mt-2 text-sm text-ink">{r.comment}</p>}
                      <p className="font-body mt-1 text-xs font-semibold text-brand">{r.user?.fullName ?? "Client"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONDITIONS */}
          {tab === "Conditions" && (
            <div className="max-w-xl rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 font-body text-sm text-muted leading-relaxed">
              <h3 className="font-bold text-ink">Conditions de vente</h3>
              <p>Les animaux sont vendus vivants, sains et vaccinés. Tout achat est définitif après confirmation de la commande.</p>
              <p>La livraison est disponible dans un rayon de 50 km. Des frais de livraison s&apos;appliquent selon la distance.</p>
              <p>En cas de litige, contacter directement l&apos;éleveur ou notre service support dans les 24h suivant la réception.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
