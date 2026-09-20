"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingCart, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCart, updateQty as updateCartQty, removeFromCart, type CartItem } from "@/lib/cart";

export default function PanierPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCart());
  }, []);

  const handleUpdateQty = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    updateCartQty(productId, newQty);
    setItems(getCart());
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setItems(getCart());
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 10000 ? 0 : 800;
  const total = subtotal + delivery;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2">
        <ShoppingCart size={24} className="text-brand" />
        Mon panier
        <span className="text-base text-muted font-normal">({items.length} articles)</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={52} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink mb-2">Votre panier est vide</h2>
          <p className="text-muted text-sm mb-6">Decouvrez nos produits frais</p>
          <Link href="/catalogue"><Button>Voir le catalogue</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink text-sm leading-tight truncate">{item.name}</h3>
                    <p className="text-xs text-muted mt-0.5 truncate">{item.vendor} · {item.weight}</p>
                    <p className="font-bold text-brand mt-1">{(item.price * item.qty).toLocaleString()} F</p>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center sm:hidden">
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between sm:mt-0 sm:justify-end sm:gap-2">
                  <div className="flex items-center gap-2 bg-page rounded-lg p-1">
                    <button onClick={() => handleUpdateQty(item.productId, -1)} className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-md bg-white text-ink">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item.productId, 1)} className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-md bg-white text-ink">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="hidden sm:flex p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="sticky top-24 self-start">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-ink mb-4">Recapitulatif</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted flex items-center gap-1">
                    <Truck size={13} />
                    Livraison
                  </span>
                  <span className={`font-medium ${delivery === 0 ? "text-brand" : ""}`}>
                    {delivery === 0 ? "Gratuite" : `${delivery.toLocaleString()} F`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-[11px] text-brand-dark bg-brand-soft rounded-lg px-3 py-1.5">
                    Encore {(10000 - subtotal).toLocaleString()} F pour la livraison gratuite !
                  </p>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                  <span className="font-bold text-ink">Total</span>
                  <span className="font-bold text-xl text-brand">{total.toLocaleString()} F</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mt-5">
                  Commander
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/catalogue" className="block text-center text-xs text-muted hover:text-brand mt-3">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
