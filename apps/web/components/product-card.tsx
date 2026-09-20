import Link from "next/link";
import { MapPin } from "lucide-react";
import { productImages } from "@/lib/product-images";

interface ProductCardProps {
  slug?: string;
  name: string;
  price: number;
  badge?: string;
  category?: string;
  vendor: string;
  city?: string;
  weight?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  livraison?: boolean;
  image?: string;
  compact?: boolean;
}

export function ProductCard({
  slug = "produit",
  name,
  price,
  category,
  vendor,
  city = "Dakar",
  weight = "2 kg",
  livraison = true,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/produits/${slug}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="aspect-[4/3] overflow-hidden bg-page">
          <img
            src={image || productImages.wholeChicken}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-4">
          <p className="font-body text-xs font-medium text-brand">{category}</p>

          <h3 className="mt-1 text-sm font-semibold leading-snug text-ink line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>

          <div className="mt-2 flex items-center gap-1 font-body text-xs text-muted">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{vendor} · {city} · {weight}</span>
          </div>

          {livraison && (
            <p className="mt-2 font-body text-[11px] font-medium text-green-700">Livraison disponible</p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2 pt-3">
            <span className="text-lg font-bold text-brand">{price.toLocaleString()} <span className="text-xs font-medium">FCFA</span></span>
            <span className="shrink-0 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white">
              Commander
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
