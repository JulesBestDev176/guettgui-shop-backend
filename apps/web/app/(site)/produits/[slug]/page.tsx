"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft, Loader2, Lock, MapPin, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { ProductCard } from "@/components/product-card";
import { getProduct, getRelatedProducts } from "@/lib/api";
import { productImages } from "@/lib/product-images";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImg, setActiveImg] = useState(0);
  const [activeOption, setActiveOption] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    Promise.all([getProduct(slug), getRelatedProducts(slug)])
      .then(([p, r]) => {
        setProduct(p);
        setRelated(r);
      })
      .catch((err) => setError(err.message || "Produit introuvable"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-3 text-xl font-bold text-ink">Produit introuvable</h1>
        <p className="mb-6 text-sm text-muted">{error || "Ce produit n'existe pas ou a ete retire."}</p>
        <Link href="/catalogue" className="text-sm font-semibold text-brand hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  const gallery = product.images.length > 0
    ? product.images.sort((a, b) => a.sortOrder - b.sortOrder).map((img) => img.url)
    : [productImages.wholeChicken];

  const priceOptions = product.priceOptions ?? [];
  const hasPriceOptions = priceOptions.length > 0;
  const currentPrice = hasPriceOptions ? priceOptions[activeOption].price : product.basePrice;
  const totalPrice = currentPrice * qty;

  const reviews = product.reviews ?? [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <div className="font-body mb-4 text-xs text-muted">
        Accueil · Catalogue · {product.category?.name ?? "Produit"} · <span className="text-ink">{product.name}</span>
      </div>

      <Link href="/catalogue" className="mb-4 flex w-fit items-center gap-1.5 text-sm font-medium text-muted hover:text-brand md:hidden">
        <ChevronLeft size={16} />
        Retour
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[1/.92] overflow-hidden rounded-xl bg-page">
            <img src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">{product.category?.name}</span>
            <span className="absolute bottom-3 right-3 rounded-lg bg-ink/70 px-3 py-1.5 text-[11px] font-medium text-white">{activeImg + 1} / {gallery.length}</span>
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImg(index)}
                  className={`aspect-square w-16 shrink-0 sm:flex-1 sm:w-auto overflow-hidden rounded-lg border-2 ${activeImg === index ? "border-brand" : "border-transparent"}`}
                >
                  <img src={image} alt={`Vue produit ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-2.5 text-base font-bold">Description</h2>
            <p className="font-body text-sm leading-6 text-ink-light">
              {product.description || "Aucune description disponible."}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] text-brand-dark">
              <Check size={12} />
              {product.status === "ACTIVE" ? `En stock · ${product.stock} disponibles` : "Indisponible"}
            </Badge>
          </div>

          <h1 className="mb-2.5 text-2xl font-bold leading-tight text-ink md:text-3xl">{product.name}</h1>
          <div className="font-body mb-5 flex flex-wrap items-center gap-3 text-[13px] text-muted">
            {avgRating && (
              <span className="flex items-center gap-1.5 font-semibold text-ink">
                <Star size={15} className="fill-amber-400 text-amber-400" />{avgRating}
              </span>
            )}
            {reviews.length > 0 && <span>· {reviews.length} avis</span>}
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-muted" />{product.city}</span>
          </div>

          {hasPriceOptions && (
            <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
              <p className="mb-3 text-[13px] font-semibold text-muted">Choisissez une option</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {priceOptions.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveOption(index)}
                    className={`rounded-lg border-2 p-3 text-center ${activeOption === index ? "border-brand bg-brand-soft" : "border-gray-200"}`}
                  >
                    <span className="block text-[13px] font-semibold">{option.label}</span>
                    <span className={`mt-1 block text-base font-bold ${activeOption === index ? "text-brand" : "text-ink"}`}>{option.price.toLocaleString()} F</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
            <div className="min-w-0">
              <p className="font-body text-xs text-muted">Prix total</p>
              <p className="text-2xl sm:text-3xl font-extrabold leading-none text-brand">{totalPrice.toLocaleString()} <span className="text-sm sm:text-base font-semibold">FCFA</span></p>
            </div>
            <div className="flex shrink-0 overflow-hidden rounded-lg border border-gray-200">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-11 w-11 items-center justify-center text-muted"><Minus size={16} /></button>
              <span className="flex h-11 w-10 items-center justify-center border-x border-gray-200 text-base font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="flex h-11 w-11 items-center justify-center text-brand"><Plus size={16} /></button>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/checkout" className="flex h-12 min-h-[48px] flex-[1.4] items-center justify-center rounded-lg bg-brand text-[15px] font-bold text-white">
              Commander maintenant
            </Link>
            <Link href="/panier" className="flex h-12 min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-brand bg-white text-[15px] font-semibold text-brand">
              <ShoppingCart size={17} />
              Panier
            </Link>
          </div>

          <div className="mb-4 rounded-xl bg-brand-soft p-4 text-brand-dark">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Truck size={17} />
              Livraison disponible
            </div>
            <p className="font-body text-xs leading-6">
              Depuis <strong>{product.city}</strong> · {product.unit}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-dark">
                {product.seller?.shopName?.slice(0, 2).toUpperCase() ?? "VD"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{product.seller?.shopName ?? "Vendeur"}</h3>
                  <Badge className="rounded-full bg-brand-soft text-[9.5px] text-brand-dark">Verifie</Badge>
                </div>
                <p className="font-body text-xs text-muted">Eleveur · {product.seller?.city ?? product.city}</p>
              </div>
              <button className="hidden rounded-lg bg-page px-3.5 py-2 text-xs font-semibold md:block">Contacter</button>
            </div>
            <p className="font-body mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <Lock size={12} />
              Le numero du vendeur reste masque tant que la commande n&apos;est pas passee.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Avis clients ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-ink">{review.user.fullName}</span>
                </div>
                {review.comment && <p className="font-body mt-2 text-sm text-muted">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Produits similaires</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                price={p.basePrice}
                category={p.category?.name}
                vendor={p.seller?.shopName ?? "Vendeur"}
                city={p.city}
                image={p.images?.[0]?.url}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
