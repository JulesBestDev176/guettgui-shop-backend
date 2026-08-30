# Guett Gui — Regles & Conventions NestJS (TypeScript)

**Stack** : NestJS 10+ / Node 20+ / TypeScript 5+ / Prisma / PostgreSQL
**Derniere MAJ** : 2026-08-30

---

## Table des matieres

1. Architecture
2. Conventions de nommage
3. Structure des fichiers
4. Modules & Injection de dependances
5. Controllers & DTOs
6. Services & Logique metier
7. Prisma & Base de donnees
8. Authentification & Autorisation
9. Securite
10. Performance & Optimisation
11. Gestion des erreurs
12. Validation
13. Tests
14. Logging & Monitoring
15. Docker & Deploiement
16. Git & CI
17. Registre des fonctionnalites

---

## 1. Architecture

### 1.1 Architecture modulaire NestJS

Chaque feature est un module NestJS autonome :

```
src/modules/<feature>/
  <feature>.module.ts       # Module NestJS
  <feature>.controller.ts   # Routes HTTP
  <feature>.service.ts      # Logique metier
  dto/                      # Data Transfer Objects
    create-<entity>.dto.ts
    update-<entity>.dto.ts
```

### 1.2 Couches

```
Controller (HTTP) → Service (Business Logic) → Prisma (Database)
     ↑                    ↑                        ↑
  Validation          Guards/Auth              Transactions
  (DTOs)              (JWT, Team, Roles)       (Prisma.$transaction)
```

### 1.3 Regles de dependance

- Controllers : NE contiennent AUCUNE logique metier — uniquement routing + validation
- Services : contiennent TOUTE la logique metier
- Un service peut injecter d'autres services (ex: DailyRecordsService injecte StocksService)
- JAMAIS d'acces direct a PrismaService dans un controller

---

## 2. Conventions de nommage

### 2.1 Fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Module | `<feature>.module.ts` | `flocks.module.ts` |
| Controller | `<feature>.controller.ts` | `flocks.controller.ts` |
| Service | `<feature>.service.ts` | `flocks.service.ts` |
| DTO | `<action>-<entity>.dto.ts` | `create-flock.dto.ts` |
| Guard | `<nom>.guard.ts` | `team-member.guard.ts` |
| Decorator | `<nom>.decorator.ts` | `current-user.decorator.ts` |
| Interceptor | `<nom>.interceptor.ts` | `audit.interceptor.ts` |
| Filter | `<nom>.filter.ts` | `http-exception.filter.ts` |
| Config | `<nom>.config.ts` | `jwt.config.ts` |
| Cron | `<feature>.cron.ts` | `alerts.cron.ts` |
| Test | `<fichier>.spec.ts` | `flocks.service.spec.ts` |

### 2.2 Code TypeScript

| Type | Convention | Exemple |
|------|-----------|---------|
| Classe | PascalCase | `FlocksService` |
| Interface | PascalCase (pas de prefixe I) | `CreateFlockPayload` |
| Type | PascalCase | `FlockWithRecords` |
| Variable / Parametre | camelCase | `eggsCollected` |
| Constante | UPPER_SNAKE_CASE | `MAX_TEAM_MEMBERS` |
| Enum Prisma | UPPER_SNAKE_CASE | `FlockType.BREEDER` |
| Methode controller | camelCase, verbe REST | `create`, `findAll`, `findOne`, `update`, `remove` |
| Methode service | camelCase, descriptif | `getActiveFlocks`, `calculateLayingRate` |
| Route REST | kebab-case, pluriel | `/teams/:teamId/daily-records` |

### 2.3 Routes API

```
Base: /v1

Format: /teams/:teamId/<resource>
        /teams/:teamId/<resource>/:id
        /teams/:teamId/<resource>/:id/<action>

Exemples:
  GET    /v1/teams/:teamId/flocks
  POST   /v1/teams/:teamId/flocks
  GET    /v1/teams/:teamId/flocks/:id
  PATCH  /v1/teams/:teamId/flocks/:id
  DELETE /v1/teams/:teamId/flocks/:id
  POST   /v1/teams/:teamId/flocks/:id/close
```

---

## 3. Structure des fichiers

```
backend/
├── src/
│   ├── main.ts                          # Bootstrap, Swagger, CORS, pipes
│   ├── app.module.ts                    # Root module
│   │
│   ├── modules/
│   │   ├── auth/                        # Authentification OTP + JWT
│   │   ├── teams/                       # Equipes + membres
│   │   ├── flocks/                      # Lots d'elevage
│   │   ├── daily-records/               # Saisie quotidienne
│   │   ├── incubation/                  # Couveuses + lots couveuse
│   │   ├── finances/                    # Depenses + ventes + paiements
│   │   ├── stocks/                      # Stocks + mouvements
│   │   ├── customers/                   # Clients
│   │   ├── orders/                      # Commandes
│   │   ├── alerts/                      # Alertes + cron
│   │   ├── vaccination/                 # Protocoles + suivi
│   │   ├── reports/                     # Rapports agreges
│   │   ├── sync/                        # Synchronisation offline
│   │   ├── upload/                      # Upload S3
│   │   └── notifications/              # FCM + Relayio
│   │
│   ├── common/
│   │   ├── decorators/                  # @CurrentUser, @CurrentTeam, @Roles
│   │   ├── guards/                      # JwtAuthGuard, TeamMemberGuard, RolesGuard
│   │   ├── filters/                     # HttpExceptionFilter
│   │   ├── interceptors/               # Transform, Logging, Audit
│   │   ├── pipes/                       # ValidationPipe custom
│   │   └── dto/                         # PaginationDto, SortDto
│   │
│   ├── config/                          # Configuration typee
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── s3.config.ts
│   │   ├── firebase.config.ts
│   │   └── relayio.config.ts
│   │
│   └── prisma/
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       ├── schema.prisma
│       ├── seed.ts
│       └── migrations/
│
├── test/                                # Tests e2e
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 4. Modules & Injection de dependances

### 4.1 Regles

- Un module par feature metier
- Chaque module exporte ses services si d'autres modules en ont besoin
- Utiliser `forwardRef()` uniquement en dernier recours (dependances circulaires)
- PrismaModule est global (`@Global()`)
- ConfigModule est global

### 4.2 Pattern

```typescript
@Module({
  imports: [StocksModule, AlertsModule],
  controllers: [DailyRecordsController],
  providers: [DailyRecordsService],
  exports: [DailyRecordsService],
})
export class DailyRecordsModule {}
```

---

## 5. Controllers & DTOs

### 5.1 Regles controllers

- UN controller par resource REST
- Methodes standards : `create`, `findAll`, `findOne`, `update`, `remove`
- Toujours typer le retour
- Decorateurs de route dans cet ordre : `@HttpCode`, `@Roles`, `@ApiOperation`
- Le controller ne fait QUE : extraire les params, appeler le service, retourner

```typescript
@Controller('teams/:teamId/flocks')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Flocks')
export class FlocksController {
  constructor(private readonly flocksService: FlocksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('teamId') teamId: string,
    @Body() dto: CreateFlockDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.flocksService.create(teamId, dto, userId);
  }

  @Get()
  findAll(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('type') type?: FlockType,
    @Query('status') status?: FlockStatus,
  ) {
    return this.flocksService.findAll(teamId, { pagination, type, status });
  }
}
```

### 5.2 Regles DTOs

- Utiliser `class-validator` pour la validation
- Utiliser `class-transformer` pour la transformation
- Toujours valider : types, ranges, longueurs, formats
- DTO separes pour create et update (`PartialType` pour update)
- Documenter avec `@ApiProperty` pour Swagger

```typescript
export class CreateFlockDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Goliath - Noyau 1' })
  name: string;

  @IsEnum(FlockType)
  @ApiProperty({ enum: FlockType })
  type: FlockType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  breed?: string;

  @IsDateString()
  startDate: string;

  @IsInt()
  @Min(0)
  initialMales: number;

  @IsInt()
  @Min(0)
  initialFemales: number;
}

export class UpdateFlockDto extends PartialType(CreateFlockDto) {}
```

---

## 6. Services & Logique metier

### 6.1 Regles

- TOUTE la logique metier est dans les services
- Utiliser `$transaction` pour les operations multi-tables
- Toujours filtrer par `teamId` (isolation des donnees)
- Toujours exclure `deletedAt IS NOT NULL` (soft delete)
- Retourner des objets structures, pas des entites Prisma brutes quand necessaire

### 6.2 Pattern service

```typescript
@Injectable()
export class FlocksService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, dto: CreateFlockDto, userId: string) {
    const total = dto.initialMales + dto.initialFemales + (dto.initialTotal || 0);

    return this.prisma.flock.create({
      data: {
        teamId,
        ...dto,
        initialTotal: total,
        currentMales: dto.initialMales,
        currentFemales: dto.initialFemales,
        currentTotal: total,
      },
    });
  }

  async findAll(teamId: string, filters: FlockFilters) {
    const where: Prisma.FlockWhereInput = {
      teamId,
      deletedAt: null,
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.flock.findMany({
        where,
        skip: filters.pagination.skip,
        take: filters.pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.flock.count({ where }),
    ]);

    return { data, meta: { total, ...filters.pagination } };
  }
}
```

### 6.3 Transactions

```typescript
// Saisie quotidienne = transaction multi-tables
async createDailyRecord(teamId: string, dto: CreateDailyRecordDto, userId: string) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Creer le record
    const record = await tx.dailyRecord.create({ data: { ... } });

    // 2. MAJ effectif lot si mortalite
    if (dto.mortalityCount > 0) {
      await tx.flock.update({
        where: { id: dto.flockId },
        data: { currentTotal: { decrement: dto.mortalityCount } },
      });
    }

    // 3. MAJ stock oeufs
    if (dto.eggsCollected) {
      await this.stocksService.addMoveTx(tx, teamId, 'EGGS', 'IN_PRODUCTION', dto.eggsCollected);
    }

    return record;
  });
}
```

---

## 7. Prisma & Base de donnees

### 7.1 Regles

- Schema Prisma = source de verite du modele de donnees
- Migrations versionnees (`prisma migrate dev`)
- JAMAIS de raw SQL sauf pour les requetes analytiques complexes
- Soft delete sur toutes les entites metier (`deletedAt DateTime?`)
- Audit trail via AuditInterceptor (pas dans chaque service)

### 7.2 Conventions schema

```prisma
model Flock {
  id        String   @id @default(cuid())  // CUID partout
  teamId    String                          // FK equipe obligatoire
  // ... champs metier ...
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?                       // Soft delete

  team Team @relation(fields: [teamId], references: [id])

  @@index([teamId, status])                 // Index sur les filtres frequents
}
```

### 7.3 Seed

- Seed pour les donnees de reference (protocoles vaccination, stocks initiaux)
- Seed pour les donnees de dev (equipe demo, lots demo)
- Commande : `npx prisma db seed`

### 7.4 Migrations

- Nommer les migrations de facon descriptive : `npx prisma migrate dev --name add_vaccination_protocol`
- Tester les migrations sur une copie avant prod
- JAMAIS de `prisma migrate reset` en prod

---

## 8. Authentification & Autorisation

### 8.1 Auth flow

1. `POST /auth/send-otp` — envoie OTP 6 chiffres via Relayio
2. `POST /auth/verify-otp` — verifie, retourne JWT + refresh token
3. `POST /auth/refresh` — rotation du refresh token
4. `POST /auth/logout` — revoque le refresh token

### 8.2 Guards (3 couches)

```
Requete HTTP
  → JwtAuthGuard      : verifie le JWT, extrait userId
  → TeamMemberGuard   : verifie que userId est membre du teamId
  → RolesGuard        : verifie le role (OWNER/MEMBER) si @Roles() present
```

### 8.3 Regles

- JWT access token : 1h de validite
- Refresh token : 30j, stocke en BDD, rotation a chaque usage
- Rate limit OTP : 5 tentatives / 15 min par numero
- OTP : 6 chiffres, 5 min de validite, usage unique
- Le `RolesGuard` n'est NECESSAIRE que sur les routes de gestion des membres

### 8.4 Decorateurs custom

```typescript
@CurrentUser()         // Extrait l'utilisateur du JWT
@CurrentUser('userId') // Extrait un champ specifique
@CurrentTeam()         // Extrait le teamMember du guard
@Roles(TeamRole.OWNER) // Requiert le role OWNER
```

---

## 9. Securite

### 9.1 Headers & CORS

- `helmet` active (CSP, X-Frame-Options, etc.)
- CORS : whitelist stricte des origines
- `X-Request-Id` sur chaque requete (tracing)

### 9.2 Rate Limiting

| Route | Limite | Fenetre |
|-------|--------|---------|
| `/auth/send-otp` | 5 requetes | 15 minutes |
| `/auth/verify-otp` | 10 requetes | 15 minutes |
| Global | 100 requetes | 1 minute |
| Upload | 10 requetes | 1 minute |

### 9.3 Injection

- Prisma ORM = requetes parametrees (protection SQL injection)
- `class-validator` sur tous les DTOs (protection injection)
- `class-transformer` avec `whitelist: true` (ignore les champs non declares)
- Sanitisation des champs texte libre (`sanitize-html` si necessaire)

### 9.4 Donnees

- Isolation par equipe : TOUTES les requetes filtrent par `teamId`
- Soft delete : aucune donnee reellement supprimee
- Audit trail : toutes les mutations journalisees
- Mots de passe : aucun — authentification OTP uniquement
- Secrets : variables d'environnement, JAMAIS dans le code

### 9.5 Upload

- Validation MIME type (images uniquement pour les photos)
- Taille max : 5 MB par fichier
- Nommage : CUID + extension originale (pas de nom utilisateur)
- Stockage : MinIO (S3 compatible), pas sur le serveur local

---

## 10. Performance & Optimisation

### 10.1 Requetes BDD

- Pagination sur toutes les listes (`skip` + `take`)
- `select` pour ne recuperer que les champs necessaires (pas de `SELECT *`)
- `include` avec parcimonie — pas de nested includes profonds
- Index Prisma sur les colonnes filtrees/triees
- `Promise.all` pour les requetes independantes
- Eviter les N+1 queries — utiliser `include` ou `findMany` avec `where: { id: { in: ids } }`

### 10.2 Caching

- Cache en memoire pour les donnees rarement modifiees (protocoles vaccination)
- `@nestjs/cache-manager` si necessaire en V2
- ETags sur les reponses GET (V2)

### 10.3 Payload

- Format de reponse `{ data, meta }` standardise
- Ne pas renvoyer les champs internes (`deletedAt`, `syncedAt`)
- Compression gzip active (`compression` middleware)
- Pagination par defaut : 20 items, max 100

### 10.4 Async

- Toutes les operations I/O sont async
- `Promise.all` pour les operations paralleles
- Background jobs pour les operations longues (envoi WhatsApp, recalcul stocks)
- JAMAIS de `await` dans une boucle — batch les operations

```typescript
// MAUVAIS
for (const member of members) {
  await this.notificationsService.send(member.id, alert);
}

// BON
await Promise.all(
  members.map((m) => this.notificationsService.send(m.id, alert)),
);
```

---

## 11. Gestion des erreurs

### 11.1 Exceptions HTTP

- Utiliser les exceptions NestJS built-in :
  - `BadRequestException` (400) — validation echouee
  - `UnauthorizedException` (401) — pas de token / token invalide
  - `ForbiddenException` (403) — pas les droits
  - `NotFoundException` (404) — ressource introuvable
  - `ConflictException` (409) — doublon (saisie deja existante)
  - `InternalServerErrorException` (500) — erreur serveur

### 11.2 Format d'erreur standardise

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Lot introuvable",
  "timestamp": "2026-08-30T12:00:00Z",
  "path": "/v1/teams/xxx/flocks/yyy"
}
```

### 11.3 Regles

- JAMAIS de `try/catch` qui avale l'erreur silencieusement
- Logger les erreurs 500 avec le stack trace complet
- Messages d'erreur en francais pour le client (l'app les affiche)
- Details techniques uniquement dans les logs serveur
- Le HttpExceptionFilter globalise le format d'erreur

---

## 12. Validation

### 12.1 Pipeline global

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Supprime les champs non declares dans le DTO
    forbidNonWhitelisted: true,// Erreur si champ inconnu envoye
    transform: true,           // Transforme les types (string → number, etc.)
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### 12.2 Regles

- TOUS les endpoints POST/PATCH/PUT ont un DTO valide
- Validation metier dans le service (unicite, existence, coherence)
- Validation format dans le DTO (`@IsInt`, `@Min`, `@MaxLength`, etc.)
- Pas de validation metier dans le DTO

---

## 13. Tests

### 13.1 Structure

```
src/modules/<feature>/
  <feature>.service.spec.ts    # Tests unitaires du service
  <feature>.controller.spec.ts # Tests unitaires du controller

test/
  <feature>.e2e-spec.ts        # Tests e2e (HTTP)
```

### 13.2 Regles

- Tests unitaires : mocker PrismaService et les services dependants
- Tests e2e : base PostgreSQL de test, seed avant chaque suite
- Nommage : `should <expected> when <condition>`
- Coverage cible : 80% sur les services

### 13.3 Pattern

```typescript
describe('FlocksService', () => {
  let service: FlocksService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlocksService,
        { provide: PrismaService, useValue: mockDeep<PrismaClient>() },
      ],
    }).compile();

    service = module.get(FlocksService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a flock with calculated total', async () => {
      prisma.flock.create.mockResolvedValue(mockFlock);
      const result = await service.create('team1', createDto, 'user1');
      expect(result).toEqual(mockFlock);
      expect(prisma.flock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ teamId: 'team1' }),
        }),
      );
    });
  });
});
```

---

## 14. Logging & Monitoring

### 14.1 Logging

- Logger NestJS built-in pour les logs applicatifs
- Format structure JSON en production
- Niveaux : `error`, `warn`, `log`, `debug`, `verbose`
- `LoggingInterceptor` sur chaque requete (methode, route, duree, status)
- PAS de donnees sensibles dans les logs (tokens, mots de passe, OTP)

### 14.2 Health check

```typescript
// GET /health
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

### 14.3 Swagger

- Active en dev et staging, desactive en prod
- Decorateurs `@ApiTags`, `@ApiOperation`, `@ApiResponse` sur chaque route
- URL : `/api/docs`

---

## 15. Docker & Deploiement

### 15.1 Dockerfile multi-stage

```dockerfile
# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json prisma/ ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 15.2 Variables d'environnement

- `.env.example` versionne avec les cles (sans valeurs)
- `.env` JAMAIS versionne (`.gitignore`)
- Validation des env vars au demarrage (`@nestjs/config` + Joi)

### 15.3 Docker Compose (dev)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: guettgui_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: guettgui_db
      POSTGRES_USER: guettgui
      POSTGRES_PASSWORD: guettgui
    ports:
      - '5434:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U guettgui -d guettgui_db']
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: guettgui_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: guettgui
      MINIO_ROOT_PASSWORD: guettgui123
    ports:
      - '9002:9000'   # API S3
      - '9003:9001'   # Console web
    volumes:
      - minio_data:/data
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 20s
      retries: 3

  api:
    build: ./backend
    container_name: guettgui_api
    restart: unless-stopped
    ports:
      - '3002:3000'
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://guettgui:guettgui@postgres:5432/guettgui_db?schema=public
      STORAGE_ENDPOINT: http://minio:9000
      STORAGE_ACCESS_KEY: guettgui
      STORAGE_SECRET_KEY: guettgui123
      STORAGE_BUCKET_NAME: guettgui
      STORAGE_PUBLIC_URL: http://localhost:9002
      NODE_ENV: development
      PORT: 3000

volumes:
  postgres_data:
  minio_data:
```

### 15.4 Stockage fichiers : MinIO (S3-compatible)

**PAS de Hetzner S3. On utilise MinIO en local et en prod.**

Pattern a suivre (inspire du projet minifoot `C:\Users\HP\Documents\Informatique\electron\minifoot\apps\backend\src\shared\storage\`) :
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- `sharp` pour la compression/conversion images en WebP
- Module `StorageModule` global avec `StorageService`
- Auto-creation des buckets en dev, verification seule en prod
- Proxy controller pour servir les fichiers via l'API (`/api/v1/storage/:bucket/*`)
- URLs reecrites pour pointer vers le proxy API (pas vers MinIO directement)

Buckets Guett Gui :
- `avatars` — photos de profil utilisateurs
- `teams` — logos d'elevage
- `flocks` — photos de lots
- `daily-records` — photos saisie quotidienne
- `expenses` — justificatifs depenses

Variables d'environnement stockage :
```env
STORAGE_ENDPOINT=http://minio:9000
STORAGE_ACCESS_KEY=guettgui
STORAGE_SECRET_KEY=guettgui123
STORAGE_BUCKET_NAME=guettgui
STORAGE_PUBLIC_URL=http://localhost:9002
STORAGE_FORCE_PATH_STYLE=true
```

---

## 16. Git & CI

### 16.1 Commits

- Meme convention que Flutter (voir FLUTTER_RULES.md section 14)
- Format : `type(scope): description`

### 16.2 Pre-commit

- `eslint --fix`
- `prettier --write`
- `tsc --noEmit` (type check)

### 16.3 CI pipeline

1. Install dependencies
2. Lint (`eslint`)
3. Type check (`tsc --noEmit`)
4. Tests unitaires (`jest`)
5. Tests e2e (`jest --config jest-e2e.json`)
6. Build (`npm run build`)
7. Docker build

---

## 17. Registre des fonctionnalites

> **OBLIGATOIRE** : Avant de coder une fonctionnalite, verifier ici si elle existe deja.
> Apres implementation, ajouter une entree.

### Modules implementes

| Module | Fichiers | Endpoints | Description |
|--------|----------|-----------|-------------|
| Auth | `modules/auth/` | POST /auth/send-otp, POST /auth/verify-otp, POST /auth/refresh, POST /auth/logout | Authentification OTP + JWT |
| Teams | `modules/teams/` | POST /teams, GET /teams/:id, PATCH /teams/:id, POST /teams/join, GET /teams/:id/members, DELETE /teams/:id/members/:id, POST /teams/:id/regenerate-invite | Gestion equipes + membres |
| Flocks | `modules/flocks/` | POST, GET, GET/:id, PATCH/:id, POST/:id/close, DELETE/:id (sous /teams/:teamId/flocks) | CRUD lots d'elevage |
| DailyRecords | `modules/daily-records/` | POST, GET, PATCH/:id (sous /teams/:teamId/daily-records) | Saisie quotidienne |
| Incubation | `modules/incubation/` | POST/GET incubators, POST/GET incubation-batches, PATCH candling-1, candling-2, hatch | Couveuses + lots couveuse |
| Finances | `modules/finances/` | POST/GET/DELETE expenses, POST/GET/DELETE sales, POST sales/:id/payments, GET finances/summary | Depenses, ventes, paiements, bilan |
| Stocks | `modules/stocks/` | GET stocks, GET stocks/:id/moves, POST stocks/:id/adjust | Gestion des stocks + mouvements |
| Customers | `modules/customers/` | POST, GET, GET/:id, PATCH/:id, DELETE/:id (sous /teams/:teamId/customers) | CRUD clients |
| Orders | `modules/orders/` | POST, GET, PATCH/:id/status (sous /teams/:teamId/orders) | CRUD commandes, livraison auto |
| Alerts | `modules/alerts/` | GET, PATCH/:id/read, PATCH/:id/dismiss (sous /teams/:teamId/alerts) | Alertes + cron 12 types |
| Vaccination | `modules/vaccination/` | POST/GET/DELETE vaccination-protocols, GET vaccinations, PATCH vaccinations/:id/done | Protocoles + suivi vaccins |
| Reports | `modules/reports/` | GET daily, GET weekly, GET monthly, GET flock/:flockId | Rapports agreges |
| Sync | `modules/sync/` | POST /sync/push, GET /sync/pull, WebSocket /sync | Synchronisation offline |
| Upload | `modules/upload/` | POST /upload, DELETE /upload/:key | Upload fichiers via StorageService |
| Storage | `shared/storage/` | GET /storage/:bucket/* | Proxy MinIO, serve fichiers via API |
| Notifications | `modules/notifications/` | (service interne) | FCM + Relayio (mock en dev) |

### Guards & Interceptors

| Nom | Fichier | Description |
|-----|---------|-------------|
| JwtAuthGuard | `common/guards/jwt-auth.guard.ts` | Verifie le JWT, extrait userId |
| TeamMemberGuard | `common/guards/team-member.guard.ts` | Verifie l'appartenance a l'equipe |
| RolesGuard | `common/guards/roles.guard.ts` | Verifie le role (OWNER/MEMBER) |
| TransformInterceptor | `common/interceptors/transform.interceptor.ts` | Format { data, meta } |
| LoggingInterceptor | `common/interceptors/logging.interceptor.ts` | Log methode, route, duree, status |
| AuditInterceptor | `common/interceptors/audit.interceptor.ts` | Journalise les mutations POST/PATCH/PUT/DELETE |

### Services partages

| Service | Fichier | Methodes principales | Description |
|---------|---------|---------------------|-------------|
| PrismaService | `prisma/prisma.service.ts` | extends PrismaClient | Client BDD global |
| StocksService | `modules/stocks/stocks.service.ts` | findAll, getMoves, adjust, addMoveTx | Gestion stocks + mouvements transactionnels |
| AlertsService | `modules/alerts/alerts.service.ts` | checkLowStock, checkCandlingDue, checkHatchDue, checkVaccinationDue, checkHighMortality, checkLowLayingRate, checkOldDebts, checkMissingRecords, checkSlaughterDue, checkOrdersDue | Generation des 12 types d'alertes |
| NotificationsService | `modules/notifications/notifications.service.ts` | sendAlert | Envoi push (FCM) + WhatsApp (Relayio) |
| FcmService | `modules/notifications/fcm.service.ts` | send, sendToMultiple | Push notifications Firebase |
| RelayioService | `modules/notifications/relayio.service.ts` | sendOtp, sendNotification | SMS/WhatsApp via Relayio |
| StorageService | `shared/storage/storage.service.ts` | upload, uploadImage, uploadAvatar, uploadTeamLogo, uploadFlockPhoto, uploadDailyRecordPhoto, uploadExpenseReceipt, getObject, delete, getSignedUrl, rewriteForClient, buildPublicUrl | Stockage S3/MinIO, resize WebP, proxy URLs |
| StorageController | `shared/storage/storage.controller.ts` | GET /storage/:bucket/* | Proxy fichiers MinIO via API |
| UploadService | `modules/upload/upload.service.ts` | upload, remove | Upload/suppression fichiers via StorageService |
| SyncGateway | `modules/sync/sync.gateway.ts` | notifyTeam | WebSocket sync temps reel |

### DTOs

| DTO | Fichier | Utilise par | Description |
|-----|---------|-------------|-------------|
| PaginationDto | `common/dto/pagination.dto.ts` | Tous les controllers | Pagination, tri, page/limit |
| SendOtpDto | `modules/auth/dto/send-otp.dto.ts` | AuthController | Envoi OTP (phone) |
| VerifyOtpDto | `modules/auth/dto/verify-otp.dto.ts` | AuthController | Verification OTP (phone + code) |
| RefreshTokenDto | `modules/auth/dto/refresh-token.dto.ts` | AuthController | Rotation refresh token |
| CreateTeamDto | `modules/teams/dto/create-team.dto.ts` | TeamsController | Creation equipe |
| UpdateTeamDto | `modules/teams/dto/update-team.dto.ts` | TeamsController | Modification equipe |
| JoinTeamDto | `modules/teams/dto/join-team.dto.ts` | TeamsController | Rejoindre equipe via code |
| CreateFlockDto | `modules/flocks/dto/create-flock.dto.ts` | FlocksController | Creation lot |
| UpdateFlockDto | `modules/flocks/dto/update-flock.dto.ts` | FlocksController | Modification lot |
| CloseFlockDto | `modules/flocks/dto/close-flock.dto.ts` | FlocksController | Cloture lot |
| CreateDailyRecordDto | `modules/daily-records/dto/create-daily-record.dto.ts` | DailyRecordsController | Saisie quotidienne |
| UpdateDailyRecordDto | `modules/daily-records/dto/update-daily-record.dto.ts` | DailyRecordsController | Correction saisie |
| CreateIncubatorDto | `modules/incubation/dto/create-incubator.dto.ts` | IncubationController | Ajout couveuse |
| CreateBatchDto | `modules/incubation/dto/create-batch.dto.ts` | IncubationController | Creation lot couveuse |
| Candling1Dto | `modules/incubation/dto/candling.dto.ts` | IncubationController | Saisie mirage J7 |
| Candling2Dto | `modules/incubation/dto/candling.dto.ts` | IncubationController | Saisie mirage J14 |
| HatchResultDto | `modules/incubation/dto/hatch-result.dto.ts` | IncubationController | Saisie eclosion |
| CreateExpenseDto | `modules/finances/dto/create-expense.dto.ts` | FinancesController | Creation depense |
| CreateSaleDto | `modules/finances/dto/create-sale.dto.ts` | FinancesController | Creation vente |
| CreateSalePaymentDto | `modules/finances/dto/create-sale-payment.dto.ts` | FinancesController | Paiement partiel |
| AdjustStockDto | `modules/stocks/dto/adjust-stock.dto.ts` | StocksController | Correction manuelle stock |
| CreateCustomerDto | `modules/customers/dto/create-customer.dto.ts` | CustomersController | Creation client |
| UpdateCustomerDto | `modules/customers/dto/update-customer.dto.ts` | CustomersController | Modification client |
| CreateOrderDto | `modules/orders/dto/create-order.dto.ts` | OrdersController | Creation commande |
| UpdateOrderStatusDto | `modules/orders/dto/update-order-status.dto.ts` | OrdersController | Changement statut commande |
| CreateProtocolDto | `modules/vaccination/dto/create-protocol.dto.ts` | VaccinationController | Creation protocole vaccin |
| MarkDoneDto | `modules/vaccination/dto/mark-done.dto.ts` | VaccinationController | Marquer vaccination faite |

### Cron jobs

| Job | Fichier | Schedule | Description |
|-----|---------|----------|-------------|
| generateAlerts | `modules/alerts/alerts.cron.ts` | Toutes les heures | Genere les 10 types d'alertes pour toutes les equipes |
| autoArchiveFlocks | `modules/alerts/alerts.cron.ts` | Dimanche 3h | Archive les lots termines depuis > 90 jours |

### Middleware / Pipes / Filters

| Nom | Fichier | Description |
|-----|---------|-------------|
| HttpExceptionFilter | `common/filters/http-exception.filter.ts` | Format d'erreur standardise JSON |
| ValidationPipe | `main.ts` (global) | Validation DTO avec whitelist + transform |
| @CurrentUser | `common/decorators/current-user.decorator.ts` | Extrait l'utilisateur du JWT |
| @CurrentTeam | `common/decorators/current-team.decorator.ts` | Extrait le teamMember du guard |
| @Roles | `common/decorators/roles.decorator.ts` | Decorateur de role requis |

---

*Ce document est vivant. Chaque nouveau developpement doit mettre a jour le registre des fonctionnalites.*
