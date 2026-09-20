import { PrismaClient, PlanCode } from '@prisma/client';
import { hash } from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

// ─── Géographie ──────────────────────────────────────────────────────────────

const GEO_DATA = [
  {
    name: 'Dakar', slug: 'dakar',
    departments: [
      { name: 'Dakar', slug: 'dakar', cities: ['Plateau', 'Médina', 'Fann', 'Gueule Tapée'] },
      { name: 'Pikine', slug: 'pikine', cities: ['Pikine Est', 'Pikine Ouest', 'Guédiawaye', 'Thiaroye'] },
      { name: 'Rufisque', slug: 'rufisque', cities: ['Rufisque Est', 'Rufisque Nord', 'Rufisque Ouest', 'Bargny'] },
      { name: 'Guédiawaye', slug: 'guediawaye', cities: ['Sam Notaire', 'Ndiarème Limamoulaye', 'Golf Sud'] },
    ],
  },
  {
    name: 'Thiès', slug: 'thies',
    departments: [
      { name: 'Thiès', slug: 'thies', cities: ['Thiès Nord', 'Thiès Est', 'Thiès Ouest'] },
      { name: 'Mbour', slug: 'mbour', cities: ['Mbour', 'Saly', 'Nguékokh', 'Joal-Fadiouth'] },
      { name: 'Tivaouane', slug: 'tivaouane', cities: ['Tivaouane', 'Mékhé', 'Pout'] },
    ],
  },
  {
    name: 'Saint-Louis', slug: 'saint-louis',
    departments: [
      { name: 'Saint-Louis', slug: 'saint-louis', cities: ['Saint-Louis', 'Sor', 'Gandon'] },
      { name: 'Dagana', slug: 'dagana', cities: ['Richard Toll', 'Dagana', 'Ross Béthio'] },
      { name: 'Podor', slug: 'podor', cities: ['Podor', 'Ndioum', 'Cas Cas'] },
    ],
  },
  {
    name: 'Diourbel', slug: 'diourbel',
    departments: [
      { name: 'Diourbel', slug: 'diourbel', cities: ['Diourbel', 'Ndoulo', 'Tocky Gare'] },
      { name: 'Bambey', slug: 'bambey', cities: ['Bambey', 'Ngoye', 'Baba Garage'] },
      { name: 'Mbacké', slug: 'mbacke', cities: ['Mbacké', 'Touba', 'Darou Mousty'] },
    ],
  },
  {
    name: 'Louga', slug: 'louga',
    departments: [
      { name: 'Louga', slug: 'louga', cities: ['Louga', 'Coki', 'Sakal'] },
      { name: 'Linguère', slug: 'linguere', cities: ['Linguère', 'Dahra', 'Yang Yang'] },
      { name: 'Kébémer', slug: 'kebemer', cities: ['Kébémer', 'Ndande', 'Thiès None'] },
    ],
  },
  {
    name: 'Fatick', slug: 'fatick',
    departments: [
      { name: 'Fatick', slug: 'fatick', cities: ['Fatick', 'Diakhao', 'Gossas'] },
      { name: 'Foundiougne', slug: 'foundiougne', cities: ['Foundiougne', 'Passy', 'Sokone'] },
      { name: 'Gossas', slug: 'gossas', cities: ['Gossas', 'Ouadiour', 'Ndiandiaye'] },
    ],
  },
  {
    name: 'Kaolack', slug: 'kaolack',
    departments: [
      { name: 'Kaolack', slug: 'kaolack', cities: ['Kaolack', 'Gandiaye', 'Kahone'] },
      { name: 'Guinguinéo', slug: 'guinguineo', cities: ['Guinguinéo', 'Diouf', 'Kaffrine'] },
      { name: 'Nioro du Rip', slug: 'nioro-du-rip', cities: ['Nioro', 'Paos Koto', 'Keur Madiabel'] },
    ],
  },
  {
    name: 'Tambacounda', slug: 'tambacounda',
    departments: [
      { name: 'Tambacounda', slug: 'tambacounda', cities: ['Tambacounda', 'Koumpentoum', 'Mako'] },
      { name: 'Bakel', slug: 'bakel', cities: ['Bakel', 'Kidira', 'Diawara'] },
      { name: 'Kédougou', slug: 'kedougou', cities: ['Kédougou', 'Saraya', 'Salemata'] },
    ],
  },
  {
    name: 'Kolda', slug: 'kolda',
    departments: [
      { name: 'Kolda', slug: 'kolda', cities: ['Kolda', 'Medina Chérif', 'Salikégné'] },
      { name: 'Vélingara', slug: 'velingara', cities: ['Vélingara', 'Pakour', 'Diaobé'] },
      { name: 'Sédhiou', slug: 'sedhiou', cities: ['Sédhiou', 'Bounkiling', 'Goudomp'] },
    ],
  },
  {
    name: 'Ziguinchor', slug: 'ziguinchor',
    departments: [
      { name: 'Ziguinchor', slug: 'ziguinchor', cities: ['Ziguinchor', 'Niaguis', 'Niomoun'] },
      { name: 'Oussouye', slug: 'oussouye', cities: ['Oussouye', 'Mlomp', 'Cabrousse'] },
      { name: 'Bignona', slug: 'bignona', cities: ['Bignona', 'Sindian', 'Diouloulou'] },
    ],
  },
  {
    name: 'Matam', slug: 'matam',
    departments: [
      { name: 'Matam', slug: 'matam', cities: ['Matam', 'Ogo', 'Ourossogui'] },
      { name: 'Kanel', slug: 'kanel', cities: ['Kanel', 'Orkadiéré', 'Semmé'] },
      { name: 'Ranérou', slug: 'ranerou', cities: ['Ranérou', 'Vélingara Ferlo', 'Thilogne'] },
    ],
  },
  {
    name: 'Kaffrine', slug: 'kaffrine',
    departments: [
      { name: 'Kaffrine', slug: 'kaffrine', cities: ['Kaffrine', 'Koungheul', 'Birkelane'] },
      { name: 'Koungheul', slug: 'koungheul', cities: ['Koungheul', 'Ida Mouride', 'Saly Escale'] },
    ],
  },
  {
    name: 'Kédougou', slug: 'kedougou',
    departments: [
      { name: 'Kédougou', slug: 'kedougou-dep', cities: ['Kédougou', 'Bandafassi', 'Dindefelo'] },
      { name: 'Saraya', slug: 'saraya', cities: ['Saraya', 'Khossanto', 'Tomboronkoto'] },
    ],
  },
  {
    name: 'Sédhiou', slug: 'sedhiou-region',
    departments: [
      { name: 'Sédhiou', slug: 'sedhiou-dep', cities: ['Sédhiou', 'Marsassoum', 'Diattacounda'] },
      { name: 'Bounkiling', slug: 'bounkiling', cities: ['Bounkiling', 'Tankon', 'Niamone'] },
      { name: 'Goudomp', slug: 'goudomp', cities: ['Goudomp', 'Diégoune', 'Bona'] },
    ],
  },
];

// ─── Catégories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Volailles', slug: 'volailles', sortOrder: 1, icon: '🐔',
    children: [
      { name: 'Poulets de chair', slug: 'poulets-de-chair', sortOrder: 1 },
      { name: 'Poules pondeuses', slug: 'poules-pondeuses', sortOrder: 2 },
      { name: 'Poulets locaux (Thiouye)', slug: 'poulets-locaux', sortOrder: 3 },
      { name: 'Dindes', slug: 'dindes', sortOrder: 4 },
      { name: 'Pintades', slug: 'pintades', sortOrder: 5 },
    ],
  },
  {
    name: 'Petits ruminants', slug: 'petits-ruminants', sortOrder: 2, icon: '🐑',
    children: [
      { name: 'Moutons', slug: 'moutons', sortOrder: 1 },
      { name: 'Chèvres', slug: 'chevres', sortOrder: 2 },
    ],
  },
  {
    name: 'Bovins', slug: 'bovins', sortOrder: 3, icon: '🐄',
    children: [
      { name: 'Vaches laitières', slug: 'vaches-laitieres', sortOrder: 1 },
      { name: 'Bœufs de boucherie', slug: 'boeufs-boucherie', sortOrder: 2 },
      { name: 'Veaux', slug: 'veaux', sortOrder: 3 },
    ],
  },
  {
    name: 'Œufs', slug: 'oeufs', sortOrder: 4, icon: '🥚',
    children: [
      { name: 'Œufs de poule', slug: 'oeufs-de-poule', sortOrder: 1 },
      { name: 'Œufs de caille', slug: 'oeufs-de-caille', sortOrder: 2 },
    ],
  },
  {
    name: 'Lapins', slug: 'lapins', sortOrder: 5, icon: '🐇',
    children: [],
  },
  {
    name: 'Porcs', slug: 'porcs', sortOrder: 6, icon: '🐷',
    children: [],
  },
  {
    name: 'Aliments & Intrants', slug: 'aliments-intrants', sortOrder: 7, icon: '🌾',
    children: [
      { name: 'Aliments volailles', slug: 'aliments-volailles', sortOrder: 1 },
      { name: 'Médicaments vétérinaires', slug: 'medicaments-veterinaires', sortOrder: 2 },
      { name: 'Matériel d\'élevage', slug: 'materiel-elevage', sortOrder: 3 },
    ],
  },
  {
    name: 'Poissons', slug: 'poissons', sortOrder: 8, icon: '🐟',
    children: [
      { name: 'Tilapia', slug: 'tilapia', sortOrder: 1 },
      { name: 'Capitaine', slug: 'capitaine', sortOrder: 2 },
    ],
  },
];

// ─── Plans ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    code: PlanCode.FREE,
    name: 'Gratuit',
    description: 'Idéal pour démarrer. Publiez jusqu\'à 10 produits.',
    priceMonthly: 0,
    maxProducts: 10,
    canBeVerified: false,
    canBeFeatured: false,
    sortOrder: 0,
  },
  {
    code: PlanCode.STANDARD,
    name: 'Standard',
    description: 'Pour les éleveurs actifs. 50 produits, badge vérifié possible.',
    priceMonthly: 5000,
    maxProducts: 50,
    canBeVerified: true,
    canBeFeatured: false,
    isActive: false, // disabled at launch
    sortOrder: 1,
  },
  {
    code: PlanCode.PRO,
    name: 'Pro',
    description: 'Pour les professionnels. Produits illimités, mise en avant.',
    priceMonthly: 15000,
    maxProducts: 999,
    canBeVerified: true,
    canBeFeatured: true,
    isActive: false, // disabled at launch
    sortOrder: 2,
  },
];

// ─── Site Settings ────────────────────────────────────────────────────────────

const SITE_SETTINGS: Record<string, string> = {
  'site.name': 'Guett Gui',
  'site.tagline': 'La marketplace d\'élevage au Sénégal',
  'site.description': 'Achetez et vendez des animaux d\'élevage, volailles, œufs et produits agricoles directement auprès des éleveurs vérifiés du Sénégal.',
  'site.email': 'contact@guettgui.sn',
  'site.email.support': 'support@guettgui.sn',
  'site.phone': '+221 77 000 00 00',
  'site.address': 'Dakar, Sénégal',
  'site.currency': 'XOF',
  'site.currency.symbol': 'FCFA',
  'site.logo.url': '/logo.png',
  'site.logo.dark.url': '/logo-dark.png',
  'site.favicon.url': '/favicon.ico',
  'site.color.brand': '#22A849',
  'site.facebook': 'https://facebook.com/guettgui',
  'site.whatsapp': '+221770000000',
  'site.twitter': '',
  'site.instagram': '',
  'site.youtube': '',
  'seller.min_age': '18',
  'seller.require_ninea': 'false',
  'order.whatsapp_enabled': 'true',
};

// ─── Main seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...');

  // Plans
  console.log('  → Plans...');
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  // Site settings
  console.log('  → Site settings...');
  for (const [key, value] of Object.entries(SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // Geography
  console.log('  → Geography...');
  for (const regionData of GEO_DATA) {
    const region = await prisma.region.upsert({
      where: { slug: regionData.slug },
      update: { name: regionData.name },
      create: { name: regionData.name, slug: regionData.slug },
    });

    for (const deptData of regionData.departments) {
      const dept = await prisma.department.upsert({
        where: { slug_regionId: { slug: deptData.slug, regionId: region.id } },
        update: { name: deptData.name },
        create: { name: deptData.name, slug: deptData.slug, regionId: region.id },
      });

      for (const cityName of deptData.cities) {
        const citySlug = slugify(cityName, { lower: true, strict: true });
        await prisma.city.upsert({
          where: { slug_departmentId: { slug: citySlug, departmentId: dept.id } },
          update: { name: cityName },
          create: { name: cityName, slug: citySlug, departmentId: dept.id },
        });
      }
    }
  }

  // Categories
  console.log('  → Categories...');
  for (const catData of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { name: catData.name, sortOrder: catData.sortOrder },
      create: {
        name: catData.name,
        slug: catData.slug,
        sortOrder: catData.sortOrder,
        description: `Catégorie ${catData.name}`,
      },
    });

    for (const child of catData.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, sortOrder: child.sortOrder, parentId: parent.id },
        create: {
          name: child.name,
          slug: child.slug,
          sortOrder: child.sortOrder,
          parentId: parent.id,
        },
      });
    }
  }

  // Demo admin
  console.log('  → Admin user...');
  const adminHash = await hash('Admin@2025!', 12);
  await prisma.user.upsert({
    where: { phone: '+221700000001' },
    update: {},
    create: {
      fullName: 'Admin Guett Gui',
      phone: '+221700000001',
      email: 'admin@guettgui.sn',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  // Demo seller
  console.log('  → Demo seller...');
  const sellerHash = await hash('Vendeur@2025!', 12);
  const freePlan = await prisma.plan.findUnique({ where: { code: PlanCode.FREE } });
  const dakarRegion = await prisma.region.findUnique({ where: { slug: 'dakar' } });

  const demoSeller = await prisma.user.upsert({
    where: { phone: '+221770000001' },
    update: {},
    create: {
      fullName: 'Mamadou Diallo',
      phone: '+221770000001',
      email: 'mamadou@demo.sn',
      passwordHash: sellerHash,
      role: 'SELLER',
    },
  });

  const existingShop = await prisma.shop.findUnique({ where: { userId: demoSeller.id } });
  if (!existingShop) {
    const shop = await prisma.shop.create({
      data: {
        userId: demoSeller.id,
        name: 'Ferme Diallo',
        slug: 'ferme-diallo',
        description: 'Élevage de volailles et petits ruminants depuis 15 ans. Qualité garantie, livraison possible à Dakar.',
        phone: '+221770000001',
        regionId: dakarRegion?.id,
        verified: true,
        status: 'ACTIVE',
        since: '2009',
        ...(freePlan && { subscription: { create: { planId: freePlan.id, status: 'ACTIVE' } } }),
      },
    });

    // Demo products
    const volaillescat = await prisma.category.findUnique({ where: { slug: 'poulets-de-chair' } });
    const oeufscat = await prisma.category.findUnique({ where: { slug: 'oeufs-de-poule' } });

    if (volaillescat) {
      await prisma.product.createMany({
        data: [
          {
            shopId: shop.id,
            categoryId: volaillescat.id,
            name: 'Poulet de chair 2kg+',
            slug: 'poulet-de-chair-2kg-ferme-diallo',
            description: 'Poulets de chair nourris au maïs, sans hormones. Poids minimum 2kg. Disponible à la commande.',
            basePrice: 3500,
            unit: 'pièce',
            stock: 200,
            status: 'ACTIVE',
            featured: true,
            badge: 'Populaire',
          },
          {
            shopId: shop.id,
            categoryId: volaillescat.id,
            name: 'Poulet local Thiouye',
            slug: 'poulet-local-thiouye-ferme-diallo',
            description: 'Poulets locaux élevés en plein air. Saveur authentique, chair ferme.',
            basePrice: 5000,
            unit: 'pièce',
            stock: 50,
            status: 'ACTIVE',
            featured: false,
          },
        ],
      });
    }

    if (oeufscat) {
      const eggs = await prisma.product.create({
        data: {
          shopId: shop.id,
          categoryId: oeufscat.id,
          name: 'Œufs frais de ferme',
          slug: 'oeufs-frais-ferme-diallo',
          description: 'Œufs frais de poules pondeuses. Ramassage quotidien.',
          basePrice: 150,
          unit: 'œuf',
          stock: 1000,
          status: 'ACTIVE',
          featured: true,
          badge: 'Frais du jour',
        },
      });
      await prisma.priceOption.createMany({
        data: [
          { productId: eggs.id, label: 'Plateau 30 œufs', price: 4000, stock: 50 },
          { productId: eggs.id, label: 'Plateau 15 œufs', price: 2100, stock: 100 },
          { productId: eggs.id, label: 'À l\'unité', price: 150 },
        ],
      });
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
