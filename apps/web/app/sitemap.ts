import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guettgui.sn";
const API_BASE  = process.env.NEXT_PUBLIC_API_URL   ?? "http://localhost:4000/api/v1";

async function fetchSlugs<T extends { slug: string }>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json.data ?? json;
    return Array.isArray(items) ? items : items.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, shops] = await Promise.all([
    fetchSlugs<{ slug: string }>("/products?limit=200&sort=newest"),
    fetchSlugs<{ slug: string }>("/shops?limit=200"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                              priority: 1.0,  changeFrequency: "daily"   },
    { url: `${SITE_URL}/catalogue`,               priority: 0.9,  changeFrequency: "hourly"  },
    { url: `${SITE_URL}/boutiques`,               priority: 0.9,  changeFrequency: "daily"   },
    { url: `${SITE_URL}/devenir-vendeur`,         priority: 0.8,  changeFrequency: "monthly" },
    { url: `${SITE_URL}/a-propos`,                priority: 0.6,  changeFrequency: "monthly" },
    { url: `${SITE_URL}/faq`,                     priority: 0.6,  changeFrequency: "weekly"  },
    { url: `${SITE_URL}/support`,                 priority: 0.5,  changeFrequency: "monthly" },
    { url: `${SITE_URL}/cgu`,                     priority: 0.3,  changeFrequency: "yearly"  },
    { url: `${SITE_URL}/cgv`,                     priority: 0.3,  changeFrequency: "yearly"  },
    { url: `${SITE_URL}/confidentialite`,         priority: 0.3,  changeFrequency: "yearly"  },
    { url: `${SITE_URL}/mentions-legales`,        priority: 0.3,  changeFrequency: "yearly"  },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produits/${p.slug}`,
    priority: 0.8,
    changeFrequency: "daily",
  }));

  const shopRoutes: MetadataRoute.Sitemap = shops.map((s) => ({
    url: `${SITE_URL}/boutiques/${s.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...productRoutes, ...shopRoutes];
}
