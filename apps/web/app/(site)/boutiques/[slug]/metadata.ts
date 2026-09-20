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
    const res = await fetch(`${API_BASE}/shops/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const s = json.data ?? json;

    const title = `${s.name} — Boutique éleveur Guett Gui`;
    const description =
      s.description ||
      `${s.name} — éleveur${s.verified ? " vérifié" : ""} sur Guett Gui. ${s._count?.products ?? 0} produits disponibles.`;
    const image = s.avatarUrl ?? s.coverUrl;
    const canonical = `${SITE_URL}/boutiques/${slug}`;

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
    };
  } catch {
    return {
      title: "Boutique — Guett Gui",
      description: "Découvrez cette boutique d'élevage sur Guett Gui.",
    };
  }
}

export async function generateJsonLd(slug: string): Promise<object | null> {
  try {
    const res = await fetch(`${API_BASE}/shops/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const s = json.data ?? json;

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: s.name,
      description: s.description ?? undefined,
      url: `${SITE_URL}/boutiques/${slug}`,
      image: s.avatarUrl ?? s.coverUrl ?? undefined,
      address: {
        "@type": "PostalAddress",
        addressCountry: "SN",
        addressRegion: s.region?.name ?? "Sénégal",
        addressLocality: s.city?.name ?? undefined,
      },
      ...(s.phone && { telephone: s.phone }),
      ...(s.ratingAvg > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: s.ratingAvg,
          reviewCount: s.reviewCount,
        },
      }),
    };
  } catch {
    return null;
  }
}
