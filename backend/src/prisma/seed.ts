import { PrismaClient, FlockType, VaccinationRoute, StockType } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultStocks(teamId: string) {
  const stocks = [
    { type: StockType.LAYER_FEED, name: 'Aliment ponte', currentQty: 0, unit: 'kg', alertThreshold: 50 },
    { type: StockType.BROILER_FEED, name: 'Aliment croissance', currentQty: 0, unit: 'kg', alertThreshold: 50 },
    { type: StockType.MILLET, name: 'Mil', currentQty: 0, unit: 'kg', alertThreshold: 25 },
    { type: StockType.SUPPLEMENT, name: 'Complements/vitamines', currentQty: 0, unit: 'unite', alertThreshold: 2 },
    { type: StockType.VACCINE, name: 'Vaccins', currentQty: 0, unit: 'dose', alertThreshold: 50 },
    { type: StockType.MEDICATION, name: 'Medicaments', currentQty: 0, unit: 'unite', alertThreshold: 2 },
    { type: StockType.EMPTY_TRAYS, name: 'Tablettes vides', currentQty: 0, unit: 'unite', alertThreshold: 10 },
    { type: StockType.EGGS, name: 'Stock oeufs', currentQty: 0, unit: 'oeuf', alertThreshold: 30 },
  ];

  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: { teamId_type: { teamId, type: stock.type } },
      update: {},
      create: { teamId, ...stock },
    });
  }
}

async function createDefaultVaccinationProtocols(teamId: string) {
  const protocols = [
    // Chair
    { name: 'Newcastle', flockType: FlockType.BROILER, dayOfAdmin: 7, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Gumboro', flockType: FlockType.BROILER, dayOfAdmin: 14, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Newcastle rappel', flockType: FlockType.BROILER, dayOfAdmin: 21, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Gumboro rappel', flockType: FlockType.BROILER, dayOfAdmin: 28, route: VaccinationRoute.DRINKING_WATER },
    // Pondeuses
    { name: 'Newcastle', flockType: FlockType.LAYER, dayOfAdmin: 7, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Gumboro', flockType: FlockType.LAYER, dayOfAdmin: 14, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Newcastle rappel', flockType: FlockType.LAYER, dayOfAdmin: 21, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Bronchite infectieuse', flockType: FlockType.LAYER, dayOfAdmin: 42, route: VaccinationRoute.SPRAY },
    { name: 'Newcastle trimestriel', flockType: FlockType.LAYER, dayOfAdmin: 90, route: VaccinationRoute.DRINKING_WATER },
    // Reproducteurs
    { name: 'Newcastle', flockType: FlockType.BREEDER, dayOfAdmin: 7, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Gumboro', flockType: FlockType.BREEDER, dayOfAdmin: 14, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Newcastle rappel', flockType: FlockType.BREEDER, dayOfAdmin: 21, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Bronchite infectieuse', flockType: FlockType.BREEDER, dayOfAdmin: 42, route: VaccinationRoute.SPRAY },
    { name: 'Newcastle trimestriel', flockType: FlockType.BREEDER, dayOfAdmin: 90, route: VaccinationRoute.DRINKING_WATER },
    // Cailles
    { name: 'Newcastle', flockType: FlockType.QUAIL, dayOfAdmin: 7, route: VaccinationRoute.DRINKING_WATER },
    { name: 'Newcastle rappel', flockType: FlockType.QUAIL, dayOfAdmin: 28, route: VaccinationRoute.DRINKING_WATER },
  ];

  for (const protocol of protocols) {
    await prisma.vaccinationProtocol.create({
      data: { teamId, ...protocol },
    });
  }
}

async function main() {
  console.log('Seeding database...');

  // Creer un utilisateur de demo
  const demoUser = await prisma.user.upsert({
    where: { phone: '+221770000000' },
    update: {},
    create: {
      phone: '+221770000000',
      firstName: 'Demo',
      lastName: 'Eleveur',
    },
  });

  // Creer une equipe de demo
  const demoTeam = await prisma.team.upsert({
    where: { inviteCode: 'DEMO2026' },
    update: {},
    create: {
      name: 'Elevage Demo',
      location: 'Dakar, Senegal',
      inviteCode: 'DEMO2026',
    },
  });

  // Ajouter le membre
  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: demoUser.id, teamId: demoTeam.id } },
    update: {},
    create: {
      userId: demoUser.id,
      teamId: demoTeam.id,
      role: 'OWNER',
    },
  });

  // Stocks initiaux
  await createDefaultStocks(demoTeam.id);

  // Protocoles de vaccination
  await createDefaultVaccinationProtocols(demoTeam.id);

  console.log('Seed termine.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
