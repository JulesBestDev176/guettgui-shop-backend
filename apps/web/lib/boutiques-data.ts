export type Boutique = {
  slug: string;
  name: string;
  owner: string;
  category: string;
  city: string;
  region: string;
  rating: number;
  reviews: number;
  products: number;
  verified: boolean;
  avatar: string;
  cover: string;
  bio: string;
  phone: string;
  since: string;
  tags: string[];
};

export const BOUTIQUES: Boutique[] = [
  {
    slug: "ferme-ndiaye",
    name: "Ferme Ndiaye",
    owner: "Ibrahima Ndiaye",
    category: "Poulets & Volailles",
    city: "Rufisque",
    region: "Dakar",
    rating: 4.8,
    reviews: 142,
    products: 18,
    verified: true,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Éleveur professionnel depuis plus de 15 ans. Spécialisé dans le poulet de chair et le poulet local amélioré. Livraison disponible sur Dakar et ses environs.",
    phone: "+221 77 123 45 67",
    since: "2009",
    tags: ["Poulets de chair", "Poules pondeuses"],
  },
  {
    slug: "elevage-fall",
    name: "Élevage Fall",
    owner: "Mamadou Fall",
    category: "Moutons & Chèvres",
    city: "Keur Massar",
    region: "Dakar",
    rating: 4.9,
    reviews: 98,
    products: 12,
    verified: true,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Spécialiste en ovins et caprins. Moutons Ladoum, Peul-Peul et chèvres locales disponibles toute l'année.",
    phone: "+221 76 234 56 78",
    since: "2014",
    tags: ["Moutons Ladoum", "Chèvres locales"],
  },
  {
    slug: "ferme-ba",
    name: "Ferme Ba",
    owner: "Aminata Ba",
    category: "Œufs & Volailles",
    city: "Thiès",
    region: "Thiès",
    rating: 4.7,
    reviews: 76,
    products: 8,
    verified: true,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Production et vente d'œufs frais et fécondés. Poules pondeuses et pintades disponibles.",
    phone: "+221 78 345 67 89",
    since: "2017",
    tags: ["Œufs frais", "Poules pondeuses"],
  },
  {
    slug: "elevage-sarr",
    name: "Élevage Sarr",
    owner: "Ousmane Sarr",
    category: "Bovins",
    city: "Saint-Louis",
    region: "Saint-Louis",
    rating: 4.6,
    reviews: 64,
    products: 14,
    verified: true,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Élevage bovin traditionnel de qualité. Vaches laitières et bovins locaux disponibles toute l'année à Saint-Louis.",
    phone: "+221 77 456 78 90",
    since: "2012",
    tags: ["Bovins locaux", "Vaches laitières"],
  },
  {
    slug: "ferme-diop",
    name: "Ferme Diop",
    owner: "Cheikh Diop",
    category: "Produits laitiers & Dérivés",
    city: "Mbour",
    region: "Thiès",
    rating: 4.8,
    reviews: 91,
    products: 20,
    verified: true,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Spécialisé dans la production de lait frais et produits laitiers artisanaux. Fromages locaux et yaourts fabriqués selon les traditions sénégalaises.",
    phone: "+221 76 567 89 01",
    since: "2016",
    tags: ["Lait frais", "Fromages locaux"],
  },
  {
    slug: "volaille-saloum",
    name: "Volaille du Saloum",
    owner: "Fatou Diallo",
    category: "Pintades, Canards & Dindes",
    city: "Kaolack",
    region: "Kaolack",
    rating: 4.6,
    reviews: 52,
    products: 10,
    verified: false,
    avatar: "/ferme.png",
    cover: "/ferme.png",
    bio: "Élevage spécialisé en volailles rares : pintades, canards et dindes. Produits de qualité pour particuliers et restaurants.",
    phone: "+221 78 678 90 12",
    since: "2018",
    tags: ["Pintades", "Canards", "Dindes"],
  },
];

export const DEMO_PRODUCTS_BY_SHOP: Record<string, { name: string; price: number; subtitle: string; badge?: string }[]> = {
  "ferme-ndiaye": [
    { name: "Poulet de chair 3,5 kg", price: 7500,  subtitle: "Vivant · Prêt à livrer", badge: "Populaire" },
    { name: "Poulet local amélioré",  price: 5000,  subtitle: "Vivant · 2,5 kg",       badge: "Disponible" },
    { name: "Lot de 10 poulets",      price: 65000, subtitle: "Prêt à cuire · 10 pièces", badge: "Lot" },
    { name: "Poussins d'un jour",     price: 800,   subtitle: "Chair · Lot de 50 min", badge: "Nouveau" },
  ],
};
