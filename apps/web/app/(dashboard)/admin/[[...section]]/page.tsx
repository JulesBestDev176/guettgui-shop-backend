"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, Badge, Progress } from "@/components/ui/primitives";
import { CheckCircle, XCircle, Loader2, Users, Store, ShoppingBag, TrendingUp } from "lucide-react";
import { getAdminStats, getAdminPendingShops, adminVerifyShop, adminSuspendShop } from "@/lib/api";

type AdminStats = {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  ordersThisMonth: number;
  gmv: number;
  gmvThisMonth: number;
  pendingShops: number;
};

type PendingShop = {
  id: string;
  name: string;
  slug: string;
  verified: boolean;
  status: string;
  createdAt: string;
  region: { name: string } | null;
  user: { fullName: string; phone: string };
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function AdminDashboardPage({ params }: { params: Promise<{ section?: string[] }> }) {
  use(params); // unwrap for Next.js App Router

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminPendingShops(1, 10)])
      .then(([s, p]) => {
        setStats(s);
        setPending(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (shop: PendingShop) => {
    setActing(shop.id);
    try {
      await adminVerifyShop(shop.id);
      setPending((prev) => prev.filter((s) => s.id !== shop.id));
      setStats((prev) => prev ? { ...prev, pendingShops: Math.max(0, prev.pendingShops - 1) } : prev);
    } catch {} finally {
      setActing(null);
    }
  };

  const handleReject = async (shop: PendingShop) => {
    setActing(shop.id);
    try {
      await adminSuspendShop(shop.id);
      setPending((prev) => prev.filter((s) => s.id !== shop.id));
    } catch {} finally {
      setActing(null);
    }
  };

  const statCards = stats ? [
    { label: "Utilisateurs", value: fmt(stats.totalUsers), delta: `dont ${stats.totalSellers} vendeurs`, color: "bg-blue-50 text-blue-600" },
    { label: "Vendeurs actifs", value: fmt(stats.totalSellers), delta: `${stats.pendingShops} en attente`, color: "bg-[#F0FDF4] text-[#22A849]" },
    { label: "GMV ce mois", value: `${fmt(stats.gmvThisMonth)} F`, delta: `${fmt(stats.gmv)} F total`, color: "bg-emerald-50 text-emerald-600" },
    { label: "Commandes", value: fmt(stats.ordersThisMonth), delta: `${fmt(stats.totalOrders)} total`, color: "bg-purple-50 text-purple-600" },
  ] : [
    { label: "Utilisateurs", value: "—", delta: "", color: "bg-blue-50 text-blue-600" },
    { label: "Vendeurs actifs", value: "—", delta: "", color: "bg-[#F0FDF4] text-[#22A849]" },
    { label: "GMV ce mois", value: "—", delta: "", color: "bg-emerald-50 text-emerald-600" },
    { label: "Commandes", value: "—", delta: "", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <DashboardShell role="admin" userName="Admin">
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">Administration</h1>
          <p className="text-stone-500 text-sm mt-1">Vue d&apos;ensemble de la plateforme</p>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardBody className="pt-5">
                <div className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold mb-2 ${s.color}`}>{s.delta || "—"}</div>
                <p className="text-xl font-bold text-[#1F2937]">{s.value}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending vendors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1F2937]">Vendeurs en attente</h2>
                <Badge className="bg-rose-50 text-rose-700">{stats?.pendingShops ?? 0}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              ) : pending.length === 0 ? (
                <p className="py-6 text-center text-sm text-stone-400">Aucune boutique en attente</p>
              ) : (
                <div className="space-y-3">
                  {pending.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                      <div className="w-9 h-9 bg-[#22A849] rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {v.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1F2937] truncate">{v.name}</p>
                        <p className="text-xs text-stone-400">
                          {v.region?.name ?? "—"} · {v.user.phone} ·{" "}
                          {new Date(v.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          disabled={acting === v.id}
                          onClick={() => handleVerify(v)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-50"
                          title="Approuver"
                        >
                          {acting === v.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          disabled={acting === v.id}
                          onClick={() => handleReject(v)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                          title="Rejeter"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Platform overview */}
          <Card>
            <CardHeader>
              <h2 className="font-bold text-[#1F2937]">Aperçu plateforme</h2>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: Users, label: "Utilisateurs inscrits", value: stats?.totalUsers ?? 0, color: "text-blue-600 bg-blue-50" },
                    { icon: Store, label: "Boutiques vendeurs", value: stats?.totalSellers ?? 0, color: "text-[#22A849] bg-[#F0FDF4]" },
                    { icon: ShoppingBag, label: "Total commandes", value: stats?.totalOrders ?? 0, color: "text-purple-600 bg-purple-50" },
                    { icon: TrendingUp, label: "GMV total", value: `${(stats?.gmv ?? 0).toLocaleString("fr-SN")} F`, color: "text-emerald-600 bg-emerald-50" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-stone-400">{label}</p>
                        <p className="font-bold text-[#1F2937]">{typeof value === "number" ? value.toLocaleString("fr-SN") : value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
