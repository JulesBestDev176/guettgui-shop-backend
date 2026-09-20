"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, Truck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/primitives";
import { quickOrder } from "@/lib/api";
import { getCart, clearCart, type CartItem } from "@/lib/cart";

export default function CommandeRapidePage() {
  const [submitted, setSubmitted] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [region] = useState("Dakar");

  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCart());
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      setError("Veuillez remplir votre nom et telephone");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const fullAddress = `${deliveryAddress}, ${region}`.trim();
      const order = await quickOrder({
        customerName,
        customerPhone,
        deliveryAddress: fullAddress || region,
        items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
      });
      setOrderCode(order.code);
      clearCart();
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-soft">
          <CheckCircle size={38} className="text-brand" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Commande envoyee</h1>
        <p className="font-body mb-6 text-sm leading-6 text-muted">Votre demande est enregistree. Vous serez redirige vers Dexpay pour confirmer le paiement securise.</p>
        <Link href={`/suivi-commande?code=${orderCode}`} className="flex h-12 items-center justify-center rounded-lg bg-brand text-[15px] font-bold text-white">Suivre ma commande</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-5 md:py-8">
      <div className="mb-4 flex items-center gap-3 bg-white p-4 -mx-4 -mt-5 md:mx-0 md:mt-0 md:rounded-xl md:shadow-sm">
        <Link href="/catalogue" className="flex h-9 w-9 items-center justify-center rounded-lg bg-page">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-base font-bold">Commander maintenant</h1>
          <p className="font-body text-[11px] text-muted">Sans creer de compte</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-5 space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold">{item.name}</h2>
                  <p className="font-body text-[11px] text-muted">{item.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-brand">{item.price.toLocaleString()} F</p>
                  <p className="font-body text-[10px] text-muted">x{item.qty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <h2 className="mb-3 text-sm font-bold">Vos informations</h2>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-medium text-muted">Nom complet</span>
          <Input
            value={customerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
            placeholder="Votre nom complet"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-medium text-muted">Telephone</span>
          <Input
            value={customerPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
            placeholder="+221 77 000 00 00"
            type="tel"
            className="border-brand"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {["Dakar", "Choisir"].map((value, index) => (
            <label key={index} className="block">
              <span className="mb-1.5 block text-[11.5px] font-medium text-muted">{index === 0 ? "Region" : "Commune"}</span>
              <button className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-ink">
                {value}
                <ChevronDown size={14} />
              </button>
            </label>
          ))}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-medium text-muted">Adresse detaillee</span>
          <Input
            value={deliveryAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryAddress(e.target.value)}
            placeholder="Quartier, rue, point de repere..."
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2.5 rounded-xl bg-brand-soft p-3 text-brand-dark">
        <Truck size={17} className="mt-0.5 shrink-0" />
        <p className="font-body text-[11.5px] leading-5">Livraison a <strong>Dakar : {deliveryFee.toLocaleString()} F</strong> · sous 24 h</p>
      </div>

      <div className="sticky bottom-[76px] -mx-4 mt-8 bg-white p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] md:bottom-4 md:mx-0 md:rounded-xl md:shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-body text-xs text-muted">Total a payer</span>
          <span className="text-xl font-extrabold text-brand">{total.toLocaleString()} FCFA</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[15px] font-bold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : (
            <>
              Payer avec Dexpay
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
