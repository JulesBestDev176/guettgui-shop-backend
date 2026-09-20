"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle, Lock, Loader2, MapPin, Truck } from "lucide-react";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import { checkout } from "@/lib/api";

const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor",
  "Diourbel", "Fatick", "Kolda", "Tambacounda", "Louga", "Matam", "Kédougou", "Sédhiou",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Dakar");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setItems(getCart());
    // Pre-fill from stored user
    try {
      const raw = localStorage.getItem("gg-user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.fullName) setName(u.fullName);
        if (u.phone) setPhone(u.phone);
      }
    } catch {}
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + deliveryFee;

  const handlePay = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Veuillez remplir votre nom et téléphone.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const fullAddress = [address.trim(), region].filter(Boolean).join(", ");
      const order = await checkout({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: fullAddress,
        note: note.trim() || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
      });
      clearCart();
      setOrderCode(order.code);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-soft">
          <CheckCircle size={40} className="text-brand" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-ink">Commande confirmée !</h1>
        <p className="font-body mb-6 text-sm leading-6 text-muted">
          Votre commande <strong>#{orderCode}</strong> a été enregistrée. Le vendeur vous contactera sous peu.
        </p>
        <Link
          href={`/suivi-commande?code=${orderCode}`}
          className="flex h-12 items-center justify-center rounded-xl bg-brand text-[15px] font-bold text-white"
        >
          Suivre ma commande
        </Link>
        <Link href="/catalogue" className="mt-3 block text-sm font-semibold text-brand hover:underline">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-5 md:py-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 bg-white p-4 -mx-4 -mt-5 md:mx-0 md:mt-0 md:rounded-xl md:shadow-sm">
        <Link href="/panier" className="flex h-9 w-9 items-center justify-center rounded-lg bg-page">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-base font-bold">Finaliser la commande</h1>
          <p className="font-body text-[11px] text-muted">Livraison · Paiement</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="mb-5 flex items-center justify-center gap-1">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-1">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step <= 2 ? "bg-brand text-white" : "bg-gray-200 text-muted"}`}>
              {step < 2 ? <Check size={13} strokeWidth={3} /> : step}
            </span>
            {step < 3 && <span className={`h-0.5 w-8 shrink-0 ${step < 2 ? "bg-brand" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Récap */}
      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[13px] font-bold">Récapitulatif</h2>
        <div className="font-body space-y-1.5 text-[13px] text-ink-light">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="truncate pr-2">{item.name} × {item.qty}</span>
              <strong className="shrink-0 font-semibold text-ink">{(item.price * item.qty).toLocaleString()} F</strong>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="flex items-center gap-1"><Truck size={12} /> Livraison</span>
            <strong className={`font-semibold ${deliveryFee === 0 ? "text-brand" : "text-ink"}`}>
              {deliveryFee === 0 ? "Gratuite" : `${deliveryFee.toLocaleString()} F`}
            </strong>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-bold">Total</span>
          <span className="text-lg font-extrabold text-brand">{total.toLocaleString()} FCFA</span>
        </div>
      </section>

      {/* Delivery form */}
      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-[13px] font-bold flex items-center gap-1.5">
          <MapPin size={14} className="text-brand" /> Informations de livraison
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-[11.5px] font-medium text-muted">Nom complet *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="h-10 w-full rounded-lg border border-border bg-page px-3 text-sm outline-none focus:border-brand"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11.5px] font-medium text-muted">Téléphone *</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+221 77 000 00 00"
              type="tel"
              className="h-10 w-full rounded-lg border border-border bg-page px-3 text-sm outline-none focus:border-brand"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-[11.5px] font-medium text-muted">Région</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-page px-3 text-sm outline-none focus:border-brand appearance-none"
          >
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11.5px] font-medium text-muted">Adresse détaillée</span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, rue, point de repère..."
            className="h-10 w-full rounded-lg border border-border bg-page px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11.5px] font-medium text-muted">Note pour le vendeur</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Instructions spéciales, heure préférée..."
            className="h-10 w-full rounded-lg border border-border bg-page px-3 text-sm outline-none focus:border-brand"
          />
        </label>
      </section>

      {/* Payment */}
      <section className="mb-3 flex items-center gap-3 rounded-xl border-2 border-brand bg-white p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-[13px] font-extrabold text-white">Dx</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold">Dexpay</h3>
          <p className="font-body text-[11px] text-muted">Wave · Orange Money · carte bancaire</p>
        </div>
        <span className="h-[22px] w-[22px] shrink-0 rounded-full border-[6px] border-brand" />
      </section>

      <div className="mb-6 flex gap-2.5 rounded-xl bg-brand-soft p-3 text-brand-dark">
        <Lock size={17} className="mt-0.5 shrink-0" />
        <p className="font-body text-[11.5px] leading-5">
          Paiement <strong>sécurisé</strong>. Le vendeur est payé après confirmation de la livraison.
        </p>
      </div>

      {/* CTA */}
      <div className="sticky bottom-[76px] -mx-4 bg-white p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] md:static md:mx-0 md:shadow-none md:p-0">
        <button
          onClick={handlePay}
          disabled={loading || items.length === 0}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-bold text-white disabled:opacity-50"
        >
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : `Confirmer · ${total.toLocaleString()} FCFA`}
        </button>
      </div>
    </div>
  );
}
