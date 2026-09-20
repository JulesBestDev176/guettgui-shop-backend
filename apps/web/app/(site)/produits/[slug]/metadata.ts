import type { Metadata } from "next";

const API_BASE  = process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:4000/api/v1";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guettgui.sn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const p = json.data ?? json;

    const title = `${p.name} — ${p.shop?.name ?? "Guett Gui"}`;
    const description =
      p.description ||
      `Achetez ${p.name} à ${p.basePrice?.toLocaleString("fr-SN")} FCFA — ${p.shop?.name ?? "Éleveur vérifié"} sur Guett Gui.`;
    const image = p.images?.[0]?.url;
    const canonical = `${SITE_URL}/produits/${slug}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return {
      title: "Produit — Guett Gui",
      description: "Découvrez ce produit sur la marketplace d'élevage Guett Gui.",
    };
  }
}

export async function generateJsonLd(slug: string): Promise<object | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const p = json.data ?? json;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description ?? undefined,
      image: p.images?.map((i: { url: string }) => i.url) ?? [],
      url: `${SITE_URL}/produits/${slug}`,
      offers: {
        "@type": "Offer",
        price: p.basePrice,
        priceCurrency: "XOF",
        availability: p.status === "ACTIVE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: p.shop?.name ?? "Guett Gui" },
      },
      ...(p.ratingAvg > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: p.ratingAvg,
          reviewCount: p.reviewCount,
        },
      }),
    };
  } catch {
    return null;
  }
}
