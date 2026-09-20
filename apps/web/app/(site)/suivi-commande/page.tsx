"use client";
import { useState } from "react";
import { Check, Info, Loader2, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { trackOrder } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Commande creee",
  CONFIRMED: "Confirmee par le vendeur",
  PREPARING: "En preparation",
  READY: "Prete pour recuperation",
  IN_DELIVERY: "En livraison",
  DELIVERED: "Livree",
  CANCELLED: "Annulee",
};

export default function SuiviCommandePage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !phone.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await trackOrder(code.trim(), phone.trim());
      setOrder(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Commande introuvable. Verifiez le code et le numero de telephone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-5 md:py-8">
      {/* Search form */}
      <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-base font-bold">Suivi de commande</h1>
        <p className="font-body mb-4 text-[11px] text-muted">Entrez votre code de commande et votre numero de telephone pour suivre votre commande.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-light">Code de commande</label>
            <Input
              placeholder="ex. GG-2026-04821"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-light">Numero de telephone</label>
            <Input
              placeholder="+221 77 000 00 00"
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
      </div>

      {/* Order result */}
      {order && (
        <>
          {/* Status banner */}
          <section className="bg-ink mb-5 overflow-hidden rounded-xl p-4 sm:p-5 text-white">
            <p className="font-body mb-1 text-xs text-gray-400 break-all">Statut actuel · {order.code}</p>
            <div className="flex items-center gap-2 text-lg sm:text-xl font-bold">
              <Truck size={22} className="shrink-0" />
              <span>{STATUS_LABELS[order.status] || order.status}</span>
            </div>
            <p className="font-body mt-1.5 text-xs text-gray-400">
              Commande du {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </section>

          {/* Order items */}
          <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold">Articles commandes</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-page p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                    <p className="font-body text-xs text-muted">{item.quantity} x {item.unitPrice.toLocaleString()} F</p>
                  </div>
                  <p className="text-sm font-bold text-ink shrink-0">{item.total.toLocaleString()} F</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-muted">Sous-total</span>
              <span className="text-sm font-semibold">{order.subtotal.toLocaleString()} F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Livraison</span>
              <span className="text-sm font-semibold">{order.deliveryFee.toLocaleString()} F</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-sm font-bold">Total</span>
              <span className="text-base font-bold text-brand">{order.total.toLocaleString()} F</span>
            </div>
          </div>

          {/* Timeline */}
          {order.history && order.history.length > 0 && (
            <>
              <h2 className="mb-4 text-sm font-bold">Historique</h2>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                {order.history.map((entry, index) => {
                  const isLast = index === order.history!.length - 1;
                  const isCurrent = index === 0;

                  return (
                    <div key={index} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <span className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full ${
                          isCurrent
                            ? "bg-brand shadow-[0_0_0_4px] shadow-brand-soft"
                            : "bg-brand"
                        }`}>
                          {isCurrent
                            ? <Truck size={13} className="text-white" strokeWidth={2.5} />
                            : <Check size={13} className="text-white" strokeWidth={3} />
                          }
                        </span>
                        {!isLast && <span className="h-10 w-0.5 bg-brand" />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-semibold ${isCurrent ? "text-brand" : "text-ink"}`}>
                          {STATUS_LABELS[entry.status] || entry.status}
                        </p>
                        <p className="font-body text-[11px] text-muted">
                          {new Date(entry.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          {entry.note ? ` · ${entry.note}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <p className="font-body mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
            <Info size={13} />
            Un souci ? Ouvrir un litige reste possible
          </p>
        </>
      )}
    </div>
  );
}
