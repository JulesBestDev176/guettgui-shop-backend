export type SubCategory = {
  slug: string;
  label: string;
  count: number;
  icon: string;
};

export type Category = {
  slug: string;
  label: string;
  count: number;
  icon: string;
  sub?: SubCategory[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "volailles",
    label: "Volailles",
    count: 186,
    icon: "/icons/volaille.png",
    sub: [
      { slug: "pintades",  label: "Pintades",  count: 22, icon: "/icons/pintade.png" },
      { slug: "canards",   label: "Canards",   count: 18, icon: "/icons/canard.png" },
      { slug: "dindes",    label: "Dindes",    count: 14, icon: "/icons/dinde.png" },
      { slug: "cailles",   label: "Cailles",   count: 31, icon: "/icons/caille.png" },
      { slug: "pigeons",   label: "Pigeons",   count: 27, icon: "/icons/pigeon.png" },
      { slug: "oies",      label: "Oies",      count: 9,  icon: "/icons/oie.png" },
      { slug: "poussins",  label: "Poussins",  count: 45, icon: "/icons/poussins.png" },
    ],
  },
  { slug: "moutons",  label: "Moutons",        count: 86,  icon: "/icons/mouton.png" },
  { slug: "chevres",  label: "Chèvres",        count: 48,  icon: "/icons/chevre.png" },
  { slug: "vaches",   label: "Vaches",         count: 35,  icon: "/icons/vache.png" },
  { slug: "lapins",   label: "Lapins",         count: 38,  icon: "/icons/lapin.png" },
  {
    slug: "oeufs",
    label: "Œufs",
    count: 74,
    icon: "/icons/oeuf.png",
    sub: [
      { slug: "oeufs-frais",   label: "Œufs frais",    count: 56, icon: "/icons/oeuf.png" },
      { slug: "oeufs-feconde", label: "Œufs fécondés", count: 18, icon: "/icons/oeuf_fec.png" },
    ],
  },
  { slug: "lait",    label: "Lait & Dérivés", count: 24, icon: "/icons/derive.png" },
  { slug: "viandes", label: "Viandes",        count: 72, icon: "/icons/viande.png" },
];

export type DemoProduct = {
  slug: string;
  name: string;
  subtitle: string;
  badge?: string;
  price: number;
  city: string;
  vendor: string;
  category: string; // category slug
  image?: string;
};

export const DEMO_PRODUCTS: DemoProduct[] = [
  { slug: "poulet-goliath",    name: "Poulet Goliath",          subtitle: "Vivant · 3,5 kg",          badge: "Populaire",  price: 7500,   city: "Rufisque",     vendor: "Ferme Ndiaye",    category: "volailles" },
  { slug: "poulet-local",      name: "Poulet local amélioré",   subtitle: "Vivant · 2,5 kg",          badge: "Disponible", price: 5000,   city: "Pikine",       vendor: "Aviculture Thiaw", category: "volailles" },
  { slug: "lot-poulets",       name: "Lot de 10 poulets",       subtitle: "Prêt à cuire · 10 pièces", badge: "Lot",        price: 65000,  city: "Rufisque",     vendor: "Ferme Ndiaye",    category: "volailles" },
  { slug: "poussins-chair",    name: "Poussins d'un jour",      subtitle: "Chair · Lot de 50 min",    badge: "Nouveau",    price: 800,    city: "Rufisque",     vendor: "Ferme Ndiaye",    category: "poussins"  },
  { slug: "pintade-locale",    name: "Pintade locale",          subtitle: "Vivante · 1,8 kg",         badge: "Disponible", price: 6500,   city: "Thiès",        vendor: "Ferme Ba",        category: "pintades"  },
  { slug: "canard-barbarie",   name: "Canard Barbarie",         subtitle: "Vivant · 3 kg",            badge: "Disponible", price: 9000,   city: "Kaolack",      vendor: "Ranch du Saloum", category: "canards"   },
  { slug: "dinde-noire",       name: "Dinde noire",             subtitle: "Vivante · 6 kg",           badge: "Lot",        price: 22000,  city: "Thiès",        vendor: "Ferme Ba",        category: "dindes"    },
  { slug: "mouton-ladoum",     name: "Mouton Ladoum",           subtitle: "Mâle · 18 mois",           badge: "Disponible", price: 325000, city: "Keur Massar",  vendor: "Élevage Fall",    category: "moutons"   },
  { slug: "belier-peul",       name: "Bélier Peul-Peul",        subtitle: "Reproducteur · 2 ans",     badge: "Populaire",  price: 180000, city: "Keur Massar",  vendor: "Élevage Fall",    category: "moutons"   },
  { slug: "chevre-locale",     name: "Chèvre locale",           subtitle: "Femelle gestante",         badge: "Nouveau",    price: 75000,  city: "Keur Massar",  vendor: "Élevage Fall",    category: "chevres"   },
  { slug: "vache-laitiere",    name: "Vache laitière",          subtitle: "Zébu · 4 ans",             badge: "Disponible", price: 850000, city: "Kaolack",      vendor: "Ranch du Saloum", category: "vaches"    },
  { slug: "plateau-oeufs",     name: "Plateau de 30 œufs",     subtitle: "Frais · 30 pièces",        badge: "Nouveau",    price: 3500,   city: "Thiès",        vendor: "Ferme Ba",        category: "oeufs-frais" },
  { slug: "oeufs-feconde-lot", name: "Œufs fécondés pintade",  subtitle: "Lot de 20 pièces",         badge: "Disponible", price: 8000,   city: "Thiès",        vendor: "Ferme Ba",        category: "oeufs-feconde" },
  { slug: "lait-frais-5l",     name: "Lait frais local · 5L",  subtitle: "Vache · 5 L",              badge: "Lot",        price: 6000,   city: "Sangalkam",    vendor: "GIE Bokk Jom",    category: "lait"      },
  { slug: "yaourt-local",      name: "Yaourt local",            subtitle: "Pot de 500 ml",            badge: "Nouveau",    price: 1500,   city: "Sangalkam",    vendor: "GIE Bokk Jom",    category: "lait"      },
  { slug: "lapin-local",       name: "Lapin local",             subtitle: "Vivant · 1,5 kg",          badge: "Disponible", price: 8500,   city: "Dakar",        vendor: "Ferme Ndiaye",    category: "lapins"    },
  { slug: "viande-mouton-1kg", name: "Viande de mouton · 1 kg", subtitle: "Désossée · fraîche",      badge: "Populaire",  price: 5500,   city: "Keur Massar",  vendor: "Élevage Fall",    category: "viandes"   },
  { slug: "caille-vivante",    name: "Caille vivante",          subtitle: "Femelle pondeuse",         badge: "Nouveau",    price: 3500,   city: "Dakar",        vendor: "Aviculture Thiaw", category: "cailles"  },
  { slug: "pigeon-domestique", name: "Pigeon domestique",       subtitle: "Couple · adulte",          badge: "Disponible", price: 5000,   city: "Pikine",       vendor: "Aviculture Thiaw", category: "pigeons"  },
  { slug: "oie-blanche",       name: "Oie blanche",             subtitle: "Femelle · 4,5 kg",         badge: "Lot",        price: 18000,  city: "Thiès",        vendor: "Ferme Ba",        category: "oies"      },
];
