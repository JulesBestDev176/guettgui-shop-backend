import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  // Volaille
  { name: "Poulet de chair", slug: "poulet-de-chair", description: "Eleve pour la viande", icon: "Drumstick", sortOrder: 1 },
  { name: "Poulet local", slug: "poulet-local", description: "Gout authentique", icon: "Drumstick", sortOrder: 2 },
  { name: "Local ameliore", slug: "local-ameliore", description: "Race croisee", icon: "Drumstick", sortOrder: 3 },
  { name: "Poulet vivant", slug: "poulet-vivant", description: "Sur pied", icon: "Bird", sortOrder: 4 },
  { name: "Pret a cuire", slug: "pret-a-cuire", description: "Plume et vide", icon: "ChefHat", sortOrder: 5 },
  { name: "Dinde", slug: "dinde", description: "Dinde entiere ou decoupee", icon: "Bird", sortOrder: 6 },
  { name: "Canard", slug: "canard", description: "Canard frais", icon: "Bird", sortOrder: 7 },
  { name: "Oeufs", slug: "oeufs", description: "Oeufs frais de ferme", icon: "Egg", sortOrder: 8 },

  // Betail
  { name: "Boeuf", slug: "boeuf", description: "Bovins vivants ou viande", icon: "Beef", sortOrder: 10 },
  { name: "Mouton", slug: "mouton", description: "Ovins vivants ou viande", icon: "Sheep", sortOrder: 11 },
  { name: "Chevre", slug: "chevre", description: "Caprins vivants ou viande", icon: "Goat", sortOrder: 12 },
  { name: "Cheval", slug: "cheval", description: "Equins", icon: "Horse", sortOrder: 13 },

  // Vente en gros
  { name: "Vente en lot", slug: "vente-en-lot", description: "Achat en gros", icon: "Package", sortOrder: 20 },
  { name: "Ramasse", slug: "ramasse", description: "Enlevement a la ferme", icon: "Truck", sortOrder: 21 },

  // Equipement & alimentation
  { name: "Alimentation animale", slug: "alimentation-animale", description: "Granules, foin, complements", icon: "Wheat", sortOrder: 30 },
  { name: "Outils et equipements", slug: "outils-equipements", description: "Materiel d'elevage", icon: "Wrench", sortOrder: 31 },
];

async function main() {
  console.log("Seeding categories...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
