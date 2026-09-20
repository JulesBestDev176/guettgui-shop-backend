"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  User,
  Wallet,
  Loader2,
  Package,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/primitives";
import { listMyOrders, listFavorites, getMe } from "@/lib/api";
import type { Order, Favorite, User as UserType } from "@/lib/types";

// ── Status helpers ──
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:   "bg-[#FFF7ED] text-[#C2410C]",
  CONFIRMED: "bg-[#F0FDF4] text-[#1A8A3A]",
  PREPARING: "bg-[#F0FDF4] text-[#1A8A3A]",
  READY:     "bg-[#F0FDF4] text-[#15803D]",
  DELIVERED: "bg-[#DCFCE7] text-[#15803D]",
  CANCELLED: "bg-[#F1F5F9] text-[#64748B]",
};

// ── Shared components ──
function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
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

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
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

function OrderRow({ order }: { order: Order }) {
  const firstImage = order.items?.[0]?.product?.images?.[0]?.url;
  const itemCount = order.items?.length ?? 0;

  return (
    <Link
      href={`/client/commandes/${order.id}`}
      className="grid gap-3 rounded-[14px] border border-[#F1F1F1] bg-white p-4 transition hover:border-[#22A849]/30 hover:bg-[#FAFAFA] md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center"
    >
      {firstImage ? (
        <img src={firstImage} alt={order.code} className="h-12 w-12 rounded-[12px] object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-brand-soft">
          <Package size={20} className="text-brand" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-[#1F2937]">{order.code}</p>
        <p className="font-body text-xs text-[#6B7280]">
          {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
          {" · "}{itemCount} article{itemCount > 1 ? "s" : ""}
          {order.deliveryAddress ? ` · ${order.deliveryAddress}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={`rounded-full px-3 py-1 ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </Badge>
      </div>
      <p className="font-bold text-[#1F2937] md:text-right">{order.total.toLocaleString("fr-SN")} F</p>
      <ArrowRight size={17} className="hidden text-[#9CA3AF] md:block" />
    </Link>
  );
}

// ── Panels ──
function OrdersPanel({ compact = false, orders, loading }: { compact?: boolean; orders: Order[]; loading: boolean }) {
  const displayed = compact ? orders.slice(0, 3) : orders;

  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1F2937]">Commandes récentes</h2>
          <p className="font-body text-xs text-[#6B7280]">Vos dernières commandes et leur statut</p>
        </div>
        {compact && <Link href="/client/commandes" className="text-xs font-bold text-[#22A849]">Voir tout</Link>}
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
      ) : displayed.length === 0 ? (
        <div className="py-10 text-center">
          <ShoppingBag size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-[#6B7280]">Aucune commande pour le moment.</p>
          <Link href="/catalogue" className="mt-2 inline-block text-sm font-semibold text-[#22A849] hover:underline">Commander maintenant</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((order) => <OrderRow key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}

function QuickActions() {
  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Actions rapides</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Rechercher", href: "/catalogue",      icon: Search },
          { label: "Suivi",      href: "/suivi-commande", icon: Clock },
          { label: "Boutiques",  href: "/boutiques",      icon: MapPin },
          { label: "Favoris",    href: "/client/favoris", icon: Heart },
        ].map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-[13px] border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-center transition hover:border-[#22A849] hover:bg-[#F0FDF4]">
            <Icon size={20} className="mx-auto mb-2 text-[#22A849]" />
            <span className="text-xs font-semibold text-[#1F2937]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FavoritesPanel({ compact = false, favorites, loading }: { compact?: boolean; favorites: Favorite[]; loading: boolean }) {
  const displayed = compact ? favorites.slice(0, 2) : favorites;

  return (
    <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1F2937]">{compact ? "Favoris" : "Mes favoris"}</h2>
        <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
      </div>
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-brand" /></div>
      ) : displayed.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#6B7280]">Aucun favori pour le moment.</p>
      ) : (
        <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"}>
          {displayed.map((item) => (
            <Link
              key={item.id}
              href={`/produits/${item.slug}`}
              className={compact ? "flex items-center gap-3" : "rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-3"}
            >
              {item.images?.[0]?.url ? (
                <img src={item.images[0].url} alt={item.name} className={compact ? "h-12 w-12 rounded-[10px] object-cover" : "mb-3 h-36 w-full rounded-[12px] object-cover"} />
              ) : (
                <div className={`flex items-center justify-center bg-brand-soft ${compact ? "h-12 w-12 rounded-[10px]" : "mb-3 h-36 w-full rounded-[12px]"}`}>
                  <Package size={compact ? 20 : 32} className="text-brand/40" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</p>
                <p className="font-body text-xs text-[#6B7280]">{item.shop?.name ?? "Éleveur"}</p>
                {!compact && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-[#22A849]">{item.basePrice.toLocaleString("fr-SN")} F</span>
                    <span className="rounded-lg bg-[#22A849] px-3 py-2 text-xs font-bold text-white">Commander</span>
                  </div>
                )}
              </div>
              {compact && <p className="text-sm font-bold text-[#22A849]">{item.basePrice.toLocaleString("fr-SN")} F</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SecurityCard() {
  return (
    <div className="rounded-[18px] border border-[#BBF7D0] bg-[#F0FDF4] p-5 text-[#15803D]">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <ShieldCheck size={18} />
        Paiement protégé
      </div>
      <p className="font-body text-xs leading-5">Vos paiements Dexpay restent sécurisés jusqu&apos;à confirmation de livraison.</p>
    </div>
  );
}

// ── Section pages ──
function OverviewPage({ user, orders, favorites, ordersLoading, favLoading }: {
  user: UserType | null;
  orders: Order[];
  favorites: Favorite[];
  ordersLoading: boolean;
  favLoading: boolean;
}) {
  const firstName = user?.fullName?.split(" ")[0] ?? "Bienvenue";
  const activeOrder = orders.find((o) => ["CONFIRMED", "PREPARING", "READY"].includes(o.status));

  return (
    <>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[18px] bg-[#1F2937] p-6 text-white shadow-[0_12px_32px_rgba(31,41,55,.16)]">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-[#22A849]/25" />
          <div className="relative">
            <p className="font-body text-sm text-[#9CA3AF]">Bonjour</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.6px]">{firstName}</h1>
            <p className="font-body mt-2 max-w-xl text-sm leading-6 text-[#D1D5DB]">
              Suivez vos commandes, retrouvez vos favoris et commandez rapidement vos produits frais.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogue" className="inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#22A849] px-5 text-sm font-bold text-white">
                Commander <ArrowRight size={16} />
              </Link>
              <Link href="/suivi-commande" className="inline-flex h-11 items-center justify-center rounded-[11px] border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white">
                Suivre une commande
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          {activeOrder ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-[#6B7280]">Commande active</p>
                  <h2 className="font-bold text-[#1F2937]">{STATUS_LABELS[activeOrder.status]}</h2>
                </div>
                <Badge className="rounded-full bg-[#F0FDF4] px-3 py-1 text-[#1A8A3A]">{activeOrder.code}</Badge>
              </div>
              <div className="flex items-center gap-4 rounded-[14px] bg-[#FAFAFA] p-3">
                {activeOrder.items?.[0]?.product?.images?.[0]?.url ? (
                  <img src={activeOrder.items[0].product.images[0].url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-soft">
                    <Package size={24} className="text-brand/40" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1F2937] truncate">{activeOrder.items?.[0]?.name ?? "Produit"}</p>
                  <p className="font-body text-xs text-[#6B7280]">{activeOrder.deliveryAddress}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div className={`h-full rounded-full bg-[#22A849] ${activeOrder.status === "CONFIRMED" ? "w-1/3" : activeOrder.status === "PREPARING" ? "w-2/3" : "w-4/5"}`} />
                  </div>
                </div>
              </div>
              <Link href="/suivi-commande" className="mt-4 flex h-10 items-center justify-center rounded-[10px] border border-[#E5E7EB] text-sm font-semibold text-[#1F2937]">
                Voir le suivi
              </Link>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-4 text-center">
              <ShoppingBag size={36} className="mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-[#1F2937]">Aucune commande active</p>
              <Link href="/catalogue" className="mt-3 inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
                Commander <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Commandes" value={String(orders.length)} sub="Total" icon={ShoppingBag} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="En cours" value={String(orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length)} sub="Active" icon={Truck} color="bg-[#F0FDF4] text-[#1A8A3A]" />
        <StatCard label="Dépensé" value={`${orders.reduce((s, o) => s + o.total, 0).toLocaleString("fr-SN")} F`} sub="Total" icon={Wallet} color="bg-[#F1F5F9] text-[#475569]" />
        <StatCard label="Favoris" value={String(favorites.length)} sub="Produits" icon={Heart} color="bg-[#F0FDF4] text-[#22A849]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
        <OrdersPanel compact orders={orders} loading={ordersLoading} />
        <div className="space-y-6">
          <QuickActions />
          <FavoritesPanel compact favorites={favorites} loading={favLoading} />
          <SecurityCard />
        </div>
      </section>
    </>
  );
}

function OrdersPage({ orders, loading }: { orders: Order[]; loading: boolean }) {
  return (
    <>
      <PageHeader
        title="Mes commandes"
        subtitle="Consultez vos commandes, suivez les livraisons et retrouvez vos factures."
        action={
          <Link href="/catalogue" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
            <Plus size={16} /> Nouvelle commande
          </Link>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={String(orders.length)} sub="Commandes" icon={ShoppingBag} color="bg-[#F0FDF4] text-[#22A849]" />
        <StatCard label="En cours" value={String(orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length)} sub="Active" icon={Truck} color="bg-[#F0FDF4] text-[#1A8A3A]" />
        <StatCard label="Livrées" value={String(orders.filter((o) => o.status === "DELIVERED").length)} sub="OK" icon={PackageCheck} color="bg-[#DCFCE7] text-[#15803D]" />
        <StatCard label="Montant" value={`${orders.reduce((s, o) => s + o.total, 0).toLocaleString("fr-SN")} F`} sub="Total" icon={Wallet} color="bg-[#F1F5F9] text-[#475569]" />
      </div>
      <OrdersPanel orders={orders} loading={loading} />
    </>
  );
}

function OrderDetailPage({ orderId, orders }: { orderId: string; orders: Order[] }) {
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="py-16 text-center">
        <Package size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm text-[#6B7280]">Commande introuvable.</p>
        <Link href="/client/commandes" className="mt-3 inline-block text-sm font-semibold text-[#22A849] hover:underline">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const statusOrder = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED"];
  const activeIndex = statusOrder.indexOf(order.status);

  return (
    <>
      <PageHeader
        title={order.code}
        subtitle={`${new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`}
        action={
          <Link href="/client/commandes" className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#1F2937]">
            <ArrowLeft size={16} /> Retour
          </Link>
        }
      />

      <div className="mb-6 overflow-hidden rounded-[18px] bg-[#1F2937] text-white shadow-[0_12px_32px_rgba(31,41,55,.16)]">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div className="flex min-w-0 items-center gap-4">
            {order.items?.[0]?.product?.images?.[0]?.url ? (
              <img src={order.items[0].product.images[0].url} alt="" className="h-20 w-20 rounded-[16px] object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-[16px] bg-white/10">
                <Package size={28} className="text-white/60" />
              </div>
            )}
            <div className="min-w-0">
              <Badge className={`mb-2 rounded-full px-3 py-1 ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {STATUS_LABELS[order.status]}
              </Badge>
              <h2 className="text-xl font-extrabold md:text-2xl">
                {order.items?.length ?? 0} article{(order.items?.length ?? 0) > 1 ? "s" : ""} · {order.total.toLocaleString("fr-SN")} F
              </h2>
              <p className="font-body mt-1 text-sm text-[#D1D5DB]">Livraison vers {order.deliveryAddress}</p>
            </div>
          </div>
          <div className="rounded-[14px] bg-white/10 p-4 md:min-w-56">
            <p className="font-body text-xs text-[#D1D5DB]">Statut actuel</p>
            <p className="mt-1 text-xl font-extrabold">{STATUS_LABELS[order.status]}</p>
            <p className="font-body mt-1 text-xs text-[#D1D5DB]">{order.customerPhone}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          {/* Tracking timeline */}
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Suivi de la commande</h2>
            <div className="space-y-4">
              {statusOrder.filter(s => s !== "CANCELLED").map((step, index) => {
                const done = index <= activeIndex && order.status !== "CANCELLED";
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-[#22A849] text-white" : "bg-[#F1F5F9] text-[#9CA3AF]"}`}>
                        {done ? <CheckCircle2 size={18} /> : <Clock size={17} />}
                      </div>
                      {index < 4 && <div className={`h-9 w-px ${index < activeIndex ? "bg-[#22A849]" : "bg-[#E5E7EB]"}`} />}
                    </div>
                    <div className="min-w-0 pb-3">
                      <p className="font-semibold text-[#1F2937]">{STATUS_LABELS[step]}</p>
                      {done && order.history?.find(h => h.status === step) ? (
                        <p className="font-body text-xs text-[#6B7280]">
                          {new Date(order.history.find(h => h.status === step)!.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      ) : (
                        <p className="font-body text-xs text-[#6B7280]">{done ? "Confirmé" : "En attente"}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Articles commandés</h2>
            <div className="space-y-3">
              {(order.items ?? []).map((line) => (
                <div key={line.id} className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] p-3">
                  {line.product?.images?.[0]?.url ? (
                    <img src={line.product.images[0].url} alt={line.name} className="h-14 w-14 rounded-[12px] object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-brand-soft">
                      <Package size={20} className="text-brand/40" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#1F2937]">{line.name}</p>
                    <p className="font-body text-xs text-[#6B7280]">{line.quantity} x {line.unitPrice.toLocaleString("fr-SN")} F</p>
                  </div>
                  <p className="text-sm font-extrabold text-[#22A849]">{line.total.toLocaleString("fr-SN")} F</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
            <h2 className="mb-4 text-lg font-bold text-[#1F2937]">Infos livraison</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">{order.deliveryAddress}</p>
                  <p className="font-body text-xs text-[#6B7280]">Adresse client</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">{order.customerPhone}</p>
                  <p className="font-body text-xs text-[#6B7280]">Numéro de contact</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard size={18} className="mt-0.5 text-[#22A849]" />
                <div>
                  <p className="font-semibold text-[#1F2937]">Dexpay</p>
                  <p className="font-body text-xs text-[#6B7280]">Paiement sécurisé</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/support" className="flex h-11 items-center justify-center rounded-[11px] bg-[#22A849] px-4 text-sm font-bold text-white">
            Contacter le support
          </Link>
        </aside>
      </div>
    </>
  );
}

function FavoritesPage({ favorites, loading }: { favorites: Favorite[]; loading: boolean }) {
  return (
    <>
      <PageHeader title="Favoris" subtitle="Vos produits et vendeurs préférés pour commander plus vite." />
      <FavoritesPanel favorites={favorites} loading={loading} />
    </>
  );
}

function ProfilePage({ user }: { user: UserType | null }) {
  const initials = user?.fullName?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <>
      <PageHeader title="Mon profil" subtitle="Vos informations personnelles et préférences de paiement." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#22A849] text-2xl font-extrabold text-white">{initials}</div>
          <h2 className="mt-4 text-xl font-bold text-[#1F2937]">{user?.fullName ?? "—"}</h2>
          <p className="font-body text-sm text-[#6B7280]">Client Guett Gui</p>
        </div>

        <div className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
          <h2 className="mb-5 text-lg font-bold text-[#1F2937]">Informations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Nom complet", value: user?.fullName ?? "—", icon: User },
              { label: "Téléphone",   value: user?.phone ?? "—",    icon: Phone },
              { label: "Email",       value: user?.email ?? "—",    icon: Mail },
              { label: "Paiement",    value: "Dexpay actif",         icon: CreditCard },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[14px] border border-[#F1F1F1] bg-[#FAFAFA] p-4">
                <Icon size={18} className="mb-3 text-[#22A849]" />
                <p className="font-body text-xs text-[#6B7280]">{label}</p>
                <p className="mt-1 font-semibold text-[#1F2937]">{value}</p>
              </div>
            ))}
          </div>
          <Link href="/support" className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#22A849] px-4 text-sm font-bold text-white">
            <Edit3 size={15} /> Modifier le profil
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Root component ──
export default function ClientDashboardPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = use(params);
  const current = section?.[0] ?? "dashboard";
  const orderId = section?.[1] ? decodeURIComponent(section[1]) : undefined;

  const [user,         setUser]         = useState<UserType | null>(null);
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [favorites,    setFavorites]    = useState<Favorite[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [favLoading,   setFavLoading]   = useState(true);

  useEffect(() => {
    // Read user from localStorage
    const raw = localStorage.getItem("gg-user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
    // Fetch orders
    listMyOrders({ limit: 50 })
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
    // Fetch favorites
    listFavorites()
      .then((favs) => setFavorites(favs))
      .catch(() => {})
      .finally(() => setFavLoading(false));
  }, []);

  const userName = user?.fullName ?? "Client";

  const page =
    current === "commandes" && orderId ? <OrderDetailPage orderId={orderId} orders={orders} /> :
    current === "commandes"            ? <OrdersPage orders={orders} loading={ordersLoading} /> :
    current === "favoris"              ? <FavoritesPage favorites={favorites} loading={favLoading} /> :
    current === "profil"               ? <ProfilePage user={user} /> :
    <OverviewPage user={user} orders={orders} favorites={favorites} ordersLoading={ordersLoading} favLoading={favLoading} />;

  return (
    <DashboardShell role="client" userName={userName}>
      <div className="mx-auto max-w-7xl p-4 md:p-6">{page}</div>
    </DashboardShell>
  );
}
