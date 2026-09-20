"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  CreditCard,
  Edit3,
  Eye,
  MapPin,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  TrendingUp,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import {
  getSellerDashboard,
  getSellerProducts,
  getSellerDeliveryZones,
  getSellerStats,
  getMe,
} from "@/lib/api";
import type { Product, DeliveryZone } from "@/lib/types";

// ── Shared UI helpers (pure, no data) ──

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.4px] text-[#1F2937] md:text-3xl">{title}</h1>
        <p className="font-body mt-1 text-sm text-[#6B7280]">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] ${color}`}>
        <Icon size={19} />
      </div>
      <p className="text-2xl font-extrabold text-[#1F2937]">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="font-body text-xs text-[#6B7280]">{label}</p>
        <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-bold text-[#6B7280]">{sub}</span>
      </div>
    </div>
  );
}


function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[#FAFAFA] p-2">
      <p className="text-sm font-extrabold text-[#1F2937]">{value}</p>
      <p className="font-body text-[10px] text-[#6B7280]">{label}</p>
    </div>
  );
}

function SettingBox({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-4">
      <Icon size={18} className="mb-3 text-[#22A849]" />
      <p className="font-body text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 font-semibold text-[#1F2937]">{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-[#F1F5F9]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-[16px] bg-[#F1F5F9]" />
        ))}
      </div>
      <div className="h-64 rounded-[18px] bg-[#F1F5F9]" />
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#E5E7EB] bg-white py-16 px-6 text-center shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9] text-[#9CA3AF]">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-[#1F2937]">{title}</h3>
      <p className="font-body mt-2 max-w-sm text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const statusLabel = product.status === "ACTIVE" ? "Actif" : product.status === "OUT_OF_STOCK" ? "Rupture" : product.status === "DRAFT" ? "Brouillon" : "Suspendu";
  const statusColors: Record<string, string> = {
    Actif: "bg-[#DCFCE7] text-[#15803D]",
    Rupture: "bg-[#F1F5F9] text-[#64748B]",
    Brouillon: "bg-[#FFF7ED] text-[#C2410C]",
    Suspendu: "bg-[#FEE2E2] text-[#DC2626]",
  };
  const image = product.images?.[0]?.url ?? "/placeholder-product.jpg";

  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <img src={image} alt={product.name} className="h-40 w-full rounded-[13px] object-cover" />
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-bold text-[#1F2937]">{product.name}</h2>
            <p className="font-body text-xs text-[#6B7280]">{product.category?.name ?? "—"}</p>
          </div>
          <Badge className={`rounded-full px-3 py-1 ${statusColors[statusLabel] ?? statusColors.Suspendu}`}>{statusLabel}</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold text-[#22A849]">{product.basePrice.toLocaleString()} F</p>
            <p className="font-body text-xs text-[#6B7280]">{product.stock > 0 ? `${product.stock} en stock` : "Stock epuise"}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#1F2937] transition hover:border-[#22A849] hover:text-[#22A849]">
              <Edit3 size={15} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#22A849] transition hover:bg-[#F0FDF4]">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overview Page ──

export function OverviewPage() {
  const [dashboard, setDashboard] = useState<{ revenueMonth: number; ordersCount: number; activeProducts: number; ratingAverage: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Ma boutique");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gg-user");
      if (stored) {
        const u = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (u.fullName) setUserName(u.fullName);
        else if (u.shopName) setUserName(u.shopName);
      }
    } catch {}

    Promise.all([getSellerDashboard(), getSellerProducts()])
      .then(([d, p]) => {
        setDashboard(d);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <section className="mb-6 grid gap-4 xl:grid-cols-[1.35fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[18px] bg-[#1F2937] p-6 text-white shadow-[0_12px_32px_rgba(31,41,55,.16)]">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-[#22A849]/25" />
          <div className="relative">
            <p className="font-body text-sm text-[#9CA3AF]">Bienvenue</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.6px]">{userName}</h1>
            <p className="font-body mt-2 max-w-xl text-sm leading-6 text-[#D1D5DB]">
              Suivez vos ventes, preparez les commandes et gardez votre inventaire a jour.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/vendeur/produits/ajouter" className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#22A849] px-5 text-sm font-bold text-white">
                <Plus size={16} />
                Ajouter produit
              </Link>
              <Link href="/vendeur/commandes" className="inline-flex h-11 items-center justify-center rounded-[11px] border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white">
                Voir commandes
              </Link>
              <Link href="/vendeur/livraison" className="inline-flex h-11 items-center justify-center rounded-[11px] border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white">
                Zones livraison
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-[#6B7280]">Resume</p>
              <h2 className="font-bold text-[#1F2937]">Ce mois</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-[14px] bg-[#FAFAFA] p-4">
              <p className="font-body text-xs text-[#6B7280]">Chiffre d&apos;affaires</p>
              <p className="mt-1 text-xl font-extrabold text-[#22A849]">{dashboard ? `${dashboard.revenueMonth.toLocaleString()} F` : "—"}</p>
            </div>
            <div className="rounded-[14px] bg-[#FAFAFA] p-4">
              <p className="font-body text-xs text-[#6B7280]">Commandes</p>
              <p className="mt-1 text-xl font-extrabold text-[#1F2937]">{dashboard?.ordersCount ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ventes ce mois" value={dashboard ? `${Math.round(dashboard.revenueMonth / 1000)}K` : "—"} sub="FCFA" icon={Wallet} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="Commandes" value={String(dashboard?.ordersCount ?? 0)} sub="ce mois" icon={ShoppingBag} color="bg-[#EFF6FF] text-[#2563EB]" />
        <StatCard label="Produits actifs" value={String(dashboard?.activeProducts ?? 0)} sub={`sur ${products.length}`} icon={Package} color="bg-[#DCFCE7] text-[#15803D]" />
        <StatCard label="Note moyenne" value={dashboard?.ratingAverage ? dashboard.ratingAverage.toFixed(1) : "—"} sub="avis" icon={Star} color="bg-[#FFF7ED] text-[#C2410C]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Commandes</h2>
              <p className="font-body text-xs text-[#6B7280]">Demandes client et suivi preparation</p>
            </div>
            <Link href="/vendeur/commandes" className="text-xs font-bold text-[#22A849]">Voir tout</Link>
          </div>
          <EmptyState icon={ShoppingBag} title="Aucune commande" description="Les commandes de vos clients apparaitront ici." />
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Inventaire</h2>
              <p className="font-body text-xs text-[#6B7280]">Produits a surveiller</p>
            </div>
            <Link href="/vendeur/produits" className="text-xs font-bold text-[#22A849]">Gerer</Link>
          </div>
          {products.length === 0 ? (
            <EmptyState icon={Package} title="Aucun produit" description="Ajoutez votre premier produit pour commencer." />
          ) : (
            <div className="space-y-3">
              {products.slice(0, 4).map((product) => {
                const image = product.images?.[0]?.url ?? "/placeholder-product.jpg";
                return (
                  <div key={product.id} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                    <img src={image} alt={product.name} className="h-12 w-12 rounded-[10px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">{product.name}</p>
                      <p className="font-body text-xs text-[#6B7280]">{product.stock > 0 ? `${product.stock} disponibles` : "Rupture de stock"}</p>
                    </div>
                    <p className="text-sm font-bold text-[#22A849]">{product.basePrice.toLocaleString()} F</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ── Products Page ──

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getSellerProducts()
      .then((p) => setProducts(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" && p.status === "ACTIVE") || (statusFilter === "rupture" && p.status === "OUT_OF_STOCK");
    return matchSearch && matchStatus;
  });

  return (
    <>
      <PageHeader
        title="Mes produits"
        subtitle="Ajoutez, modifiez et suivez vos produits disponibles."
        action={<Link href="/vendeur/produits/ajouter" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white"><Plus size={16} /> Ajouter</Link>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex h-11 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3">
          <Search size={17} className="text-[#9CA3AF]" />
          <input placeholder="Rechercher un produit" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-sm outline-none">
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="rupture">Rupture</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="Aucun produit" description={products.length === 0 ? "Ajoutez votre premier produit pour commencer a vendre." : "Aucun produit ne correspond a votre recherche."} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </>
  );
}

// ── Orders Page (empty state — no seller orders endpoint) ──

export function OrdersPage() {
  return (
    <>
      <PageHeader title="Commandes" subtitle="Traitez les commandes entrantes et suivez les livraisons." />
      <EmptyState icon={ShoppingBag} title="Aucune commande" description="Les commandes de vos clients apparaitront ici au fur et a mesure des achats." />
    </>
  );
}

// ── Order Detail Page (empty state) ──

export function OrderDetailPage({ orderId }: { orderId: string }) {
  return (
    <>
      <PageHeader
        title={orderId}
        subtitle="Detail de la commande"
        action={<Link href="/vendeur/commandes" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#1F2937]"><ArrowLeft size={16} /> Retour</Link>}
      />
      <EmptyState icon={ShoppingBag} title="Commande introuvable" description="Les details de cette commande ne sont pas disponibles pour le moment." />
    </>
  );
}

// ── Delivery Page ──

export function DeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerDeliveryZones()
      .then((z) => setZones(z))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  const activeZones = zones.filter((z) => z.active).length;
  const avgFee = zones.length > 0 ? Math.round(zones.reduce((sum, z) => sum + z.fee, 0) / zones.length) : 0;

  return (
    <>
      <PageHeader
        title="Zones de livraison"
        subtitle="Definissez ou vous livrez, les frais, les delais et le minimum de commande."
        action={<button className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white"><Plus size={16} /> Ajouter zone</button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Zones actives" value={String(activeZones)} sub={`sur ${zones.length}`} icon={MapPin} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="Zones totales" value={String(zones.length)} sub="configurees" icon={Truck} color="bg-[#EFF6FF] text-[#2563EB]" />
        <StatCard label="Frais moyens" value={avgFee > 0 ? `${avgFee.toLocaleString()} F` : "—"} sub="livraison" icon={Wallet} color="bg-[#DCFCE7] text-[#15803D]" />
        <StatCard label="Delai" value="—" sub="estime" icon={Clock} color="bg-[#FFF7ED] text-[#C2410C]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Zones configurees</h2>
              <p className="font-body text-xs text-[#6B7280]">Chaque zone peut avoir ses propres frais et delais.</p>
            </div>
            <select className="h-10 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm outline-none">
              <option>Toutes les zones</option>
              <option>Actives</option>
              <option>Inactives</option>
            </select>
          </div>

          {zones.length === 0 ? (
            <EmptyState icon={MapPin} title="Aucune zone" description="Ajoutez une zone de livraison pour commencer." />
          ) : (
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="rounded-[15px] border border-[#F1F1F1] bg-white p-4 transition hover:border-[#22A849]/30 hover:bg-[#FAFAFA]">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#F0FDF4] text-[#22A849]">
                        <MapPin size={19} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-[#1F2937]">{zone.name}</h3>
                          <Badge className={`rounded-full px-3 py-1 ${zone.active ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                            {zone.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="font-body mt-1 text-xs text-[#6B7280]">{zone.region} · {zone.city}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center md:min-w-[320px]">
                      <Metric label="Frais" value={`${zone.fee.toLocaleString()} F`} />
                      <Metric label="Delai" value={zone.estimatedTime} />
                      <Metric label="Minimum" value={`${zone.minimumOrderAmount.toLocaleString()} F`} />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] text-xs font-bold text-[#1F2937] transition hover:border-[#22A849] hover:text-[#22A849]">
                      <Edit3 size={14} /> Modifier
                    </button>
                    <button className={`inline-flex h-9 flex-1 items-center justify-center rounded-[10px] text-xs font-bold ${zone.active ? "bg-[#F1F5F9] text-[#64748B]" : "bg-[#22A849] text-white"}`}>
                      {zone.active ? "Desactiver" : "Activer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Ajouter rapidement</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6B7280]">Nom de la zone</label>
                <input className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" placeholder="ex. Rufisque" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6B7280]">Frais</label>
                  <input className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" placeholder="3000 F" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6B7280]">Delai</label>
                  <input className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" placeholder="1 h" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6B7280]">Minimum commande</label>
                <input className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" placeholder="10000 F" />
              </div>
              <button className="h-11 w-full rounded-[11px] bg-[#22A849] text-sm font-bold text-white">Enregistrer zone</button>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#BBF7D0] bg-[#F0FDF4] p-5 text-[#15803D]">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <ShieldCheck size={18} />
              Conseil livraison
            </div>
            <p className="font-body text-xs leading-5">Gardez les frais simples et adaptez le minimum de commande pour les zones eloignees.</p>
          </div>
        </aside>
      </div>
    </>
  );
}

// ── Stats Page ──

export function StatsPage() {
  const [stats, setStats] = useState<{ revenue: number; averageBasket: number; productViews: number; conversionRate: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSellerStats(), getSellerProducts()])
      .then(([s, p]) => {
        setStats(s);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <PageHeader title="Statistiques" subtitle="Analyse des ventes, produits et performances de la boutique." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="CA mensuel" value={stats ? `${Math.round(stats.revenue / 1000)}K` : "—"} sub="FCFA" icon={TrendingUp} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="Panier moyen" value={stats ? `${stats.averageBasket.toLocaleString()} F` : "—"} sub="FCFA" icon={Wallet} color="bg-[#DCFCE7] text-[#15803D]" />
        <StatCard label="Vues produits" value={stats ? stats.productViews.toLocaleString() : "—"} sub="total" icon={Eye} color="bg-[#EFF6FF] text-[#2563EB]" />
        <StatCard label="Conversion" value={stats ? `${stats.conversionRate.toFixed(1)}%` : "—"} sub="taux" icon={BarChart3} color="bg-[#FFF7ED] text-[#C2410C]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Ventes</h2>
          {stats ? (
            <div className="space-y-4">
              <div className="rounded-[14px] bg-[#FAFAFA] p-4">
                <p className="font-body text-xs text-[#6B7280]">Chiffre d&apos;affaires total</p>
                <p className="mt-1 text-2xl font-extrabold text-[#22A849]">{stats.revenue.toLocaleString()} F</p>
              </div>
              <div className="rounded-[14px] bg-[#FAFAFA] p-4">
                <p className="font-body text-xs text-[#6B7280]">Panier moyen</p>
                <p className="mt-1 text-2xl font-extrabold text-[#1F2937]">{stats.averageBasket.toLocaleString()} F</p>
              </div>
              <div className="rounded-[14px] bg-[#FAFAFA] p-4">
                <p className="font-body text-xs text-[#6B7280]">Taux de conversion</p>
                <p className="mt-1 text-2xl font-extrabold text-[#1F2937]">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          ) : (
            <EmptyState icon={BarChart3} title="Pas de donnees" description="Les statistiques de ventes apparaitront ici." />
          )}
        </div>
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Top produits</h2>
          {products.length === 0 ? (
            <EmptyState icon={Package} title="Aucun produit" description="Ajoutez des produits pour voir le classement." />
          ) : (
            <div className="space-y-3">
              {products.slice(0, 3).map((product, index) => {
                const image = product.images?.[0]?.url ?? "/placeholder-product.jpg";
                return (
                  <div key={product.id} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22A849] text-xs font-bold text-white">{index + 1}</span>
                    <img src={image} alt={product.name} className="h-11 w-11 rounded-[10px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">{product.name}</p>
                      <p className="font-body text-xs text-[#6B7280]">{product.basePrice.toLocaleString()} F</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Settings Page ──

export function SettingsPage() {
  const [user, setUser] = useState<{ fullName: string; phone: string; email: string | null; role: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((u) => setUser(u))
      .catch(() => {
        try {
          const stored = localStorage.getItem("gg-user");
          if (stored) setUser(JSON.parse(stored));
        } catch {}
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <PageHeader title="Parametres" subtitle="Informations boutique, paiement et securite." />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Boutique</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SettingBox icon={Store} label="Nom boutique" value={user?.fullName ?? "—"} />
            <SettingBox icon={MapPin} label="Telephone" value={user?.phone ?? "—"} />
            <SettingBox icon={User} label="Email" value={user?.email ?? "Non renseigne"} />
            <SettingBox icon={ShieldCheck} label="Statut" value={user?.status === "ACTIVE" ? "Compte actif" : user?.status === "PENDING" ? "En attente" : user?.status ?? "—"} />
          </div>
          <button className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
            <Edit3 size={15} /> Modifier boutique
          </button>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Paiements</h2>
          <EmptyState icon={CreditCard} title="Aucun moyen de paiement" description="La configuration des moyens de paiement sera bientot disponible." />
        </div>
      </div>
    </>
  );
}
