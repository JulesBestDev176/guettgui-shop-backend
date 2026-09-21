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
  EyeOff,
  Loader2,
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
  getSellerOrders,
  updateOrderStatus,
  updateSellerProduct,
  deleteSellerProduct,
  createSellerProduct,
  listCategories,
  getMe,
  getMyShop,
  updateMyShop,
  changePassword,
} from "@/lib/api";
import type { Product, DeliveryZone, Order, OrderListResponse, Category } from "@/lib/types";

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

function ProductCard({
  product,
  onUpdated,
  onDeleted,
}: {
  product: Product;
  onUpdated: (p: Product) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [price, setPrice] = useState(String(product.basePrice));
  const [stock, setStock] = useState(String(product.stock));
  const [status, setStatus] = useState(product.status);

  const statusLabel = status === "ACTIVE" ? "Actif" : status === "OUT_OF_STOCK" ? "Rupture" : status === "DRAFT" ? "Brouillon" : "Suspendu";
  const statusColors: Record<string, string> = {
    Actif: "bg-[#DCFCE7] text-[#15803D]",
    Rupture: "bg-[#F1F5F9] text-[#64748B]",
    Brouillon: "bg-[#FFF7ED] text-[#C2410C]",
    Suspendu: "bg-[#FEE2E2] text-[#DC2626]",
  };
  const image = product.images?.[0]?.url ?? "/placeholder-product.jpg";

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSellerProduct(product.id, {
        basePrice: parseFloat(price) || product.basePrice,
        stock: parseInt(stock) || 0,
        status,
      });
      onUpdated(updated);
      setEditing(false);
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    setDeleting(true);
    try {
      await deleteSellerProduct(product.id);
      onDeleted(product.id);
    } catch {} finally {
      setDeleting(false);
    }
  };

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

        {editing ? (
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1 text-[10px] font-semibold text-[#6B7280]">Prix (F)</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm outline-none focus:border-[#22A849] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold text-[#6B7280]">Stock</p>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm outline-none focus:border-[#22A849] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm outline-none focus:border-[#22A849]"
            >
              <option value="ACTIVE">Actif</option>
              <option value="OUT_OF_STOCK">Rupture</option>
              <option value="DRAFT">Brouillon</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex h-8 flex-1 items-center justify-center rounded-[8px] bg-[#22A849] text-xs font-bold text-white disabled:opacity-60"
              >
                {saving ? "…" : "Enregistrer"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex h-8 flex-1 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-extrabold text-[#22A849]">{product.basePrice.toLocaleString()} F</p>
              <p className="font-body text-xs text-[#6B7280]">{product.stock > 0 ? `${product.stock} en stock` : "Stock épuisé"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-[#1F2937] transition hover:border-[#22A849] hover:text-[#22A849]"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-red-500 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Overview Page ──

export function OverviewPage() {
  const [dashboard, setDashboard] = useState<{ revenueMonth: number; ordersCount: number; activeProducts: number; ratingAverage: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
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

    Promise.all([getSellerDashboard(), getSellerProducts(), getSellerOrders({ limit: 5 })])
      .then(([d, p, o]) => {
        setDashboard(d);
        setProducts(p);
        setRecentOrders(o.data);
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
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Link href="/vendeur/produits" className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white sm:h-11 sm:px-5">
                <Plus size={16} />
                Ajouter produit
              </Link>
              <Link href="/vendeur/commandes" className="inline-flex h-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white sm:h-11 sm:px-5">
                Commandes
              </Link>
              <Link href="/vendeur/statistiques" className="inline-flex h-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white sm:h-11 sm:px-5">
                Statistiques
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
              <h2 className="text-lg font-bold text-[#1F2937]">Commandes récentes</h2>
              <p className="font-body text-xs text-[#6B7280]">Demandes client et suivi preparation</p>
            </div>
            <Link href="/vendeur/commandes" className="text-xs font-bold text-[#22A849]">Voir tout</Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="Aucune commande" description="Les commandes de vos clients apparaitront ici." />
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1F2937]">#{order.code}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[order.status] ?? "bg-[#F1F5F9] text-[#64748B]"}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#6B7280] truncate">{order.customerName}</p>
                  </div>
                  <p className="text-sm font-bold text-[#22A849] shrink-0">{order.total.toLocaleString()} F</p>
                </div>
              ))}
            </div>
          )}
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

// ── Add Product Form ──

function AddProductForm({ onAdded, onCancel }: { onAdded: (p: Product) => void; onCancel: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !categoryId || !basePrice) {
      setError("Nom, catégorie et prix sont requis");
      return;
    }
    setSaving(true);
    try {
      const product = await createSellerProduct({
        name: name.trim(),
        categoryId,
        basePrice: parseFloat(basePrice),
        unit: unit.trim() || "kg",
        stock: parseInt(stock) || 0,
        description: description.trim() || undefined,
      });
      onAdded(product);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-[18px] border border-[#22A849]/30 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F2937]">Nouveau produit</h2>
        <button onClick={onCancel} className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#F1F5F9] hover:text-[#1F2937]">
          <ArrowLeft size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="rounded-[10px] bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-[#6B7280]">Nom du produit *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex. Tomates fraîches"
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280]">Catégorie *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280]">Prix (FCFA) *</label>
            <input value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required type="number" min="0" placeholder="ex. 5000"
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280]">Unité</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, pièce, litre…"
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280]">Stock initial</label>
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" placeholder="0"
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-[#6B7280]">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description courte du produit"
              className="w-full rounded-[12px] border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#22A849] resize-none" />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={saving}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] text-sm font-bold text-white disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <><Plus size={15} /> Créer le produit</>}
          </button>
          <button type="button" onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#E5E7EB] px-4 text-sm font-semibold text-[#6B7280]">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Products Page ──

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    getSellerProducts()
      .then((p) => setProducts(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  const activeCount = products.filter((p) => p.status === "ACTIVE").length;
  const ruptureCount = products.filter((p) => p.status === "OUT_OF_STOCK").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;

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
        action={
          !showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
              <Plus size={16} /> Ajouter produit
            </button>
          ) : null
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total produits" value={String(products.length)} sub="catalogue" icon={Package} color="bg-[#EFF6FF] text-[#2563EB]" />
        <StatCard label="Actifs" value={String(activeCount)} sub="en vente" icon={TrendingUp} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="Rupture de stock" value={String(ruptureCount)} sub="à réappro" icon={ShoppingBag} color="bg-[#FFF7ED] text-[#C2410C]" />
        <StatCard label="Brouillons" value={String(draftCount)} sub="non publiés" icon={Star} color="bg-[#F5F3FF] text-[#7C3AED]" />
      </div>
      {showAddForm && (
        <AddProductForm
          onAdded={(product) => {
            setProducts((prev) => [product, ...prev]);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdated={(updated) => setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p))}
              onDeleted={(id) => setProducts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ── Order status helpers ──

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "Préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-[#FFF7ED] text-[#C2410C]",
  CONFIRMED: "bg-[#EFF6FF] text-[#2563EB]",
  PREPARING: "bg-[#F5F3FF] text-[#7C3AED]",
  READY: "bg-[#F0FDF4] text-[#15803D]",
  DELIVERED: "bg-[#DCFCE7] text-[#15803D]",
  CANCELLED: "bg-[#FEE2E2] text-[#DC2626]",
};

const NEXT_STATUS: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

const NEXT_LABEL: Record<string, string> = {
  PENDING: "Confirmer",
  CONFIRMED: "En préparation",
  PREPARING: "Prête",
  READY: "Livrée",
};

// ── Orders Page ──

export function OrdersPage() {
  const [result, setResult] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getSellerOrders({ status: statusFilter !== "all" ? statusFilter : undefined, limit: 50 })
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleAdvance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdating(order.id);
    try {
      await updateOrderStatus(order.id, next);
      load();
    } catch {
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingSkeleton />;

  const orders = result?.data ?? [];
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const inProgress = orders.filter((o) => ["CONFIRMED", "PREPARING"].includes(o.status)).length;
  const ready = orders.filter((o) => o.status === "READY").length;
  const totalRevenue = orders.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <PageHeader
        title="Commandes"
        subtitle="Traitez les commandes entrantes de vos clients."
        action={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm outline-none"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total commandes" value={String(orders.length)} sub="chargées" icon={ShoppingBag} color="bg-[#EFF6FF] text-[#2563EB]" />
        <StatCard label="En attente" value={String(pending)} sub="à traiter" icon={Clock} color="bg-[#FFF7ED] text-[#C2410C]" />
        <StatCard label="En cours" value={String(inProgress + ready)} sub="en préparation" icon={TrendingUp} color="bg-[#F5F3FF] text-[#7C3AED]" />
        <StatCard label="CA livré" value={totalRevenue > 0 ? `${Math.round(totalRevenue / 1000)}K` : "0"} sub="FCFA" icon={Wallet} color="bg-[#F0FDF4] text-[#22A849]" />
      </div>
      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Aucune commande" description="Les commandes de vos clients apparaitront ici au fur et a mesure des achats." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#1F2937]">#{order.code}</p>
                    <Badge className={`rounded-full px-2.5 py-0.5 text-[11px] ${STATUS_COLORS[order.status] ?? "bg-[#F1F5F9] text-[#64748B]"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                  <p className="font-body mt-1 text-sm text-[#6B7280] truncate">{order.customerName}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-extrabold text-[#22A849]">{order.total.toLocaleString()} F</p>
                  <p className="font-body text-[11px] text-[#9CA3AF]">
                    {new Date(order.createdAt).toLocaleDateString("fr-SN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              {/* Details */}
              <p className="font-body mt-2 text-xs text-[#9CA3AF] truncate">{order.deliveryAddress}</p>
              <p className="font-body mt-0.5 text-xs text-[#6B7280] truncate">
                {order.items.length} article{order.items.length > 1 ? "s" : ""} · {order.items.map((i) => i.name).join(", ")}
              </p>
              {/* Actions */}
              <div className="mt-3 flex gap-2">
                {NEXT_STATUS[order.status] && (
                  <button
                    disabled={updating === order.id}
                    onClick={() => handleAdvance(order)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#22A849] text-xs font-bold text-white disabled:opacity-60"
                  >
                    {updating === order.id ? "…" : NEXT_LABEL[order.status]}
                  </button>
                )}
                <Link
                  href={`/vendeur/commandes/${order.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#E5E7EB] px-4 text-xs font-bold text-[#1F2937] hover:border-[#22A849]"
                >
                  Détail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Order Detail Page ──

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Find by id from orders list
    getSellerOrders({ limit: 200 })
      .then((res) => {
        const found = res.data.find((o) => o.id === orderId || o.code === orderId);
        setOrder(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleAdvance = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order.id, next);
      setOrder(updated);
    } catch {
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <PageHeader
        title={order ? `Commande #${order.code}` : orderId}
        subtitle="Détail de la commande"
        action={
          <Link href="/vendeur/commandes" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#1F2937]">
            <ArrowLeft size={16} /> Retour
          </Link>
        }
      />
      {!order ? (
        <EmptyState icon={ShoppingBag} title="Commande introuvable" description="Les details de cette commande ne sont pas disponibles." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {/* Items */}
            <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
              <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Articles ({order.items.length})</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#F1F5F9]">
                      {item.product?.images?.[0]?.url && (
                        <img src={item.product.images[0].url} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</p>
                      <p className="font-body text-xs text-[#6B7280]">{item.quantity} × {item.unitPrice.toLocaleString()} F</p>
                    </div>
                    <p className="text-sm font-bold text-[#22A849]">{item.total.toLocaleString()} F</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#F1F1F1] pt-4">
                <p className="font-semibold text-[#1F2937]">Total</p>
                <p className="text-xl font-extrabold text-[#22A849]">{order.total.toLocaleString()} F</p>
              </div>
            </div>

            {/* History */}
            {order.history && order.history.length > 0 && (
              <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
                <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Historique</h2>
                <div className="space-y-2">
                  {order.history.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[h.status] ?? "bg-[#F1F5F9] text-[#64748B]"}`}>
                        {STATUS_LABELS[h.status] ?? h.status}
                      </span>
                      <span className="font-body text-[#6B7280]">
                        {new Date(h.createdAt).toLocaleString("fr-SN")}
                      </span>
                      {h.note && <span className="text-[#9CA3AF]">— {h.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side info */}
          <aside className="space-y-4">
            <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
              <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Client</h2>
              <div className="space-y-3">
                <div className="rounded-[14px] bg-[#FAFAFA] p-3">
                  <p className="font-body text-xs text-[#6B7280]">Nom</p>
                  <p className="mt-0.5 font-semibold text-[#1F2937]">{order.customerName}</p>
                </div>
                <div className="rounded-[14px] bg-[#FAFAFA] p-3">
                  <p className="font-body text-xs text-[#6B7280]">Téléphone</p>
                  <p className="mt-0.5 font-semibold text-[#1F2937]">{order.customerPhone}</p>
                </div>
                <div className="rounded-[14px] bg-[#FAFAFA] p-3">
                  <p className="font-body text-xs text-[#6B7280]">Adresse</p>
                  <p className="mt-0.5 font-semibold text-[#1F2937]">{order.deliveryAddress}</p>
                </div>
                {order.note && (
                  <div className="rounded-[14px] bg-[#FAFAFA] p-3">
                    <p className="font-body text-xs text-[#6B7280]">Note</p>
                    <p className="mt-0.5 font-semibold text-[#1F2937]">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1F2937]">Statut</h2>
                <Badge className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </Badge>
              </div>
              {NEXT_STATUS[order.status] && (
                <button
                  disabled={updating}
                  onClick={handleAdvance}
                  className="mt-2 h-11 w-full rounded-[11px] bg-[#22A849] text-sm font-bold text-white disabled:opacity-60"
                >
                  {updating ? "Mise à jour…" : `Passer à : ${STATUS_LABELS[NEXT_STATUS[order.status]]}`}
                </button>
              )}
              {order.status === "DELIVERED" && (
                <p className="mt-2 text-center font-body text-sm text-[#22A849] font-semibold">✓ Commande livrée</p>
              )}
              {order.status === "CANCELLED" && (
                <p className="mt-2 text-center font-body text-sm text-[#DC2626] font-semibold">✗ Commande annulée</p>
              )}
            </div>
          </aside>
        </div>
      )}
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
              <button disabled className="h-11 w-full rounded-[11px] bg-[#22A849]/60 text-sm font-bold text-white cursor-not-allowed" title="Fonctionnalité bientôt disponible">Enregistrer zone</button>
              <p className="text-center font-body text-[10px] text-[#9CA3AF]">Zones de livraison — bientôt disponible</p>
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

// ── Settings Page (profil + boutique + sécurité) ──

export function SettingsPage() {
  const [user, setUser] = useState<{ fullName: string; phone: string; email: string | null; role: string; status: string } | null>(null);
  const [shop, setShop] = useState<{ name: string; description: string | null; phone: string | null; address: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopAddress, setShopAddress] = useState("");

  useEffect(() => {
    Promise.all([
      getMe().catch(() => {
        try { const s = localStorage.getItem("gg-user"); return s ? JSON.parse(s) : null; } catch { return null; }
      }),
      getMyShop().catch(() => null),
    ]).then(([u, s]) => {
      if (u) setUser(u);
      if (s) {
        setShop(s);
        setShopName(s.name ?? "");
        setShopDesc(s.description ?? "");
        setShopPhone(s.phone ?? "");
        setShopAddress(s.address ?? "");
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveShop = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateMyShop({
        name: shopName.trim() || undefined,
        description: shopDesc.trim() || undefined,
        phone: shopPhone.trim() || undefined,
        address: shopAddress.trim() || undefined,
      });
      setShop(updated);
      setEditingShop(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <PageHeader title="Paramètres" subtitle="Votre profil, votre boutique et la sécurité du compte." />

      {/* Profil personnel */}
      <div className="mb-6 rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22A849] text-xl font-bold text-white">
            {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">{user?.fullName ?? "—"}</h2>
            <p className="font-body text-sm text-[#6B7280]">{user?.phone ?? ""}{user?.email ? ` · ${user.email}` : ""}</p>
          </div>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${user?.status === "ACTIVE" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FFF7ED] text-[#C2410C]"}`}>
            {user?.status === "ACTIVE" ? "Actif" : user?.status === "PENDING" ? "En attente" : user?.status ?? "—"}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <SettingBox icon={User} label="Nom complet" value={user?.fullName ?? "—"} />
          <SettingBox icon={Store} label="Téléphone" value={user?.phone ?? "—"} />
          <SettingBox icon={User} label="Email" value={user?.email ?? "Non renseigné"} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        {/* Boutique */}
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1F2937]">Ma boutique</h2>
            {!editingShop && (
              <button onClick={() => setEditingShop(true)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] px-3 text-xs font-bold text-[#1F2937] hover:border-[#22A849] hover:text-[#22A849]">
                <Edit3 size={14} /> Modifier
              </button>
            )}
          </div>

          {editingShop ? (
            <div className="space-y-3">
              {saveError && <div className="rounded-[10px] bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</div>}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6B7280]">Nom de la boutique</label>
                <input value={shopName} onChange={(e) => setShopName(e.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6B7280]">Description</label>
                <textarea value={shopDesc} onChange={(e) => setShopDesc(e.target.value)} rows={3}
                  className="w-full rounded-[12px] border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#22A849] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6B7280]">Téléphone boutique</label>
                  <input value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} type="tel"
                    className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6B7280]">Adresse</label>
                  <input value={shopAddress} onChange={(e) => setShopAddress(e.target.value)}
                    className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSaveShop} disabled={saving}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] text-sm font-bold text-white disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <><Edit3 size={14} /> Enregistrer</>}
                </button>
                <button onClick={() => { setEditingShop(false); setSaveError(""); }}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-sm font-semibold text-[#6B7280]">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <SettingBox icon={Store} label="Nom boutique" value={shop?.name ?? user?.fullName ?? "—"} />
              <SettingBox icon={MapPin} label="Téléphone" value={shop?.phone ?? user?.phone ?? "—"} />
              {shop?.description && (
                <div className="md:col-span-2 rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-4">
                  <p className="font-body text-xs text-[#6B7280]">Description</p>
                  <p className="mt-1 text-sm text-[#1F2937]">{shop.description}</p>
                </div>
              )}
              {shop?.address && (
                <div className="md:col-span-2 rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-4">
                  <p className="font-body text-xs text-[#6B7280]">Adresse</p>
                  <p className="mt-1 text-sm text-[#1F2937]">{shop.address}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sécurité */}
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Changer le mot de passe</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (next !== confirm) { setError("Les nouveaux mots de passe ne correspondent pas"); return; }
    if (next.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }
    setSaving(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="rounded-[10px] bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-[10px] bg-green-50 px-3 py-2 text-sm text-green-700">Mot de passe mis à jour !</div>}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#6B7280]">Mot de passe actuel</label>
        <div className="relative">
          <input type={showCurrent ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} required
            className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 pr-10 text-sm outline-none focus:border-[#22A849]" />
          <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937]" tabIndex={-1}>
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#6B7280]">Nouveau mot de passe</label>
        <div className="relative">
          <input type={showNext ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)} required
            className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 pr-10 text-sm outline-none focus:border-[#22A849]" />
          <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937]" tabIndex={-1}>
            {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#6B7280]">Confirmer le nouveau mot de passe</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
          className="h-11 w-full rounded-[12px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#22A849]" />
      </div>
      <button type="submit" disabled={saving}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#22A849] text-sm font-bold text-white disabled:opacity-60">
        {saving ? <Loader2 size={15} className="animate-spin" /> : "Changer le mot de passe"}
      </button>
    </form>
  );
}
