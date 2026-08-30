# SenGuett — Architecture Technique

**Version** : 1.0
**Date** : 2026-08-21
**Statut** : En attente de validation

---

## Table des matieres

1. Vue d'ensemble
2. Architecture Backend (NestJS)
3. Architecture Frontend (Flutter)
4. Authentification
5. Architecture Offline Sync (section critique)
6. API Design
7. Moteur d'alertes
8. Stockage de fichiers
9. Deploiement
10. Securite

---

## 1. Vue d'ensemble

```
┌────────────────────────────────────────────────────────────────────┐
│                         APP FLUTTER                                │
│                       (Android + iOS)                              │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Presentation │  │   Domain     │  │   Data                   │ │
│  │  (Riverpod)  │  │  (Entities)  │  │  (Drift + API Client)    │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    SYNC ENGINE                                 ││
│  │  Queue locale → Conflict resolution → Push/Pull serveur       ││
│  └────────────────────────────────────────────────────────────────┘│
│                           │                                        │
│                     Drift (SQLite)                                  │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                   HTTPS / REST + WebSocket
                            │
┌───────────────────────────┼────────────────────────────────────────┐
│                    BACKEND NestJS                                   │
│                                                                    │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Auth  │ │ Teams  │ │  Flocks  │ │  Daily   │ │ Incubation │  │
│  │ Module │ │ Module │ │  Module  │ │ Records  │ │   Module   │  │
│  └────────┘ └────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Finance │ │ Stocks │ │Customers │ │  Orders  │ │   Alerts   │  │
│  │ Module │ │ Module │ │  Module  │ │  Module  │ │   Module   │  │
│  └────────┘ └────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐                 │
│  │Vaccin. │ │Reports │ │  Sync    │ │  Upload  │                 │
│  │ Module │ │ Module │ │  Module  │ │  Module  │                 │
│  └────────┘ └────────┘ └──────────┘ └──────────┘                 │
│                                                                    │
│                         Prisma ORM                                 │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────────┐
         ▼                 ▼                      ▼
┌─────────────┐   ┌─────────────────┐   ┌──────────────────┐
│ PostgreSQL  │   │  Hetzner Object │   │ Services externes│
│  (Prisma)   │   │  Storage (S3)   │   │                  │
│             │   │  Photos, docs   │   │ ┌──────────────┐ │
└─────────────┘   └─────────────────┘   │ │   Relayio    │ │
                                        │ │ (OTP + WhatsApp│ │
                                        │ └──────────────┘ │
                                        │ ┌──────────────┐ │
                                        │ │     FCM      │ │
                                        │ │ (Push notifs)│ │
                                        │ └──────────────┘ │
                                        └──────────────────┘
```

### Principes directeurs

| Principe | Mise en oeuvre |
|----------|---------------|
| Offline-first | Toutes les donnees stockees localement (Drift/SQLite), synchronisees en arriere-plan |
| Team-scoped | Chaque donnee appartient a une equipe, isolation stricte |
| Clean Architecture | Separation presentation / domain / data cote Flutter |
| Modulaire | Un module NestJS par feature, independants |
| Audit complet | Chaque modification est historisee (AuditLog) |

---

## 2. Architecture Backend (NestJS)

### 2.1 Structure des modules

```
backend/
├── src/
│   ├── main.ts                          # Bootstrap, Swagger, CORS, validation
│   ├── app.module.ts                    # Root module
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── send-otp.dto.ts
│   │   │   │   └── verify-otp.dto.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-refresh.strategy.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       ├── team-member.guard.ts    # Verifie l'appartenance a l'equipe
│   │   │       └── roles.guard.ts          # Verifie le role (OWNER ou MEMBER)
│   │   │
│   │   ├── teams/
│   │   │   ├── teams.module.ts
│   │   │   ├── teams.controller.ts
│   │   │   ├── teams.service.ts
│   │   │   └── dto/
│   │   │       ├── create-team.dto.ts
│   │   │       ├── update-team.dto.ts
│   │   │       ├── invite-member.dto.ts
│   │   │       └── join-team.dto.ts
│   │   │
│   │   ├── flocks/
│   │   │   ├── flocks.module.ts
│   │   │   ├── flocks.controller.ts
│   │   │   ├── flocks.service.ts
│   │   │   └── dto/
│   │   │       ├── create-flock.dto.ts
│   │   │       ├── update-flock.dto.ts
│   │   │       └── close-flock.dto.ts
│   │   │
│   │   ├── daily-records/
│   │   │   ├── daily-records.module.ts
│   │   │   ├── daily-records.controller.ts
│   │   │   ├── daily-records.service.ts
│   │   │   └── dto/
│   │   │       └── create-daily-record.dto.ts
│   │   │
│   │   ├── incubation/
│   │   │   ├── incubation.module.ts
│   │   │   ├── incubation.controller.ts
│   │   │   ├── incubation.service.ts
│   │   │   ├── incubators.controller.ts
│   │   │   ├── incubators.service.ts
│   │   │   └── dto/
│   │   │       ├── create-batch.dto.ts
│   │   │       ├── candling.dto.ts
│   │   │       └── hatch-result.dto.ts
│   │   │
│   │   ├── finances/
│   │   │   ├── finances.module.ts
│   │   │   ├── expenses.controller.ts
│   │   │   ├── expenses.service.ts
│   │   │   ├── sales.controller.ts
│   │   │   ├── sales.service.ts
│   │   │   ├── sale-payments.controller.ts
│   │   │   ├── sale-payments.service.ts
│   │   │   └── dto/
│   │   │       ├── create-expense.dto.ts
│   │   │       ├── create-sale.dto.ts
│   │   │       └── create-sale-payment.dto.ts
│   │   │
│   │   ├── stocks/
│   │   │   ├── stocks.module.ts
│   │   │   ├── stocks.controller.ts
│   │   │   ├── stocks.service.ts
│   │   │   └── dto/
│   │   │       ├── adjust-stock.dto.ts
│   │   │       └── stock-move.dto.ts
│   │   │
│   │   ├── customers/
│   │   │   ├── customers.module.ts
│   │   │   ├── customers.controller.ts
│   │   │   ├── customers.service.ts
│   │   │   └── dto/
│   │   │       └── create-customer.dto.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   │       ├── create-order.dto.ts
│   │   │       └── update-order-status.dto.ts
│   │   │
│   │   ├── alerts/
│   │   │   ├── alerts.module.ts
│   │   │   ├── alerts.controller.ts
│   │   │   ├── alerts.service.ts
│   │   │   └── alerts.cron.ts              # Cron job generation d'alertes
│   │   │
│   │   ├── vaccination/
│   │   │   ├── vaccination.module.ts
│   │   │   ├── vaccination.controller.ts
│   │   │   ├── vaccination.service.ts
│   │   │   └── dto/
│   │   │       ├── create-protocol.dto.ts
│   │   │       └── mark-done.dto.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   └── reports.service.ts          # Calculs agrégés (bilans, stats)
│   │   │
│   │   ├── sync/
│   │   │   ├── sync.module.ts
│   │   │   ├── sync.controller.ts
│   │   │   ├── sync.service.ts
│   │   │   └── sync.gateway.ts             # WebSocket pour sync temps reel
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.module.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── upload.service.ts           # Hetzner Object Storage (S3)
│   │   │
│   │   └── notifications/
│   │       ├── notifications.module.ts
│   │       ├── notifications.service.ts
│   │       ├── fcm.service.ts
│   │       └── relayio.service.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── current-team.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── team-member.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── audit.interceptor.ts        # Journalisation automatique
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── s3.config.ts                    # Hetzner Object Storage
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
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

### 2.2 Pattern de service (exemple DailyRecords)

```typescript
@Injectable()
export class DailyRecordsService {
  constructor(
    private prisma: PrismaService,
    private stocksService: StocksService,
    private alertsService: AlertsService,
  ) {}

  async create(teamId: string, dto: CreateDailyRecordDto, userId: string) {
    // 1. Verifier que le lot appartient a l'equipe
    const flock = await this.prisma.flock.findFirst({
      where: { id: dto.flockId, teamId, status: 'ACTIVE' },
    });
    if (!flock) throw new NotFoundException('Lot introuvable');

    // 2. Verifier qu'il n'y a pas deja une saisie pour ce jour
    const existing = await this.prisma.dailyRecord.findUnique({
      where: { flockId_date: { flockId: dto.flockId, date: dto.date } },
    });
    if (existing) throw new ConflictException('Saisie deja existante pour ce jour');

    // 3. Creer en transaction (saisie + MAJ stock + MAJ effectif)
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.dailyRecord.create({
        data: {
          ...dto,
          recordedById: userId,
        },
      });

      // 4. Decrementer effectif si mortalite
      if (dto.mortalityCount > 0) {
        await tx.flock.update({
          where: { id: dto.flockId },
          data: { currentTotal: { decrement: dto.mortalityCount } },
        });
      }

      // 5. MAJ stock oeufs (entree) et aliment (sortie)
      if (dto.eggsCollected) {
        await this.stocksService.addMove(tx, teamId, 'EGGS', 'IN_PRODUCTION', dto.eggsCollected);
      }
      if (dto.feedConsumedKg) {
        const feedType = flock.type === 'BROILER' ? 'BROILER_FEED' : 'LAYER_FEED';
        await this.stocksService.addMove(tx, teamId, feedType, 'OUT_CONSUMPTION', -dto.feedConsumedKg);
      }

      // 6. Verifier alertes (mortalite anormale, stock bas)
      await this.alertsService.checkAfterDailyRecord(tx, teamId, flock, record);

      return record;
    });
  }
}
```

### 2.3 Guards : systeme de securite en couches

```typescript
// ─── Guard 1 : JWT Auth ─────────────────────────────────────────
// Verifie que le token JWT est valide et extrait l'utilisateur
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// ─── Guard 2 : Team Membership ──────────────────────────────────
// Verifie que l'utilisateur est membre de l'equipe ciblee
@Injectable()
export class TeamMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const teamId = request.params.teamId || request.body.teamId;

    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!member || member.removedAt) throw new ForbiddenException();
    request.teamMember = member; // Attache le role au request
    return true;
  }
}

// ─── Guard 3 : Roles ────────────────────────────────────────────
// Verifie que le role du membre est suffisant
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<TeamRole[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    return requiredRoles.includes(request.teamMember.role);
  }
}

// ─── Usage sur un controller ─────────────────────────────────────
// Seuls 2 rôles : OWNER et MEMBER
// MEMBER a accès à tout sauf la gestion des membres de l'équipe
@Controller('teams/:teamId/flocks')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
export class FlocksController {
  @Post()
  // Pas besoin de @Roles — tous les membres peuvent créer un lot
  create(@Param('teamId') teamId: string, @Body() dto: CreateFlockDto) { ... }

  @Get()
  findAll(@Param('teamId') teamId: string) { ... }

  @Delete(':id')
  // Tous les membres peuvent supprimer — le propriétaire gère uniquement les users
  remove(@Param('teamId') teamId: string, @Param('id') id: string) { ... }
}

// ─── Le RolesGuard n'est nécessaire que pour les routes team members ───
@Controller('teams/:teamId/members')
@UseGuards(JwtAuthGuard, TeamMemberGuard, RolesGuard)
export class TeamMembersController {
  @Post('invite')
  @Roles(TeamRole.OWNER)  // Seul le propriétaire peut inviter
  invite(@Body() dto: InviteMemberDto) { ... }

  @Delete(':id')
  @Roles(TeamRole.OWNER)  // Seul le propriétaire peut retirer
  remove(@Param('id') id: string) { ... }
}
```

### 2.4 Middleware et interceptors

| Couche | Role |
|--------|------|
| Rate Limiting | `@nestjs/throttler` — 5 req/15min sur `/auth/send-otp`, 100 req/min global |
| Validation | `class-validator` + `ValidationPipe` global sur tous les DTOs |
| Transform | Interceptor qui standardise le format de reponse `{ data, meta }` |
| Logging | Interceptor qui logue chaque requete (methode, route, duree, statut) |
| Audit | Interceptor qui enregistre les mutations (POST/PUT/PATCH/DELETE) dans `AuditLog` |
| Error Filter | Filtre global qui standardise les erreurs HTTP |
| Helmet | Headers de securite |
| CORS | Whitelist des origines |

### 2.5 WebSocket pour sync temps reel

```typescript
@WebSocketGateway({ namespace: '/sync', cors: true })
export class SyncGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    // Authentifier via JWT dans les headers
    const user = await this.authService.verifyToken(client.handshake.auth.token);
    // Rejoindre la room de l'equipe
    const member = await this.prisma.teamMember.findFirst({
      where: { userId: user.id, removedAt: null },
    });
    client.join(`team:${member.teamId}`);
  }

  // Notifier les autres membres d'une modification
  notifyTeam(teamId: string, event: string, data: any) {
    this.server.to(`team:${teamId}`).emit(event, data);
  }
}

// Evenements WebSocket :
// 'sync:daily-record'  → Nouvelle saisie quotidienne
// 'sync:flock-update'  → Modification d'un lot
// 'sync:sale-created'  → Nouvelle vente
// 'sync:stock-update'  → MAJ stock
// 'sync:alert'         → Nouvelle alerte
// 'sync:member-joined' → Nouveau membre dans l'equipe
```

### 2.6 Cron jobs

```typescript
@Injectable()
export class AlertsCronService {
  constructor(private prisma: PrismaService, private alertsService: AlertsService) {}

  // Toutes les heures : generer les alertes
  @Cron(CronExpression.EVERY_HOUR)
  async generateAlerts() {
    const teams = await this.prisma.team.findMany({ where: { deletedAt: null } });
    for (const team of teams) {
      await this.alertsService.checkLowStock(team.id);
      await this.alertsService.checkCandlingDue(team.id);
      await this.alertsService.checkHatchDue(team.id);
      await this.alertsService.checkVaccinationDue(team.id);
      await this.alertsService.checkHighMortality(team.id);
      await this.alertsService.checkLowLayingRate(team.id);
      await this.alertsService.checkOldDebts(team.id);
      await this.alertsService.checkMissingRecords(team.id);
      await this.alertsService.checkSlaughterDue(team.id);
      await this.alertsService.checkOrdersDue(team.id);
    }
  }

  // Chaque nuit a 2h : recalculer les stocks
  @Cron('0 2 * * *')
  async recalculateStocks() {
    // Recalcule les quantites de stock a partir de l'historique des mouvements
    // Corrige les eventuelles desynchronisations
  }

  // Chaque semaine : archiver les lots termines depuis > 90 jours
  @Cron('0 3 * * 0')
  async autoArchiveFlocks() {
    const threshold = new Date(Date.now() - 90 * 24 * 3600 * 1000);
    await this.prisma.flock.updateMany({
      where: { status: 'COMPLETED', endDate: { lt: threshold } },
      data: { status: 'ARCHIVED' },
    });
  }
}
```

---

## 3. Architecture Frontend (Flutter)

### 3.1 Clean Architecture — 3 couches

```
┌─────────────────────────────────────────────┐
│            PRESENTATION                      │
│  Screens, Widgets, Riverpod Providers        │
│  (ce que l'utilisateur voit et touche)       │
├─────────────────────────────────────────────┤
│              DOMAIN                          │
│  Entities, Repositories (abstraits),         │
│  Use Cases                                   │
│  (regles metier pures, aucune dependance)    │
├─────────────────────────────────────────────┤
│               DATA                           │
│  Repository Impl, Remote DataSource (API),   │
│  Local DataSource (Drift), Models            │
│  (implementation concete des repositories)   │
└─────────────────────────────────────────────┘
```

### 3.2 Structure des dossiers

```
lib/
├── main.dart
├── app.dart                              # MaterialApp, theme, GoRouter
│
├── core/
│   ├── constants/
│   │   ├── app_colors.dart               # Design system couleurs
│   │   ├── app_typography.dart           # Typographie
│   │   ├── app_dimensions.dart           # Espacements, radius
│   │   └── app_strings.dart              # Textes statiques
│   ├── errors/
│   │   ├── failures.dart                 # Failure classes (domain)
│   │   └── exceptions.dart               # Exception classes (data)
│   ├── network/
│   │   ├── api_client.dart               # Dio + interceptors
│   │   ├── api_endpoints.dart            # Routes API centralisees
│   │   └── network_info.dart             # Connectivity check
│   ├── database/
│   │   ├── app_database.dart             # Drift database definition
│   │   ├── app_database.g.dart           # Code genere
│   │   ├── tables/                       # Tables Drift (miroir du schema serveur)
│   │   │   ├── flocks_table.dart
│   │   │   ├── daily_records_table.dart
│   │   │   ├── incubation_batches_table.dart
│   │   │   ├── expenses_table.dart
│   │   │   ├── sales_table.dart
│   │   │   ├── stocks_table.dart
│   │   │   ├── customers_table.dart
│   │   │   ├── orders_table.dart
│   │   │   ├── alerts_table.dart
│   │   │   ├── vaccinations_table.dart
│   │   │   └── sync_queue_table.dart     # File d'attente de synchronisation
│   │   └── daos/                         # Data Access Objects
│   │       ├── flocks_dao.dart
│   │       ├── daily_records_dao.dart
│   │       └── ...
│   ├── sync/
│   │   ├── sync_engine.dart              # Moteur de synchronisation
│   │   ├── sync_queue.dart               # Gestion de la file d'attente
│   │   ├── conflict_resolver.dart        # Resolution de conflits
│   │   └── sync_status.dart              # Etat de synchronisation
│   ├── router/
│   │   └── app_router.dart               # GoRouter avec redirect auth
│   ├── storage/
│   │   └── secure_storage.dart           # flutter_secure_storage (tokens)
│   └── utils/
│       ├── validators.dart
│       ├── formatters.dart               # FCFA, dates, kg
│       └── pdf_generator.dart            # Generation PDF locale
│
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── auth_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── user_model.dart
│   │   │   └── repositories/
│   │   │       └── auth_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.dart
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart
│   │   │   └── usecases/
│   │   │       ├── send_otp.dart
│   │   │       └── verify_otp.dart
│   │   └── presentation/
│   │       ├── providers/
│   │       │   └── auth_provider.dart
│   │       └── screens/
│   │           ├── splash_screen.dart
│   │           ├── onboarding_screen.dart
│   │           ├── phone_input_screen.dart
│   │           ├── otp_screen.dart
│   │           ├── profile_setup_screen.dart
│   │           └── team_setup_screen.dart
│   │
│   ├── dashboard/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       │   ├── dashboard_provider.dart
│   │       │   └── charts_provider.dart
│   │       ├── screens/
│   │       │   └── dashboard_screen.dart
│   │       └── widgets/
│   │           ├── stats_card.dart
│   │           ├── quick_actions.dart
│   │           ├── active_flocks_list.dart
│   │           ├── weekly_indicators.dart
│   │           └── alerts_section.dart
│   │
│   ├── flocks/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       ├── screens/
│   │       │   ├── flocks_list_screen.dart
│   │       │   ├── flock_detail_screen.dart
│   │       │   ├── create_flock_screen.dart
│   │       │   └── close_flock_screen.dart
│   │       └── widgets/
│   │           └── flock_card.dart
│   │
│   ├── daily_records/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       ├── screens/
│   │       │   ├── daily_record_screen.dart     # Saisie rapide
│   │       │   └── daily_record_history.dart
│   │       └── widgets/
│   │           ├── breeder_record_form.dart
│   │           └── broiler_record_form.dart
│   │
│   ├── incubation/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       ├── screens/
│   │       │   ├── incubation_list_screen.dart
│   │       │   ├── create_batch_screen.dart
│   │       │   ├── candling_screen.dart
│   │       │   └── hatch_result_screen.dart
│   │       └── widgets/
│   │           ├── incubation_countdown.dart
│   │           └── batch_card.dart
│   │
│   ├── finances/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       ├── screens/
│   │       │   ├── finances_screen.dart         # Vue d'ensemble
│   │       │   ├── expenses_list_screen.dart
│   │       │   ├── create_expense_screen.dart
│   │       │   ├── sales_list_screen.dart
│   │       │   ├── create_sale_screen.dart
│   │       │   ├── debts_screen.dart
│   │       │   └── financial_report_screen.dart
│   │       └── widgets/
│   │           ├── revenue_chart.dart
│   │           ├── expense_chart.dart
│   │           └── profit_bar_chart.dart
│   │
│   ├── stocks/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── stocks_screen.dart
│   │           └── stock_history_screen.dart
│   │
│   ├── customers/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── customers_list_screen.dart
│   │           ├── customer_detail_screen.dart
│   │           └── create_customer_screen.dart
│   │
│   ├── orders/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── orders_list_screen.dart
│   │           └── create_order_screen.dart
│   │
│   ├── vaccination/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── vaccination_calendar_screen.dart
│   │           ├── protocol_list_screen.dart
│   │           └── create_protocol_screen.dart
│   │
│   ├── reports/
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── reports_screen.dart
│   │           └── report_viewer_screen.dart
│   │
│   ├── team/
│   │   ├── data/ ...
│   │   ├── domain/ ...
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           ├── team_screen.dart
│   │           ├── members_screen.dart
│   │           └── invite_screen.dart
│   │
│   ├── notifications/
│   │   └── presentation/
│   │       ├── providers/
│   │       └── screens/
│   │           └── notifications_screen.dart
│   │
│   ├── settings/
│   │   └── presentation/
│   │       └── screens/
│   │           ├── settings_screen.dart
│   │           └── farming_settings_screen.dart
│   │
│   └── profile/
│       └── presentation/
│           └── screens/
│               └── profile_screen.dart
│
└── shared/
    ├── widgets/
    │   ├── sg_button.dart                # Bouton primaire/secondaire
    │   ├── sg_card.dart                  # Carte avec elevation
    │   ├── sg_text_field.dart            # Champ de saisie
    │   ├── sg_dialog.dart
    │   ├── sg_bottom_sheet.dart
    │   ├── sg_empty_state.dart
    │   ├── sg_error_state.dart
    │   ├── sg_skeleton.dart              # Shimmer loading
    │   ├── sg_sync_indicator.dart        # Pastille sync (vert/orange)
    │   ├── sg_flock_card.dart
    │   ├── sg_stat_card.dart
    │   └── sg_photo_picker.dart
    └── extensions/
        ├── context_extensions.dart
        ├── date_extensions.dart
        └── number_extensions.dart
```

### 3.3 State Management — Riverpod

```dart
// ─── Repository Providers (DI) ───────────────────────────────────
final flockRepositoryProvider = Provider<FlockRepository>((ref) {
  return FlockRepositoryImpl(
    remoteDataSource: ref.watch(flockRemoteDataSourceProvider),
    localDataSource: ref.watch(flockLocalDataSourceProvider),
    syncEngine: ref.watch(syncEngineProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// ─── AsyncNotifier pour les donnees (CRUD) ───────────────────────
@riverpod
class ActiveFlocks extends _$ActiveFlocks {
  @override
  Future<List<Flock>> build(String teamId) async {
    return ref.watch(flockRepositoryProvider).getActiveFlocks(teamId);
  }

  Future<void> createFlock(CreateFlockDto dto) async {
    await ref.read(flockRepositoryProvider).create(dto);
    ref.invalidateSelf(); // Rafraichir la liste
  }
}

// ─── StateNotifier pour les formulaires ──────────────────────────
@riverpod
class DailyRecordForm extends _$DailyRecordForm {
  @override
  DailyRecordState build() => DailyRecordState.initial();

  void setEggsLaid(int count) =>
    state = state.copyWith(eggsLaid: count);

  void setMortality(int count, String? cause) =>
    state = state.copyWith(mortalityCount: count, mortalityCause: cause);

  Future<void> submit() async {
    state = state.copyWith(isSubmitting: true);
    try {
      await ref.read(dailyRecordRepositoryProvider).create(state.toDto());
      state = state.copyWith(isSubmitting: false, isSuccess: true);
    } catch (e) {
      state = state.copyWith(isSubmitting: false, error: e.toString());
    }
  }
}

// ─── Sync status provider ────────────────────────────────────────
@riverpod
Stream<SyncStatus> syncStatus(SyncStatusRef ref) {
  return ref.watch(syncEngineProvider).statusStream;
}
```

### 3.4 Routing — GoRouter

```dart
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isOnboarding = state.matchedLocation.startsWith('/onboarding');
      final isAuth = state.matchedLocation.startsWith('/auth');

      if (!isLoggedIn && !isOnboarding && !isAuth) return '/onboarding';
      if (isLoggedIn && (isOnboarding || isAuth)) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/auth/phone', builder: (_, __) => const PhoneInputScreen()),
      GoRoute(path: '/auth/otp', builder: (_, __) => const OtpScreen()),
      GoRoute(path: '/auth/setup-profile', builder: (_, __) => const ProfileSetupScreen()),
      GoRoute(path: '/auth/setup-team', builder: (_, __) => const TeamSetupScreen()),

      // Bottom navigation shell
      ShellRoute(
        builder: (_, __, child) => MainShell(child: child),
        routes: [
          GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
          GoRoute(path: '/flocks', builder: (_, __) => const FlocksListScreen()),
          GoRoute(path: '/flocks/:id', builder: (_, state) =>
            FlockDetailScreen(flockId: state.pathParameters['id']!)),
          GoRoute(path: '/finances', builder: (_, __) => const FinancesScreen()),
          GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
          // ... other routes
        ],
      ),
    ],
  );
});
```

### 3.5 Packages cles

| Package | Usage |
|---------|-------|
| `flutter_riverpod` + `riverpod_annotation` | State management |
| `go_router` | Navigation declarative |
| `drift` + `sqlite3_flutter_libs` | Base de donnees locale (SQLite) |
| `dio` | Client HTTP |
| `fl_chart` | Graphiques (courbes, barres, camembert) |
| `pdf` + `printing` | Generation PDF locale |
| `firebase_messaging` | Push notifications |
| `flutter_local_notifications` | Notifications locales (alertes offline) |
| `image_picker` + `image_cropper` | Selection et recadrage photos |
| `flutter_image_compress` | Compression avant upload |
| `connectivity_plus` | Detection de connectivite |
| `flutter_secure_storage` | Stockage securise des tokens |
| `cached_network_image` | Cache images reseau |
| `shimmer` | Loading skeletons |
| `intl` | Formatage dates, nombres |
| `freezed` + `json_serializable` | Immutable models + JSON |
| `socket_io_client` | WebSocket pour sync temps reel |
| `share_plus` | Partage de rapports PDF |

---

## 4. Authentification

### 4.1 Flux OTP (Phone + Relayio)

```
┌──────────┐                    ┌──────────────┐                ┌──────────┐
│  App      │                    │   Backend     │                │ Relayio  │
│  Flutter  │                    │   NestJS      │                │ (WhatsApp│
│           │                    │               │                │  + SMS)  │
└─────┬────┘                    └───────┬───────┘                └────┬─────┘
      │                                 │                             │
      │ POST /auth/send-otp             │                             │
      │ { phone: "+221XXXXXXX" }        │                             │
      │────────────────────────────────►│                             │
      │                                 │ Genere code 6 chiffres      │
      │                                 │ Stocke en BDD (OtpCode)     │
      │                                 │ TTL = 5 minutes             │
      │                                 │                             │
      │                                 │ POST /send (template OTP)   │
      │                                 │────────────────────────────►│
      │                                 │                             │
      │                                 │◄─── 200 OK ────────────────│
      │◄─── { message: "OTP envoye" } ──│                             │
      │                                 │                             │
      │ POST /auth/verify-otp           │                             │
      │ { phone, code: "123456" }       │                             │
      │────────────────────────────────►│                             │
      │                                 │ Verifie code + expiration   │
      │                                 │ Marque usedAt               │
      │                                 │                             │
      │                                 │ Si nouveau user → cree User │
      │                                 │ Genere JWT + Refresh Token  │
      │◄─── {                           │                             │
      │       accessToken,              │                             │
      │       refreshToken,             │                             │
      │       isNewUser: true/false     │                             │
      │     }                           │                             │
```

### 4.2 JWT + Refresh Token

```typescript
// Payload du JWT access token
{
  sub: "user_cuid",           // User ID
  phone: "+221XXXXXXX",
  iat: 1234567890,
  exp: 1234571490             // 1 heure
}

// Durees de vie
// Access Token  : 1 heure
// Refresh Token : 30 jours (stocke en BDD, revocable)

// Refresh flow :
// POST /auth/refresh { refreshToken }
// → Verifie le refresh token en BDD
// → Si valide → genere nouveau accessToken + nouveau refreshToken
// → Ancien refreshToken invalide (rotation)
```

### 4.3 Flux d'invitation d'equipe

```
Proprietaire                   Backend                     Nouveau membre
      │                           │                             │
      │ Genere un code invitation │                             │
      │ (affiche dans l'app)      │                             │
      │                           │                             │
      │ Partage le code           │                             │
      │ (WhatsApp, oral, etc.)   ─────────────────────────────►│
      │                           │                             │
      │                           │ POST /teams/join            │
      │                           │ { inviteCode: "abc123" }    │
      │                           │◄────────────────────────────│
      │                           │                             │
      │                           │ Cree TeamMember             │
      │                           │ role = MEMBER (defaut)      │
      │                           │                             │
      │                           │ WebSocket: 'member-joined'  │
      │◄──── notification ────────│──── notification ──────────►│
      │                           │                             │
      │ Peut retirer un membre     │                             │
      │ (si OWNER uniquement)     │                             │
```

---

## 5. Architecture Offline Sync (Section critique)

### 5.1 Principe : Local-First

SenGuett est concu pour fonctionner **sans Internet**. Les eleveurs sont souvent dans des zones rurales avec une couverture reseau limitee ou intermittente.

```
                       ┌──────────────────────────┐
                       │     UTILISATEUR           │
                       └────────────┬─────────────┘
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │     ECRAN FLUTTER         │
                       │  (lecture et ecriture)    │
                       └────────────┬─────────────┘
                                    │
                          TOUJOURS LOCAL
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │   DRIFT (SQLite local)   │
                       │  Source de verite locale  │
                       └────────────┬─────────────┘
                                    │
                          SI CONNEXION DISPONIBLE
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │    SYNC ENGINE            │
                       │  (arriere-plan)           │
                       └────────────┬─────────────┘
                                    │
                              HTTPS / WS
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │   SERVEUR NestJS          │
                       │   PostgreSQL              │
                       └──────────────────────────┘
```

**Regle fondamentale** : l'app ne lit JAMAIS directement depuis le serveur. Elle lit toujours depuis Drift (SQLite local). Le serveur est un miroir de synchronisation, pas la source de verite pour l'UI.

### 5.2 Sync Queue (file d'attente des modifications)

Chaque modification locale est enregistree dans une table `SyncQueue` avant d'etre envoyee au serveur.

```dart
// Table Drift : sync_queue
class SyncQueue extends Table {
  TextColumn get id => text()();             // UUID local
  TextColumn get entity => text()();         // "DailyRecord", "Sale", etc.
  TextColumn get entityId => text()();       // ID de l'entite modifiee
  TextColumn get action => text()();         // "CREATE", "UPDATE", "DELETE"
  TextColumn get payload => text()();        // JSON des donnees
  DateTimeColumn get createdAt => dateTime()();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  TextColumn get status => text().withDefault(const Constant('pending'))();
  // status: 'pending' | 'syncing' | 'failed' | 'synced'
  TextColumn get errorMessage => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
```

### 5.3 Cycle de synchronisation

```
┌──────────────────────────────────────────────────────────────────┐
│                    SYNC ENGINE CYCLE                              │
│                                                                  │
│  1. PUSH : Envoyer les modifications locales                     │
│     ├── Lire toutes les entrees SyncQueue (status = 'pending')   │
│     ├── Trier par createdAt (FIFO)                               │
│     ├── Pour chaque entree :                                     │
│     │   ├── Marquer status = 'syncing'                           │
│     │   ├── POST /sync/push { entity, action, payload }         │
│     │   ├── Si 200 → status = 'synced', supprimer de la queue   │
│     │   ├── Si conflit 409 → appliquer resolution               │
│     │   └── Si erreur → retryCount++, status = 'failed'         │
│     └── Abandonner apres 5 retries                               │
│                                                                  │
│  2. PULL : Recevoir les modifications du serveur                 │
│     ├── GET /sync/pull?since={lastSyncTimestamp}                 │
│     ├── Recevoir toutes les modifications des autres membres     │
│     ├── Pour chaque modification :                               │
│     │   ├── Verifier si conflit avec une modification locale     │
│     │   ├── Si pas de conflit → ecrire en local (Drift)         │
│     │   └── Si conflit → appliquer resolution                    │
│     └── Mettre a jour lastSyncTimestamp                          │
│                                                                  │
│  3. Emettre un evenement 'syncComplete' pour rafraichir l'UI     │
└──────────────────────────────────────────────────────────────────┘
```

### 5.4 Resolution de conflits : Last-Write-Wins avec audit

```dart
class ConflictResolver {
  /// Quand la meme entite a ete modifiee localement et sur le serveur :
  /// → La modification la plus recente (updatedAt) gagne
  /// → La modification perdante est enregistree dans AuditLog
  ///
  /// Exemple : deux eleveurs saisissent le meme jour pour le meme lot
  /// → La derniere saisie ecrase la premiere
  /// → L'ancienne valeur est conservee dans AuditLog

  SyncResolution resolve(LocalChange local, ServerChange server) {
    if (local.updatedAt.isAfter(server.updatedAt)) {
      // La modification locale gagne → re-push au serveur
      return SyncResolution(
        winner: local,
        loser: server,
        action: SyncAction.pushLocal,
        auditMessage: 'Conflit resolu : modification locale conservee',
      );
    } else {
      // La modification serveur gagne → ecraser en local
      return SyncResolution(
        winner: server,
        loser: local,
        action: SyncAction.acceptServer,
        auditMessage: 'Conflit resolu : modification serveur conservee',
      );
    }
  }
}
```

### 5.5 Indicateurs de synchronisation dans l'UI

```
┌─────────────────────────────────────┐
│  ● Synchronise            ← Vert   │  Tout est a jour
│  ● 3 en attente           ← Orange │  Modifications non synchro
│  ● Erreur de sync         ← Rouge  │  Echec de synchronisation
│  ○ Hors ligne             ← Gris   │  Pas de connexion
└─────────────────────────────────────┘

// Widget Riverpod
class SyncIndicator extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncStatus = ref.watch(syncStatusProvider);
    return switch (syncStatus) {
      SyncStatus.synced     => _dot(Colors.green, 'Synchronise'),
      SyncStatus.pending(n) => _dot(Colors.orange, '$n en attente'),
      SyncStatus.error      => _dot(Colors.red, 'Erreur de sync'),
      SyncStatus.offline    => _dot(Colors.grey, 'Hors ligne'),
    };
  }
}
```

### 5.6 Ce qui fonctionne hors ligne vs en ligne uniquement

| Fonctionnalite | Hors ligne | En ligne uniquement | Notes |
|----------------|:----------:|:-------------------:|-------|
| Saisie quotidienne | Oui | | Synchro quand connecte |
| Creation de lot | Oui | | |
| Saisie depense / vente | Oui | | |
| Gestion couveuse (mirage, eclosion) | Oui | | |
| Consultation dashboard | Oui | | Donnees locales |
| Graphiques (fl_chart) | Oui | | Donnees locales |
| Consultation stock | Oui | | |
| Creation client | Oui | | |
| Saisie commande | Oui | | |
| Export PDF | Oui | | Genere localement (package pdf) |
| Alertes (calcul local) | Oui | | Timer local + drift |
| Inviter un membre | | Oui | Necessite serveur |
| Rejoindre une equipe | | Oui | Necessite serveur |
| Upload de photos | | Oui | Photo prise hors ligne, upload differe |
| Notifications push | | Oui | FCM necessite connexion |
| Alertes WhatsApp | | Oui | Relayio necessite connexion |
| Synchronisation | | Oui | Par definition |

### 5.7 Declencheurs de synchronisation

```dart
class SyncEngine {
  // La synchronisation se declenche automatiquement quand :
  // 1. L'app detecte une connexion Internet (connectivity_plus)
  // 2. L'app revient au premier plan (WidgetsBindingObserver)
  // 3. Un WebSocket 'sync:*' est recu (un autre membre a modifie)
  // 4. L'utilisateur tire pour rafraichir (pull-to-refresh)
  // 5. Toutes les 5 minutes si l'app est ouverte et connectee

  // La synchronisation ne bloque JAMAIS l'interface
  // Elle tourne dans un Isolate en arriere-plan
}
```

---

## 6. API Design

### 6.1 Convention de base

```
Base URL : https://api.senguett.com/v1

Headers obligatoires :
  Authorization: Bearer {accessToken}
  Content-Type: application/json

Format de reponse standard :
{
  "data": { ... },       // Objet ou liste
  "meta": {              // Optionnel, present sur les listes
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}

Format d'erreur :
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Le champ 'eggsLaid' doit etre un entier positif",
  "details": [...]       // Optionnel, validation errors
}
```

### 6.2 Endpoints REST (groupes par module)

#### Auth

| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/auth/send-otp` | Envoyer OTP par WhatsApp/SMS | Non |
| POST | `/auth/verify-otp` | Verifier OTP, retourne JWT | Non |
| POST | `/auth/refresh` | Rafraichir le token | Non |
| POST | `/auth/logout` | Revoquer le refresh token | Oui |

#### Teams

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| POST | `/teams` | Creer une equipe | Auth |
| GET | `/teams/:teamId` | Details de l'equipe | Tous |
| PATCH | `/teams/:teamId` | Modifier l'equipe | Tous |
| POST | `/teams/join` | Rejoindre via code invitation | Auth |
| GET | `/teams/:teamId/members` | Liste des membres | Tous |
| DELETE | `/teams/:teamId/members/:id` | Retirer un membre | OWNER uniquement |
| POST | `/teams/:teamId/regenerate-invite` | Regenerer le code | OWNER uniquement |

> **Note** : Seules les routes de gestion des membres nécessitent le rôle OWNER. Toutes les autres routes sont accessibles à tous les membres de l'équipe (OWNER + MEMBER).

#### Flocks (Lots)

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/flocks` | Liste des lots | Tous |
| POST | `/teams/:teamId/flocks` | Creer un lot | Tous |
| GET | `/teams/:teamId/flocks/:id` | Detail d'un lot | Tous |
| PATCH | `/teams/:teamId/flocks/:id` | Modifier un lot | Tous |
| POST | `/teams/:teamId/flocks/:id/close` | Cloturer un lot | Tous |
| DELETE | `/teams/:teamId/flocks/:id` | Supprimer un lot | Tous |

#### Daily Records (Saisie quotidienne)

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/daily-records` | Historique saisies | Tous |
| POST | `/teams/:teamId/daily-records` | Saisir un jour | Tous |
| PATCH | `/teams/:teamId/daily-records/:id` | Corriger une saisie | Tous |
| GET | `/teams/:teamId/flocks/:flockId/daily-records` | Saisies d'un lot | Tous |

#### Incubation

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/incubators` | Liste couveuses | Tous |
| POST | `/teams/:teamId/incubators` | Ajouter couveuse | Tous |
| GET | `/teams/:teamId/incubation-batches` | Liste lots couveuse | Tous |
| POST | `/teams/:teamId/incubation-batches` | Creer lot couveuse | Tous |
| PATCH | `/teams/:teamId/incubation-batches/:id/candling-1` | Saisir mirage J7 | Tous |
| PATCH | `/teams/:teamId/incubation-batches/:id/candling-2` | Saisir mirage J14 | Tous |
| PATCH | `/teams/:teamId/incubation-batches/:id/hatch` | Saisir eclosion | Tous |

#### Finances

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/expenses` | Liste depenses | Tous |
| POST | `/teams/:teamId/expenses` | Creer depense | Tous |
| GET | `/teams/:teamId/sales` | Liste ventes | Tous |
| POST | `/teams/:teamId/sales` | Creer vente | Tous |
| POST | `/teams/:teamId/sales/:id/payments` | Enregistrer un paiement | Tous |
| GET | `/teams/:teamId/finances/summary` | Bilan financier | Tous |

#### Stocks

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/stocks` | Etat des stocks | Tous |
| GET | `/teams/:teamId/stocks/:id/moves` | Historique mouvements | Tous |
| POST | `/teams/:teamId/stocks/:id/adjust` | Correction manuelle | Tous |

#### Customers

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/customers` | Liste clients | Tous |
| POST | `/teams/:teamId/customers` | Creer client | Tous |
| PATCH | `/teams/:teamId/customers/:id` | Modifier client | Tous |
| GET | `/teams/:teamId/customers/:id` | Detail client + historique | Tous |

#### Orders (Commandes)

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/orders` | Liste commandes | Tous |
| POST | `/teams/:teamId/orders` | Creer commande | Tous |
| PATCH | `/teams/:teamId/orders/:id/status` | Changer statut | Tous |

#### Alerts

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/alerts` | Liste alertes | Tous |
| PATCH | `/teams/:teamId/alerts/:id/read` | Marquer comme lue | Tous |
| PATCH | `/teams/:teamId/alerts/:id/dismiss` | Fermer l'alerte | Tous |

#### Vaccination

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/vaccination-protocols` | Protocoles | Tous |
| POST | `/teams/:teamId/vaccination-protocols` | Creer protocole | Tous |
| GET | `/teams/:teamId/vaccinations` | Calendrier vaccinations | Tous |
| PATCH | `/teams/:teamId/vaccinations/:id/done` | Marquer fait | Tous |

#### Reports

| Methode | Route | Description | Roles |
|---------|-------|-------------|-------|
| GET | `/teams/:teamId/reports/daily?date=` | Rapport journalier | Tous |
| GET | `/teams/:teamId/reports/weekly?week=` | Rapport hebdomadaire | Tous |
| GET | `/teams/:teamId/reports/monthly?month=` | Rapport mensuel | Tous |
| GET | `/teams/:teamId/reports/flock/:flockId` | Bilan de lot | Tous |

#### Sync

| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/sync/push` | Envoyer modifications locales | Oui |
| GET | `/sync/pull?since={timestamp}` | Recevoir modifications serveur | Oui |

#### Upload

| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/upload` | Upload fichier (multipart) | Oui |
| DELETE | `/upload/:key` | Supprimer fichier | Oui |

### 6.3 Evenements WebSocket

| Evenement | Direction | Payload | Description |
|-----------|-----------|---------|-------------|
| `sync:daily-record` | Serveur → Client | `{ flockId, date, data }` | Nouvelle saisie par un autre membre |
| `sync:flock-update` | Serveur → Client | `{ flockId, changes }` | Modification d'un lot |
| `sync:sale-created` | Serveur → Client | `{ saleId, data }` | Nouvelle vente |
| `sync:expense-created` | Serveur → Client | `{ expenseId, data }` | Nouvelle depense |
| `sync:stock-update` | Serveur → Client | `{ stockId, newQty }` | MAJ stock |
| `sync:incubation-update` | Serveur → Client | `{ batchId, data }` | MAJ lot couveuse |
| `sync:alert` | Serveur → Client | `{ alertId, type, message }` | Nouvelle alerte |
| `sync:member-joined` | Serveur → Client | `{ userId, name, role }` | Nouveau membre |
| `sync:member-removed` | Serveur → Client | `{ userId }` | Membre retire |

### 6.4 Pagination, tri et filtrage

```
# Pagination (offset-based)
GET /teams/:teamId/sales?page=1&limit=20

# Tri
GET /teams/:teamId/sales?sortBy=date&sortOrder=desc

# Filtrage
GET /teams/:teamId/sales?productType=CHICKS&paymentStatus=PENDING
GET /teams/:teamId/daily-records?flockId=xxx&dateFrom=2026-08-01&dateTo=2026-08-15
GET /teams/:teamId/expenses?category=FEED&dateFrom=2026-08-01
GET /teams/:teamId/flocks?type=BROILER&status=ACTIVE
GET /teams/:teamId/orders?status=CONFIRMED

# Combinaison
GET /teams/:teamId/sales?productType=CHICKS&paymentStatus=PENDING&page=2&limit=10&sortBy=date&sortOrder=desc
```

---

## 7. Moteur d'alertes

### 7.1 Architecture hybride (serveur + local)

Les alertes sont generees a deux niveaux pour fonctionner meme hors ligne :

```
┌──────────────────────────────────────────────────────┐
│                  SERVEUR (NestJS)                      │
│                                                        │
│  Cron toutes les heures :                              │
│  ├── Verifier stocks bas (tous les teams)              │
│  ├── Verifier vaccinations dues                        │
│  ├── Verifier mirages dus (couveuse)                   │
│  ├── Verifier eclosions prevues                        │
│  ├── Verifier mortalite anormale (7 jours glissants)   │
│  ├── Verifier taux de ponte bas (7 jours glissants)    │
│  ├── Verifier creances anciennes                       │
│  ├── Verifier saisies manquantes (hier)                │
│  ├── Verifier abattages prevus (J-7)                   │
│  ├── Verifier commandes a livrer                       │
│  └── Verifier ratio males/femelles                     │
│                                                        │
│  → Creer Alert en BDD                                  │
│  → Envoyer push (FCM) si haute priorite                │
│  → Envoyer WhatsApp (Relayio) si critique + configure  │
│  → WebSocket 'sync:alert' aux membres connectes        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  LOCAL (Flutter)                       │
│                                                        │
│  A chaque saisie quotidienne :                         │
│  ├── Verifier stock apres consommation                 │
│  ├── Verifier mortalite du lot                         │
│  └── Creer notification locale si alerte               │
│                                                        │
│  Timer periodique (toutes les heures, app ouverte) :   │
│  ├── Verifier si mirage a faire demain                 │
│  ├── Verifier si eclosion prevue demain                │
│  ├── Verifier si vaccination prevue demain             │
│  └── flutter_local_notifications pour rappel           │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Types d'alertes et declencheurs

| Type | Declencheur | Priorite | Push | WhatsApp |
|------|------------|----------|------|----------|
| `LOW_STOCK` | Stock < seuil configure | Haute | Oui | Oui |
| `CANDLING_DUE` | Veille de J7 ou J14 d'un lot couveuse | Haute | Oui | Oui |
| `HATCH_DUE` | Veille de J24 (poulet) ou J17 (caille) | Haute | Oui | Oui |
| `VACCINATION_DUE` | Date de rappel vaccin atteinte | Haute | Oui | Non |
| `HIGH_MORTALITY` | > 2% mortalite sur un lot en 7 jours | Haute | Oui | Oui |
| `SLAUGHTER_DUE` | J-7 avant fin d'un lot chair | Moyenne | Oui | Non |
| `LOW_LAYING_RATE` | Taux reel < objectif - 10% sur 7 jours | Moyenne | Oui | Non |
| `LAYER_END_CYCLE` | Lot pondeuse > 16 mois | Moyenne | Oui | Non |
| `ORDER_DUE` | Commande confirmee dont la date approche | Moyenne | Oui | Non |
| `OLD_DEBT` | Vente impayee > X jours | Basse | Oui | Non |
| `MISSING_RECORD` | Pas de saisie quotidienne hier | Basse | Oui | Non |
| `MALE_RATIO` | Ratio desequilibre (> 1:6 ou < 1:3) | Basse | Non | Non |

### 7.3 Service de notification (NestJS)

```typescript
@Injectable()
export class NotificationsService {
  constructor(
    private fcmService: FcmService,
    private relayioService: RelayioService,
    private prisma: PrismaService,
  ) {}

  async sendAlert(teamId: string, alert: Alert) {
    // 1. Recuperer les membres de l'equipe avec leur preferences
    const members = await this.prisma.teamMember.findMany({
      where: { teamId, removedAt: null },
      include: { user: true },
    });

    for (const member of members) {
      // 2. Push notification (FCM)
      if (member.user.fcmToken) {
        await this.fcmService.send(member.user.fcmToken, {
          title: alert.title,
          body: alert.message,
          data: { alertId: alert.id, type: alert.type },
        });
      }

      // 3. WhatsApp (Relayio) — uniquement alertes critiques
      if (alert.priority === 'HIGH' && member.user.phone) {
        await this.relayioService.sendNotification(member.user.phone, 'farm_alert', {
          title: alert.title,
          message: alert.message,
        });
      }
    }
  }
}
```

---

## 8. Stockage de fichiers

### 8.1 Architecture

```
┌──────────┐      ┌──────────────┐      ┌───────────────────────┐
│  App     │      │  Backend     │      │  Hetzner Object       │
│  Flutter │      │  NestJS      │      │  Storage (S3)         │
│          │      │              │      │                       │
│  Photo   │─────►│ POST /upload │─────►│  Bucket: senguett     │
│  picker  │      │ (multipart)  │      │  ├── daily-records/   │
│          │      │              │      │  ├── expenses/        │
│          │◄─────│ { url: ... } │      │  ├── flocks/          │
│          │      │              │      │  └── avatars/         │
└──────────┘      └──────────────┘      └───────────────────────┘
```

### 8.2 Compression avant upload

```dart
// Cote Flutter : compression AVANT l'envoi
Future<File> compressImage(File original) async {
  final result = await FlutterImageCompress.compressAndGetFile(
    original.path,
    '${original.path}_compressed.jpg',
    quality: 70,            // Qualite 70% (bon compromis taille/qualite)
    minWidth: 1200,         // Largeur max 1200px
    minHeight: 1200,        // Hauteur max 1200px
    format: CompressFormat.jpeg,
  );
  return result ?? original;
}

// Taille typique apres compression :
// Photo 12MP (4MB) → ~200KB
// Justificatif depense → ~100KB
```

### 8.3 Backend upload service

```typescript
@Injectable()
export class UploadService {
  private s3: S3Client;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: 'eu-central-1',
      endpoint: config.get('S3_ENDPOINT'),    // https://fsn1.your-objectstorage.com
      credentials: {
        accessKeyId: config.get('S3_ACCESS_KEY'),
        secretAccessKey: config.get('S3_SECRET_KEY'),
      },
      forcePathStyle: true,                    // Requis pour Hetzner
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${cuid()}-${file.originalname}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: 'senguett',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }));

    return `${this.config.get('S3_PUBLIC_URL')}/${key}`;
  }
}
```

### 8.4 Photos hors ligne

Quand l'utilisateur prend une photo hors ligne :
1. La photo est compressede et stockee dans le dossier local de l'app
2. Le chemin local est enregistre dans Drift (`photoUrl = 'local://...'`)
3. Une entree est ajoutee dans `SyncQueue` avec l'action `UPLOAD_FILE`
4. A la prochaine synchronisation : upload vers S3, puis MAJ de l'URL en BDD

---

## 9. Deploiement

### 9.1 Topologie serveur

```
Hetzner VPS (recommande : CX22 — 2 vCPU / 4GB RAM / 40GB SSD)
├── Coolify (orchestration Docker)
│   ├── Container : senguett-api (NestJS)         Port 3000
│   ├── Container : PostgreSQL 16                  Port 5432 (interne)
│   └── Container : Nginx (reverse proxy + SSL)   Port 80/443
│
├── Hetzner Object Storage (externe)
│   └── Bucket : senguett (photos, justificatifs)
│
└── Volumes persistants
    └── /data/postgres/
```

### 9.2 Docker Compose

```yaml
version: '3.9'
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    env_file: .env
    depends_on:
      - postgres
    ports:
      - "3000:3000"
    networks:
      - internal

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: senguett
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: senguett_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
    networks:
      - internal

volumes:
  postgres_data:

networks:
  internal:
    driver: bridge
```

### 9.3 Dockerfile (NestJS — multi-stage)

```dockerfile
# ─── Build stage ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Production stage ─────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 9.4 Variables d'environnement

```env
# App
NODE_ENV=production
PORT=3000
APP_URL=https://api.senguett.com

# Database
DATABASE_URL=postgresql://senguett:password@postgres:5432/senguett_db

# Auth
JWT_SECRET=<256-bit-random>
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<256-bit-random>
JWT_REFRESH_EXPIRES_IN=30d

# Relayio (OTP + WhatsApp)
RELAYIO_API_URL=https://api.relayio.com
RELAYIO_API_KEY=xxx

# Firebase (FCM)
FIREBASE_PROJECT_ID=senguett-prod
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx

# Hetzner Object Storage (S3 compatible)
S3_ENDPOINT=https://fsn1.your-objectstorage.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_BUCKET=senguett
S3_PUBLIC_URL=https://senguett.fsn1.your-objectstorage.com

# Throttle
THROTTLE_TTL=60
THROTTLE_LIMIT=100
OTP_THROTTLE_TTL=900
OTP_THROTTLE_LIMIT=5
```

### 9.5 CI/CD

```
Git push (main)
  └── Coolify webhook detecte le push
      └── Build Docker image
          └── Run prisma migrate deploy
              └── Deploy new container (zero-downtime)
                  └── Health check /health
                      └── Si OK → routage du trafic
                      └── Si KO → rollback automatique
```

---

## 10. Securite

### 10.1 Row-level security (isolation par equipe)

Chaque requete de donnees est **scopee par teamId**. Un utilisateur ne peut jamais acceder aux donnees d'une autre equipe.

```typescript
// Le TeamMemberGuard injecte le teamId dans le request
// Chaque service filtre TOUJOURS par teamId

// Exemple : FlockService.findAll()
async findAll(teamId: string) {
  return this.prisma.flock.findMany({
    where: {
      teamId,           // TOUJOURS filtrer par equipe
      deletedAt: null,  // Soft delete
    },
  });
}

// JAMAIS de requete sans teamId sur les entites metier
// Le guard empeche un utilisateur d'acceder a un teamId
// dont il n'est pas membre
```

### 10.2 Role-Based Access Control (RBAC)

```
┌───────────────────────────────────────────────┐
│          MATRICE DES PERMISSIONS              │
│  2 rôles : OWNER et MEMBER                   │
├──────────────────┬────────┬───────────────────┤
│ Action           │ OWNER  │ MEMBER            │
├──────────────────┼────────┼───────────────────┤
│ Saisie quotid.   │  RWD   │   RWD             │
│ Gestion lots     │  RWD   │   RWD             │
│ Incubation       │  RWD   │   RWD             │
│ Depenses         │  RWD   │   RWD             │
│ Ventes           │  RWD   │   RWD             │
│ Clients          │  RWD   │   RWD             │
│ Commandes        │  RWD   │   RWD             │
│ Stocks           │  RWD   │   RWD             │
│ Vaccination      │  RWD   │   RWD             │
│ Parametres       │  RW    │   RW              │
│ Export           │  Oui   │   Oui             │
│ Gerer membres    │  Oui   │   NON             │
│ Supprimer equipe │  Oui   │   NON             │
└──────────────────┴────────┴───────────────────┘

Seule différence : le OWNER gère les membres (inviter/retirer)
et peut supprimer l'équipe. Tout le reste est identique.
```

### 10.3 Audit logging

```typescript
// Interceptor qui journalise automatiquement les mutations
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Ne journaliser que les mutations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        await this.prisma.auditLog.create({
          data: {
            teamId: request.params.teamId,
            userId: request.user.userId,
            action: method === 'DELETE' ? 'DELETE' : method === 'POST' ? 'CREATE' : 'UPDATE',
            entity: this.extractEntity(request.path),
            entityId: responseData?.data?.id || request.params.id || '',
            oldValue: request.method !== 'POST' ? request._previousValue : undefined,
            newValue: responseData?.data,
          },
        });
      }),
    );
  }
}
```

### 10.4 Mesures de securite

| Risque | Mitigation |
|--------|------------|
| Injection SQL | Prisma ORM (requetes parametrees) |
| Auth broken | JWT courte duree (1h) + refresh token rotation |
| Sensitive data | Tokens dans flutter_secure_storage (Keychain/Keystore) |
| Rate limiting | `@nestjs/throttler` — 5 OTP / 15 min, 100 req / min |
| CORS | Whitelist stricte des origines |
| Helmet | Headers securite (CSP, X-Frame-Options, etc.) |
| IDOR | TeamMemberGuard + verification ownership sur chaque requete |
| Data isolation | Toutes les requetes scopees par teamId |
| Soft delete | Aucune donnee reellement supprimee |
| HTTPS | Certificat SSL Let's Encrypt via Coolify |
| Donnees locales | Drift chiffre les donnees avec `sqlcipher` (optionnel V2) |
| Password | Pas de mot de passe — OTP uniquement (pas de stockage sensible) |

---

*Architecture v1.0 — Document de reference pour l'implementation de SenGuett.*
*Stack : Flutter + NestJS + PostgreSQL + Prisma + Drift + Hetzner + Coolify*
