# SenGuett — Modélisation Base de Données

**Version** : 1.0
**Date** : 2026-08-21
**Stack** : PostgreSQL + Prisma ORM

---

## 1. Vue d'ensemble

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User      │────▶│  TeamMember  │◀────│    Team      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┤
                    │          │               │
              ┌─────▼─────┐ ┌─▼──────────┐ ┌──▼──────────┐
              │   Flock    │ │  Customer   │ │   Stock     │
              │  (Lot)     │ │             │ │             │
              └─────┬──────┘ └──────┬──────┘ └─────┬───────┘
                    │               │               │
         ┌─────────┼─────────┐     │         ┌─────▼──────┐
         │         │         │     │         │ StockMove   │
   ┌─────▼──┐ ┌───▼────┐ ┌──▼──┐  │         └────────────┘
   │Daily   │ │Incuba  │ │Vacc │  │
   │Record  │ │tion    │ │inat │  │
   └────────┘ │Batch   │ │ion  │  │
              └───┬────┘ └─────┘  │
                  │               │
              ┌───▼────┐    ┌─────▼──────┐
              │Incuba  │    │   Sale      │
              │tionLog │    │             │
              └────────┘    └──────┬─────┘
                                   │
                            ┌──────▼─────┐
                            │ SalePayment│
                            └────────────┘

         ┌──────────┐    ┌──────────┐    ┌──────────┐
         │ Expense  │    │  Order   │    │  Alert   │
         └──────────┘    └──────────┘    └──────────┘
```

---

## 2. Schéma Prisma complet

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ════════════════════════════════════════════════════════════
// UTILISATEURS & ÉQUIPES
// ════════════════════════════════════════════════════════════

model User {
  id          String   @id @default(cuid())
  phone       String   @unique
  firstName   String
  lastName    String
  avatarUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  memberships TeamMember[]
}

model Team {
  id          String   @id @default(cuid())
  name        String                         // Nom de l'élevage
  location    String?                        // Localisation
  logoUrl     String?
  currency    String   @default("XOF")       // Devise
  inviteCode  String   @unique @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // ─── Objectifs de production ───
  targetLayingRate    Float @default(70)      // Taux de ponte cible (%)
  targetFertility     Float @default(85)      // Taux de fertilité cible (%)
  targetHatchRate     Float @default(82)      // Taux d'éclosion cible (%)

  members           TeamMember[]
  flocks            Flock[]
  incubators        Incubator[]
  customers         Customer[]
  stocks            Stock[]
  expenses          Expense[]
  sales             Sale[]
  orders            Order[]
  alerts            Alert[]
  vaccinationProtocols VaccinationProtocol[]
  auditLogs         AuditLog[]
}

enum TeamRole {
  OWNER       // Propriétaire — accès total + gestion des membres
  MEMBER      // Membre — tout sauf gestion des membres et suppression équipe
}

model TeamMember {
  id        String   @id @default(cuid())
  userId    String
  teamId    String
  role      TeamRole @default(MEMBER)
  joinedAt  DateTime @default(now())
  removedAt DateTime?

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])

  @@unique([userId, teamId])
}

// ════════════════════════════════════════════════════════════
// ÉLEVAGE — LOTS (FLOCKS)
// ════════════════════════════════════════════════════════════

enum FlockType {
  BREEDER     // Reproducteur (Goliath, etc.)
  LAYER       // Pondeuse (œufs de consommation)
  BROILER     // Chair (engraissement)
  QUAIL       // Caille
}

enum FlockStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

model Flock {
  id              String      @id @default(cuid())
  teamId          String
  name            String                          // "Goliath - Noyau 1", "Chair - Lot 12"
  type            FlockType
  breed           String?                         // Race : "Goliath", "ISA Brown", "Cobb 500", "Caille japonaise"
  status          FlockStatus @default(ACTIVE)
  startDate       DateTime                        // Date de démarrage du lot
  endDate         DateTime?                       // Date de clôture
  initialMales    Int         @default(0)
  initialFemales  Int         @default(0)
  initialTotal    Int         @default(0)         // Pour les lots chair (pas de distinction M/F)
  currentMales    Int         @default(0)
  currentFemales  Int         @default(0)
  currentTotal    Int         @default(0)

  // ─── Paramètres spécifiques ───
  targetLayingRate     Float?                     // Override objectif ponte (sinon celui de l'équipe)
  broilerDurationDays  Int?                       // Durée d'engraissement (chair, défaut 45)
  incubationDays       Int?                       // Durée d'incubation (24 poulet, 17 caille)
  expectedEndDate      DateTime?                  // Date d'abattage prévue (chair)

  notes           String?
  photoUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  team              Team              @relation(fields: [teamId], references: [id])
  dailyRecords      DailyRecord[]
  incubationBatches IncubationBatch[]
  vaccinations      Vaccination[]
  sales             Sale[]
  expenses          Expense[]
  orders            Order[]

  @@index([teamId, status])
  @@index([teamId, type])
}

// ════════════════════════════════════════════════════════════
// SAISIE QUOTIDIENNE
// ════════════════════════════════════════════════════════════

model DailyRecord {
  id              String   @id @default(cuid())
  flockId         String
  date            DateTime @db.Date                // Date de la saisie
  recordedById    String                           // Membre qui a saisi

  // ─── Ponte (reproducteur, pondeuse, caille) ───
  eggsLaid        Int?                             // Œufs pondus
  eggsBroken      Int?                             // Œufs cassés/perdus
  eggsCollected   Int?                             // Œufs collectés (= laid - broken)

  // ─── Mortalité ───
  mortalityCount  Int      @default(0)             // Nombre de morts
  mortalityCause  String?                          // Cause (enum côté app, texte en BDD)

  // ─── Alimentation ───
  feedConsumedKg  Float?                           // Aliment consommé (kg)
  waterConsumedL  Float?                           // Eau consommée (litres, optionnel)

  // ─── Croissance (chair) ───
  avgWeightKg     Float?                           // Poids moyen estimé (kg)
  sampleSize      Int?                             // Nombre d'animaux pesés

  // ─── Méta ───
  notes           String?
  photoUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // ─── Sync offline ───
  localId         String?                          // ID local pour sync
  syncedAt        DateTime?                        // Date de synchronisation

  flock Flock @relation(fields: [flockId], references: [id])

  @@unique([flockId, date])                        // Une seule saisie par lot par jour
  @@index([flockId, date])
}

// ════════════════════════════════════════════════════════════
// INCUBATION
// ════════════════════════════════════════════════════════════

model Incubator {
  id          String @id @default(cuid())
  teamId      String
  name        String                              // "Couveuse 1", "Couveuse 2"
  capacity    Int                                 // Capacité en œufs (ex: 56)
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())

  team    Team              @relation(fields: [teamId], references: [id])
  batches IncubationBatch[]
}

enum IncubationStatus {
  LOADING       // En chargement
  INCUBATING    // En cours d'incubation
  CANDLING_1    // Mirage J7
  CANDLING_2    // Mirage J14
  HATCHING      // Éclosion en cours
  COMPLETED     // Terminé
  CANCELLED     // Annulé
}

model IncubationBatch {
  id              String           @id @default(cuid())
  teamId          String
  incubatorId     String
  sourceFlockId   String                          // Lot d'origine des œufs
  status          IncubationStatus @default(LOADING)

  // ─── Dates ───
  loadDate        DateTime         @db.Date       // Date de chargement (J0)
  candling1Date   DateTime?        @db.Date       // J7 calculé
  candling2Date   DateTime?        @db.Date       // J14 calculé
  expectedHatchDate DateTime?      @db.Date       // J24 ou J17 calculé
  actualHatchDate DateTime?        @db.Date       // Date réelle d'éclosion

  // ─── Chargement ───
  eggsLoaded      Int                             // Œufs chargés

  // ─── Mirage J7 ───
  eggsFertile     Int?                            // Œufs fertiles
  eggsClear       Int?                            // Œufs clairs (retirés)
  eggsDeadJ7      Int?                            // Embryons morts J7

  // ─── Mirage J14 ───
  eggsAliveJ14    Int?                            // Œufs vivants J14
  eggsDeadJ14     Int?                            // Embryons morts J14

  // ─── Éclosion ───
  chicksHatched   Int?                            // Poussins éclos
  eggsUnhatched   Int?                            // Œufs non éclos
  chicksAliveD1   Int?                            // Poussins vivants à J1
  chicksDeadD0    Int?                            // Mortalité J0

  // ─── Taux calculés ───
  fertilityRate   Float?                          // eggsFertile / eggsLoaded × 100
  hatchRate       Float?                          // chicksHatched / eggsFertile × 100
  overallRate     Float?                          // chicksHatched / eggsLoaded × 100

  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  incubator   Incubator @relation(fields: [incubatorId], references: [id])
  sourceFlock Flock     @relation(fields: [sourceFlockId], references: [id])

  @@index([teamId, status])
  @@index([expectedHatchDate])
}

// ════════════════════════════════════════════════════════════
// VACCINATION
// ════════════════════════════════════════════════════════════

enum VaccinationRoute {
  DRINKING_WATER    // Eau de boisson
  INJECTION         // Injection
  SPRAY             // Spray
  EYE_DROP          // Collyre
  OTHER
}

model VaccinationProtocol {
  id              String   @id @default(cuid())
  teamId          String
  name            String                          // "Newcastle", "Gumboro"
  flockType       FlockType                       // Type d'élevage concerné
  dayOfAdmin      Int                             // Jour d'administration (J1, J7, etc.)
  route           VaccinationRoute
  notes           String?
  createdAt       DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id])

  @@index([teamId, flockType])
}

model Vaccination {
  id              String   @id @default(cuid())
  flockId         String
  vaccineName     String                          // Nom du vaccin
  scheduledDate   DateTime @db.Date               // Date prévue
  actualDate      DateTime? @db.Date              // Date réelle (null = pas fait)
  route           VaccinationRoute
  doseGiven       String?                         // Dose administrée
  isDone          Boolean  @default(false)
  doneById        String?                         // Qui a vacciné
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  flock Flock @relation(fields: [flockId], references: [id])

  @@index([flockId, scheduledDate])
  @@index([scheduledDate, isDone])
}

// ════════════════════════════════════════════════════════════
// FINANCES — DÉPENSES
// ════════════════════════════════════════════════════════════

enum ExpenseCategory {
  FEED            // Alimentation
  HEALTH          // Santé (vaccins, médicaments, vitamines)
  ANIMAL_PURCHASE // Achat d'animaux
  EQUIPMENT       // Équipement
  LABOR           // Main d'œuvre
  TRANSPORT       // Transport
  ENERGY          // Énergie (électricité, gaz)
  OTHER           // Autre
}

model Expense {
  id              String          @id @default(cuid())
  teamId          String
  flockId         String?                         // Lot concerné (optionnel)
  date            DateTime        @db.Date
  category        ExpenseCategory
  subCategory     String?                         // Sous-catégorie libre
  description     String
  amount          Int                             // Montant en FCFA (entier)
  photoUrl        String?                         // Justificatif
  recordedById    String                          // Qui a saisi
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // ─── Sync offline ───
  localId         String?
  syncedAt        DateTime?

  team  Team   @relation(fields: [teamId], references: [id])
  flock Flock? @relation(fields: [flockId], references: [id])

  // ─── Lien stock (si achat d'aliment) ───
  stockMoves StockMove[]

  @@index([teamId, date])
  @@index([teamId, category])
}

// ════════════════════════════════════════════════════════════
// FINANCES — VENTES
// ════════════════════════════════════════════════════════════

enum ProductType {
  CHICKS              // Poussins
  FERTILE_EGGS        // Œufs féconds (tablette 30)
  CONSUMPTION_EGGS    // Œufs de consommation
  LIVE_CHICKEN        // Poulets vivants
  SLAUGHTERED_CHICKEN // Poulets abattus
  LIVE_QUAIL          // Cailles vivantes
  QUAIL_EGGS          // Œufs de caille
  QUAIL_MEAT          // Chair de caille
  OTHER
}

enum PaymentStatus {
  PAID
  PENDING
  PARTIAL
}

enum PaymentMethod {
  CASH
  WAVE
  ORANGE_MONEY
  FREE_MONEY
  BANK_TRANSFER
  OTHER
}

model Sale {
  id              String        @id @default(cuid())
  teamId          String
  flockId         String?                         // Lot d'origine
  customerId      String?                         // Client (optionnel)
  orderId         String?       @unique           // Commande liée (optionnel)
  date            DateTime      @db.Date
  productType     ProductType
  quantity        Int                             // Quantité vendue
  unitPrice       Int                             // Prix unitaire (FCFA)
  totalAmount     Int                             // Montant total (calculé)
  paymentStatus   PaymentStatus @default(PAID)
  amountPaid      Int           @default(0)       // Montant déjà payé
  paymentMethod   PaymentMethod?
  notes           String?
  recordedById    String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // ─── Sync offline ───
  localId         String?
  syncedAt        DateTime?

  team     Team      @relation(fields: [teamId], references: [id])
  flock    Flock?    @relation(fields: [flockId], references: [id])
  customer Customer? @relation(fields: [customerId], references: [id])
  order    Order?    @relation(fields: [orderId], references: [id])
  payments SalePayment[]

  @@index([teamId, date])
  @@index([teamId, paymentStatus])
  @@index([customerId])
}

model SalePayment {
  id          String        @id @default(cuid())
  saleId      String
  date        DateTime      @db.Date
  amount      Int                                 // Montant du paiement
  method      PaymentMethod
  notes       String?
  recordedById String
  createdAt   DateTime @default(now())

  sale Sale @relation(fields: [saleId], references: [id])

  @@index([saleId])
}

// ════════════════════════════════════════════════════════════
// CLIENTS
// ════════════════════════════════════════════════════════════

enum CustomerType {
  INDIVIDUAL    // Particulier
  RESELLER      // Revendeur
  BREEDER       // Éleveur
}

model Customer {
  id          String       @id @default(cuid())
  teamId      String
  firstName   String
  lastName    String
  phone       String?
  city        String?
  district    String?                             // Quartier
  type        CustomerType @default(INDIVIDUAL)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  team   Team    @relation(fields: [teamId], references: [id])
  sales  Sale[]
  orders Order[]

  @@index([teamId])
  @@index([teamId, phone])
}

// ════════════════════════════════════════════════════════════
// COMMANDES
// ════════════════════════════════════════════════════════════

enum OrderStatus {
  PENDING       // En attente
  CONFIRMED     // Confirmée
  DELIVERED     // Livrée (→ génère une vente)
  CANCELLED     // Annulée
}

model Order {
  id              String      @id @default(cuid())
  teamId          String
  customerId      String
  flockId         String?                         // Lot source prévu
  productType     ProductType
  quantity        Int
  unitPrice       Int?                            // Prix convenu (optionnel)
  requestedDate   DateTime    @db.Date            // Date de livraison souhaitée
  status          OrderStatus @default(PENDING)
  notes           String?
  recordedById    String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  team     Team      @relation(fields: [teamId], references: [id])
  customer Customer  @relation(fields: [customerId], references: [id])
  flock    Flock?    @relation(fields: [flockId], references: [id])
  sale     Sale?                                  // Vente générée quand livrée

  @@index([teamId, status])
  @@index([teamId, requestedDate])
}

// ════════════════════════════════════════════════════════════
// STOCKS
// ════════════════════════════════════════════════════════════

enum StockType {
  LAYER_FEED        // Aliment ponte
  BROILER_FEED      // Aliment croissance
  MILLET            // Mil
  SUPPLEMENT        // Compléments/vitamines
  VACCINE           // Vaccins
  MEDICATION        // Médicaments
  EMPTY_TRAYS       // Tablettes vides
  EGGS              // Stock d'œufs (calculé)
}

model Stock {
  id              String    @id @default(cuid())
  teamId          String
  type            StockType
  name            String                          // Nom affiché ("Aliment ponte 50kg", etc.)
  currentQty      Float                           // Quantité actuelle
  unit            String                          // "kg", "dose", "unité", "œuf"
  alertThreshold  Float                           // Seuil d'alerte
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  team  Team        @relation(fields: [teamId], references: [id])
  moves StockMove[]

  @@unique([teamId, type])
  @@index([teamId])
}

enum StockMoveType {
  IN_PURCHASE       // Entrée par achat
  IN_PRODUCTION     // Entrée par production (œufs collectés)
  IN_OTHER          // Autre entrée
  OUT_CONSUMPTION   // Sortie consommation quotidienne
  OUT_INCUBATION    // Sortie vers couveuse
  OUT_SALE          // Sortie par vente
  OUT_LOSS          // Perte / périmé
  OUT_OTHER         // Autre sortie
  ADJUSTMENT        // Correction manuelle
}

model StockMove {
  id          String        @id @default(cuid())
  stockId     String
  type        StockMoveType
  quantity    Float                               // Positif = entrée, négatif = sortie
  date        DateTime      @db.Date
  description String?
  expenseId   String?                             // Lié à un achat
  recordedById String
  createdAt   DateTime @default(now())

  // ─── Sync offline ───
  localId     String?
  syncedAt    DateTime?

  stock   Stock    @relation(fields: [stockId], references: [id])
  expense Expense? @relation(fields: [expenseId], references: [id])

  @@index([stockId, date])
}

// ════════════════════════════════════════════════════════════
// ALERTES
// ════════════════════════════════════════════════════════════

enum AlertType {
  LOW_STOCK
  CANDLING_DUE
  HATCH_DUE
  VACCINATION_DUE
  SLAUGHTER_DUE
  LOW_LAYING_RATE
  HIGH_MORTALITY
  OLD_DEBT
  MISSING_RECORD
  MALE_RATIO
  LAYER_END_CYCLE
  ORDER_DUE
}

enum AlertPriority {
  LOW
  MEDIUM
  HIGH
}

model Alert {
  id          String        @id @default(cuid())
  teamId      String
  type        AlertType
  priority    AlertPriority
  title       String
  message     String
  isRead      Boolean       @default(false)
  isDismissed Boolean       @default(false)
  referenceId String?                             // ID de l'entité liée (lot, stock, etc.)
  createdAt   DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id])

  @@index([teamId, isRead])
  @@index([teamId, type])
}

// ════════════════════════════════════════════════════════════
// AUDIT LOG
// ════════════════════════════════════════════════════════════

model AuditLog {
  id          String   @id @default(cuid())
  teamId      String
  userId      String
  action      String                              // "CREATE", "UPDATE", "DELETE"
  entity      String                              // "DailyRecord", "Sale", "Expense", etc.
  entityId    String                              // ID de l'entité modifiée
  oldValue    Json?                               // Valeur avant modification
  newValue    Json?                               // Valeur après modification
  createdAt   DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id])

  @@index([teamId, createdAt])
  @@index([teamId, entity])
}
```

---

## 3. Relations clés

### 3.1 Diagramme de relations

```
User ──1:N──▶ TeamMember ◀──N:1── Team
                                    │
                                    ├──1:N──▶ Flock
                                    │           ├──1:N──▶ DailyRecord
                                    │           ├──1:N──▶ IncubationBatch
                                    │           ├──1:N──▶ Vaccination
                                    │           ├──1:N──▶ Sale
                                    │           ├──1:N──▶ Expense
                                    │           └──1:N──▶ Order
                                    │
                                    ├──1:N──▶ Incubator
                                    │           └──1:N──▶ IncubationBatch
                                    │
                                    ├──1:N──▶ Customer
                                    │           ├──1:N──▶ Sale
                                    │           └──1:N──▶ Order
                                    │
                                    ├──1:N──▶ Stock
                                    │           └──1:N──▶ StockMove
                                    │
                                    ├──1:N──▶ Expense
                                    │           └──1:N──▶ StockMove
                                    │
                                    ├──1:N──▶ Sale
                                    │           └──1:N──▶ SalePayment
                                    │
                                    ├──1:N──▶ Order ──1:1──▶ Sale
                                    ├──1:N──▶ Alert
                                    ├──1:N──▶ VaccinationProtocol
                                    └──1:N──▶ AuditLog
```

### 3.2 Flux de données automatiques

```
Saisie quotidienne (DailyRecord)
  ├── eggsCollected  →  Stock(EGGS).currentQty += eggsCollected
  ├── mortalityCount →  Flock.currentTotal -= mortalityCount
  └── feedConsumedKg →  Stock(LAYER_FEED).currentQty -= feedConsumedKg

Chargement couveuse (IncubationBatch)
  └── eggsLoaded     →  Stock(EGGS).currentQty -= eggsLoaded

Éclosion (IncubationBatch.chicksHatched)
  └── Possibilité de créer un nouveau Flock(BROILER) avec les poussins

Achat aliment (Expense + category=FEED)
  └── Crée un StockMove(IN_PURCHASE) → Stock.currentQty += quantity

Vente (Sale)
  └── Crée un StockMove(OUT_SALE) → Stock.currentQty -= quantity

Commande livrée (Order.status = DELIVERED)
  └── Crée automatiquement une Sale liée
```

---

## 4. Index et performances

### 4.1 Index principaux

Tous les index sont définis dans le schéma Prisma ci-dessus via `@@index`. Les plus critiques :

| Table | Index | Justification |
|-------|-------|---------------|
| DailyRecord | `[flockId, date]` | Saisie quotidienne, recherche par lot et date |
| Sale | `[teamId, date]` | Bilan financier par période |
| Sale | `[teamId, paymentStatus]` | Liste des créances |
| Expense | `[teamId, date]` | Bilan financier par période |
| IncubationBatch | `[expectedHatchDate]` | Alertes d'éclosion |
| Vaccination | `[scheduledDate, isDone]` | Alertes de vaccination |
| Alert | `[teamId, isRead]` | Badge notifications |
| StockMove | `[stockId, date]` | Historique stock |
| AuditLog | `[teamId, createdAt]` | Audit chronologique |

### 4.2 Contraintes d'unicité

| Table | Contrainte | Justification |
|-------|-----------|---------------|
| User | `phone` | Un seul compte par numéro |
| TeamMember | `[userId, teamId]` | Un membre une seule fois par équipe |
| DailyRecord | `[flockId, date]` | Une seule saisie par lot par jour |
| Stock | `[teamId, type]` | Un seul stock par type par équipe |

---

## 5. Données de seed

### 5.1 Stocks initiaux

```sql
-- Créés automatiquement à la création d'une équipe
INSERT INTO "Stock" (teamId, type, name, currentQty, unit, alertThreshold)
VALUES
  (teamId, 'LAYER_FEED', 'Aliment ponte', 0, 'kg', 50),
  (teamId, 'BROILER_FEED', 'Aliment croissance', 0, 'kg', 50),
  (teamId, 'MILLET', 'Mil', 0, 'kg', 25),
  (teamId, 'SUPPLEMENT', 'Compléments/vitamines', 0, 'unité', 2),
  (teamId, 'VACCINE', 'Vaccins', 0, 'dose', 50),
  (teamId, 'MEDICATION', 'Médicaments', 0, 'unité', 2),
  (teamId, 'EMPTY_TRAYS', 'Tablettes vides', 0, 'unité', 10),
  (teamId, 'EGGS', 'Stock œufs', 0, 'œuf', 30);
```

### 5.2 Protocoles de vaccination par défaut

```sql
-- Chair
('Newcastle', 'BROILER', 7, 'DRINKING_WATER'),
('Gumboro', 'BROILER', 14, 'DRINKING_WATER'),
('Newcastle rappel', 'BROILER', 21, 'DRINKING_WATER'),
('Gumboro rappel', 'BROILER', 28, 'DRINKING_WATER'),

-- Pondeuses / Reproducteurs
('Newcastle', 'LAYER/BREEDER', 7, 'DRINKING_WATER'),
('Gumboro', 'LAYER/BREEDER', 14, 'DRINKING_WATER'),
('Newcastle rappel', 'LAYER/BREEDER', 21, 'DRINKING_WATER'),
('Bronchite infectieuse', 'LAYER/BREEDER', 42, 'SPRAY'),
('Newcastle trimestriel', 'LAYER/BREEDER', 90, 'DRINKING_WATER'),
```

---

## 6. Synchronisation offline

### 6.1 Champs de sync

Chaque entité modifiable hors ligne possède :
- `localId` : ID généré localement (UUID) avant synchronisation
- `syncedAt` : timestamp de la dernière synchronisation

### 6.2 Stratégie de résolution de conflits

```
Client envoie ses modifications locales
  |→ Le serveur compare les timestamps
  |→ Si pas de conflit → merge
  |→ Si conflit (même entité modifiée) → last-write-wins
  |→ Le serveur notifie le client du résultat
  |→ Le client met à jour ses données locales
```

### 6.3 Tables synchronisées

| Table | Sync bidirectionnelle | Priorité |
|-------|----------------------|----------|
| DailyRecord | Oui | Haute |
| Flock | Oui | Haute |
| IncubationBatch | Oui | Haute |
| Expense | Oui | Haute |
| Sale | Oui | Haute |
| Stock | Serveur → Client (calculé serveur) | Haute |
| Customer | Oui | Moyenne |
| Order | Oui | Moyenne |
| Vaccination | Oui | Moyenne |
| Alert | Serveur → Client | Basse |
| AuditLog | Client → Serveur | Basse |
