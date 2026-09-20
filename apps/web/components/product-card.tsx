"use client";
import Link from "next/link";
import { Heart, MapPin, ShoppingCart, CheckCircle } from "lucide-react";
import { useState } from "react";

const BADGE_STYLES: Record<string, string> = {
  Populaire: "bg-orange-50 text-orange-500",
  Disponible: "bg-green-50 text-green-600",
  Nouveau: "bg-blue-50 text-blue-600",
  Lot: "bg-yellow-50 text-yellow-600",
};
const BADGE_DOTS: Record<string, string> = {
  Populaire: "bg-orange-400",
  Disponible: "bg-green-500",
  Nouveau: "bg-blue-500",
  Lot: "bg-yellow-500",
};

interface ProductCardProps {
  slug?: string;
  name: string;
  price: number;
  badge?: string;
  subtitle?: string;
  vendor?: string;
  city?: string;
  image?: string;
}

export function ProductCard({
  slug = "produit",
  name,
  price,
  badge,
  subtitle,
  vendor = "Vendeur",
  city = "Dakar",
  image,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm border border-border">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-page">
        <Link href={`/produits/${slug}`}>
          <img
            src={image || "/ferme.png"}
            alt={name}
            className="h-full w-full object-cover"
          />
        </Link>
        {badge && (
          <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_STYLES[badge] ?? "bg-gray-100 text-gray-600"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${BADGE_DOTS[badge] ?? "bg-gray-400"}`} />
            {badge}
          </span>
        )}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Heart size={15} className={liked ? "fill-red-500 text-red-500" : "text-muted"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/produits/${slug}`}>
          <h3 className="font-semibold text-brand hover:underline">{name}</h3>
        </Link>
        {subtitle && (
          <p className="font-body mt-0.5 text-xs text-muted">{subtitle}</p>
        )}
        <div className="mt-2 flex items-center gap-1 font-body text-xs text-muted">
          <MapPin size={11} className="shrink-0 text-brand" />
          <span>{city}</span>
        </div>

        {/* Seller */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
            {vendor[0]}
          </div>
          <span className="font-body text-xs text-muted truncate">{vendor}</span>
          <CheckCircle size={13} className="shrink-0 text-brand" />
          <span className="font-body text-xs font-medium text-brand">Vérifié</span>
        </div>

        {/* Price + Cart */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-extrabold text-brand">
            {price.toLocaleString()} <span className="text-xs font-medium">FCFA</span>
          </span>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
