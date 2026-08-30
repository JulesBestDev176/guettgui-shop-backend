# Guett Gui — Regles & Conventions Flutter (Dart)

**Stack** : Flutter 3.x + Dart 3.x + Riverpod + GoRouter + Drift + Dio
**Derniere MAJ** : 2026-08-30

---

## Table des matieres

1. Architecture
2. Conventions de nommage
3. Structure des fichiers
4. State Management (Riverpod)
5. Navigation (GoRouter)
6. Base de donnees locale (Drift)
7. Reseau (Dio)
8. Securite
9. Performance & Optimisation
10. UI/UX & Accessibilite
11. Tests
12. Gestion des erreurs
13. Internationalisation
14. Git & CI
15. Registre des fonctionnalites

---

## 1. Architecture

### 1.1 Clean Architecture — 3 couches strictes

```
lib/
  features/
    <feature>/
      data/           # Implementation concrete
        datasources/  # Remote (API) + Local (Drift)
        models/       # JSON serialization (fromJson/toJson)
        repositories/ # Implementation du repository abstrait
      domain/         # Regles metier pures, ZERO dependance externe
        entities/     # Objets metier immutables (freezed)
        repositories/ # Interfaces abstraites
        usecases/     # Un use case = une action metier
      presentation/   # UI
        providers/    # Riverpod providers
        screens/      # Ecrans complets (Scaffold)
        widgets/      # Widgets specifiques a cette feature
```

### 1.2 Regles de dependance

```
presentation -> domain <- data
```

- `domain/` ne depend de RIEN (ni Flutter, ni packages externes)
- `data/` implemente les interfaces de `domain/`
- `presentation/` utilise `domain/` via Riverpod
- JAMAIS d'import direct de `data/` dans `presentation/`

### 1.3 Shared vs Feature

- `lib/shared/widgets/` : widgets reutilises par 2+ features (prefixe `GG`)
- `lib/core/` : utilitaires globaux (theme, network, database, router, errors)
- Si un widget est utilise par UNE seule feature, il reste dans `features/<feature>/presentation/widgets/`

---

## 2. Conventions de nommage

### 2.1 Fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Fichier Dart | snake_case | `daily_record_screen.dart` |
| Dossier | snake_case | `daily_records/` |
| Test | `<fichier>_test.dart` | `daily_record_screen_test.dart` |
| Barrel export | `<feature>.dart` | Non utilise — imports explicites |

### 2.2 Code Dart

| Type | Convention | Exemple |
|------|-----------|---------|
| Classe | PascalCase | `DailyRecordScreen` |
| Variable / Parametre | camelCase | `eggsCollected` |
| Constante | camelCase | `defaultLayingRate` |
| Enum | PascalCase | `FlockType.breeder` |
| Provider | camelCase + Provider | `activeFlockListProvider` |
| Extension | PascalCase + Extension | `DateTimeExtension` |
| Mixin | PascalCase + Mixin | `ValidationMixin` |
| Fichier genere | `<nom>.g.dart` / `<nom>.freezed.dart` | auto |

### 2.3 Prefixes projet

- Widgets partages : prefixe `GG` (Guett Gui) — ex: `GGButton`, `GGCard`, `GGStatCard`
- Tables Drift : pas de prefixe, nom de l'entite au pluriel — ex: `DailyRecords`
- Providers : suffixe `Provider` — ex: `flockListProvider`

### 2.4 Nommage des ecrans et routes

| Ecran | Nom classe | Route GoRouter |
|-------|-----------|----------------|
| Dashboard | `DashboardScreen` | `/dashboard` |
| Liste lots | `FlocksListScreen` | `/flocks` |
| Detail lot | `FlockDetailScreen` | `/flocks/:id` |
| Creation | `CreateFlockScreen` | `/flocks/create` |

---

## 3. Structure des fichiers

```
lib/
├── main.dart                          # Entry point, ProviderScope
├── app.dart                           # MaterialApp.router, ThemeData
│
├── core/
│   ├── constants/
│   │   ├── app_colors.dart            # Couleurs du design system
│   │   ├── app_typography.dart        # Styles de texte
│   │   ├── app_dimensions.dart        # Spacing, radius, sizes
│   │   └── app_strings.dart           # Textes statiques (FR)
│   ├── errors/
│   │   ├── failures.dart              # Classes Failure (domain)
│   │   └── exceptions.dart            # Classes Exception (data)
│   ├── network/
│   │   ├── api_client.dart            # Dio instance + interceptors
│   │   ├── api_endpoints.dart         # Routes centralisees
│   │   └── network_info.dart          # Connectivity check
│   ├── database/
│   │   ├── app_database.dart          # Drift database
│   │   └── tables/                    # Tables Drift
│   ├── sync/
│   │   ├── sync_engine.dart
│   │   ├── sync_queue.dart
│   │   └── conflict_resolver.dart
│   ├── router/
│   │   └── app_router.dart            # GoRouter config
│   ├── storage/
│   │   └── secure_storage.dart        # Tokens (flutter_secure_storage)
│   └── utils/
│       ├── validators.dart
│       ├── formatters.dart            # XOF, dates, kg
│       └── pdf_generator.dart
│
├── features/                          # Une feature = un module metier
│   ├── auth/
│   ├── dashboard/
│   ├── flocks/
│   ├── daily_records/
│   ├── incubation/
│   ├── finances/
│   ├── stocks/
│   ├── customers/
│   ├── orders/
│   ├── vaccination/
│   ├── reports/
│   ├── notifications/
│   ├── team/
│   ├── settings/
│   └── profile/
│
└── shared/
    ├── widgets/                       # Widgets partages (prefixe GG)
    │   ├── gg_button.dart
    │   ├── gg_card.dart
    │   ├── gg_text_field.dart
    │   ├── gg_stat_card.dart
    │   ├── gg_member_card.dart
    │   ├── gg_bottom_nav_bar.dart
    │   ├── gg_app_bar.dart
    │   ├── gg_chip.dart
    │   ├── gg_empty_state.dart
    │   ├── gg_skeleton.dart
    │   ├── gg_sync_indicator.dart
    │   └── gg_photo_picker.dart
    └── extensions/
        ├── context_extensions.dart
        ├── date_extensions.dart
        └── number_extensions.dart
```

---

## 4. State Management (Riverpod)

### 4.1 Regles

- Utiliser `riverpod_annotation` + code generation (`@riverpod`)
- UN provider par responsabilite — pas de mega-provider
- `AsyncNotifier` pour les donnees CRUD (liste, detail)
- `Notifier` pour les formulaires et etats UI
- `Provider` pour l'injection de dependances (repositories, services)
- `StreamProvider` pour les donnees temps reel (sync status, alerts)

### 4.2 Conventions

```dart
// DI — Repository provider (jamais recree)
@Riverpod(keepAlive: true)
FlockRepository flockRepository(Ref ref) {
  return FlockRepositoryImpl(
    remote: ref.watch(flockRemoteDataSourceProvider),
    local: ref.watch(flockLocalDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
}

// Donnees — AsyncNotifier avec parametre
@riverpod
class ActiveFlocks extends _$ActiveFlocks {
  @override
  Future<List<Flock>> build(String teamId) async {
    return ref.watch(flockRepositoryProvider).getActiveFlocks(teamId);
  }
}

// Formulaire — Notifier synchrone
@riverpod
class DailyRecordForm extends _$DailyRecordForm {
  @override
  DailyRecordFormState build() => DailyRecordFormState.initial();

  void setEggsLaid(int count) => state = state.copyWith(eggsLaid: count);
}
```

### 4.3 Interdits

- PAS de `StateProvider` — utiliser `Notifier` a la place
- PAS de `ChangeNotifier` — c'est du pattern Provider, pas Riverpod
- PAS de logique metier dans les widgets — tout dans les providers/usecases
- PAS de `ref.read` dans le build — utiliser `ref.watch`
- PAS de provider global mutable sans raison — `keepAlive` uniquement si necessaire

---

## 5. Navigation (GoRouter)

### 5.1 Regles

- Routes declaratives dans `app_router.dart`
- Redirect global pour l'auth (non connecte -> onboarding)
- `ShellRoute` pour la bottom navigation
- Parametres via `pathParameters` et `queryParameters`, jamais `extra` pour les donnees critiques
- Noms de routes en constantes

```dart
abstract class AppRoutes {
  static const splash = '/';
  static const onboarding = '/onboarding';
  static const phone = '/auth/phone';
  static const otp = '/auth/otp';
  static const dashboard = '/dashboard';
  static const flocks = '/flocks';
  static const flockDetail = '/flocks/:id';
  static const createFlock = '/flocks/create';
  // ...
}
```

### 5.2 Deep linking

- Chaque ecran doit etre accessible via une route unique
- Pas de navigation imperative (`context.push`) dans la logique metier — seulement dans les widgets

---

## 6. Base de donnees locale (Drift)

### 6.1 Regles

- Tables Drift = miroir simplifie du schema Prisma serveur
- Chaque table a un champ `localId` (UUID) et `syncedAt` (nullable)
- Utiliser des DAOs pour organiser les requetes par entite
- Migrations Drift versionnees (jamais de `destructiveFallback` en prod)
- Toutes les lectures UI passent par Drift, JAMAIS par l'API directement

### 6.2 Convention de tables

```dart
class DailyRecords extends Table {
  TextColumn get id => text()();
  TextColumn get flockId => text()();
  DateTimeColumn get date => dateTime()();
  IntColumn get eggsLaid => integer().nullable()();
  IntColumn get mortalityCount => integer().withDefault(const Constant(0))();
  RealColumn get feedConsumedKg => real().nullable()();
  // ...
  TextColumn get syncStatus => text().withDefault(const Constant('pending'))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
```

---

## 7. Reseau (Dio)

### 7.1 Configuration

- Base URL dans les variables d'environnement (`--dart-define`)
- Interceptors :
  1. `AuthInterceptor` — ajoute Bearer token, gere le refresh auto
  2. `LoggingInterceptor` — log en debug uniquement
  3. `RetryInterceptor` — retry 3x sur erreur reseau (pas sur 4xx)
- Timeout : connect 10s, receive 30s
- Content-Type : `application/json`

### 7.2 Regles

- JAMAIS d'appel Dio direct dans un widget ou provider
- Tout passe par un `RemoteDataSource` dans `data/datasources/`
- Les erreurs Dio sont converties en `ServerException` dans le datasource
- Les `ServerException` sont converties en `Failure` dans le repository

```dart
// data/datasources/flock_remote_datasource.dart
class FlockRemoteDataSource {
  final Dio _dio;

  Future<List<FlockModel>> getFlocks(String teamId) async {
    try {
      final response = await _dio.get('/teams/$teamId/flocks');
      return (response.data['data'] as List)
          .map((json) => FlockModel.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
```

---

## 8. Securite

### 8.1 Stockage

- Tokens (JWT, refresh) : `flutter_secure_storage` (Keychain iOS / Keystore Android)
- JAMAIS de token en SharedPreferences ou en clair
- JAMAIS de secret/API key dans le code source — utiliser `--dart-define`

### 8.2 Donnees

- Pas de donnees sensibles dans les logs
- Masquer les numeros de telephone dans les logs (`+221 77 *** ** 45`)
- Valider les entrees utilisateur cote client ET serveur
- Sanitizer les champs texte libre avant affichage (XSS)

### 8.3 Reseau

- HTTPS obligatoire (certificate pinning optionnel V2)
- Pas de donnees sensibles dans les URL (query params)
- Token refresh automatique — pas de deconnexion brutale

### 8.4 Build

- Obfuscation Dart en release (`--obfuscate --split-debug-info`)
- ProGuard / R8 active sur Android
- Pas de mode debug en release
- `debugPrint` uniquement, jamais `print` — et desactive en release

---

## 9. Performance & Optimisation

### 9.1 Widgets

- `const` constructors partout ou possible
- Decomposer les gros widgets en sous-widgets (eviter les rebuild excessifs)
- Utiliser `ListView.builder` / `ListView.separated` pour les listes (jamais `ListView(children: [...])` avec beaucoup d'items)
- `AutomaticKeepAliveClientMixin` sur les onglets si necessaire
- Eviter les `MediaQuery.of(context)` repetes — cacher le resultat
- `RepaintBoundary` sur les widgets lourds isoles (graphiques fl_chart)

### 9.2 Images

- Compresser avant upload (`flutter_image_compress`, qualite 70%, max 1200px)
- `CachedNetworkImage` pour toutes les images reseau
- Placeholder shimmer pendant le chargement
- Pas d'images en resolution native dans les listes — utiliser des thumbnails

### 9.3 State

- `ref.watch` sur le provider le plus specifique possible (pas le parent)
- `select` pour ne rebuild que sur un champ specifique :
  ```dart
  final count = ref.watch(flocksProvider.select((s) => s.length));
  ```
- Eviter les providers qui recalculent a chaque frame

### 9.4 Base locale

- Index Drift sur les colonnes filtrees/triees frequemment
- Pagination sur les listes longues (limit/offset dans les requetes Drift)
- Transactions pour les operations multiples (saisie quotidienne = record + stock + effectif)
- Ne pas charger toutes les donnees en memoire — stream/watch avec Drift

### 9.5 Build

- Tree shaking actif en release
- Lazy loading des features avec deferred imports si necessaire
- Analyser la taille de l'APK avec `--analyze-size`

---

## 10. UI/UX & Accessibilite

### 10.1 Zones tactiles

- Minimum 48x48 dp pour tout element interactif
- Padding minimum 8dp entre les elements cliquables
- `InkWell` / `GestureDetector` avec `HitTestBehavior.opaque`

### 10.2 Textes

- Taille minimum body : 14sp
- Taille minimum label : 12sp
- Titres : 20-24sp bold
- Chiffres importants : 28-32sp bold
- Toujours definir `maxLines` + `overflow` sur les textes dynamiques

### 10.3 Couleurs & contrastes

- Ratio de contraste minimum 4.5:1 (WCAG AA)
- Ne jamais utiliser la couleur seule pour transmettre une information (ajouter icone + texte)
- Tester en plein soleil (contraste eleve obligatoire)

### 10.4 Retours utilisateur

- Feedback haptique sur les actions importantes (vibration legere)
- SnackBar pour les actions reussies (vert, 2s)
- Dialog de confirmation pour les suppressions
- Skeleton/shimmer pendant le chargement (jamais d'ecran blanc)
- Pull-to-refresh sur toutes les listes

### 10.5 Formulaires

- Labels au-dessus des champs (pas de hint seul)
- Validation en temps reel (debounce 500ms)
- Bouton de soumission desactive tant que le formulaire est invalide
- Clavier adapte au champ (numerique pour les quantites, telephone, etc.)
- Pre-remplir les valeurs par defaut (dernier prix, date du jour)

---

## 11. Tests

### 11.1 Structure

```
test/
├── unit/
│   ├── domain/usecases/
│   └── data/repositories/
├── widget/
│   └── features/<feature>/
└── integration/
```

### 11.2 Regles

- Tests unitaires sur tous les use cases et repositories
- Tests widget sur les ecrans principaux (dashboard, saisie quotidienne)
- Nommage : `should <expected> when <condition>`
- Mocks avec `mocktail` (pas mockito)
- Coverage minimum cible : 70% sur domain/ et data/

### 11.3 Conventions

```dart
group('CreateDailyRecord', () {
  test('should create record when flock is active', () async {
    // Arrange
    when(() => mockRepo.create(any())).thenAnswer((_) async => Right(record));
    // Act
    final result = await usecase(params);
    // Assert
    expect(result, Right(record));
    verify(() => mockRepo.create(any())).called(1);
  });
});
```

---

## 12. Gestion des erreurs

### 12.1 Pattern Either (dartz ou fpdart)

```dart
// domain/repositories/flock_repository.dart
abstract class FlockRepository {
  Future<Either<Failure, List<Flock>>> getActiveFlocks(String teamId);
  Future<Either<Failure, Flock>> create(CreateFlockParams params);
}

// Types de Failure
sealed class Failure {
  final String message;
  const Failure(this.message);
}

class ServerFailure extends Failure { ... }
class CacheFailure extends Failure { ... }
class NetworkFailure extends Failure { ... }
class ValidationFailure extends Failure { ... }
```

### 12.2 Regles

- JAMAIS de `try/catch` vide ou silencieux
- Toutes les erreurs remontent via `Either<Failure, T>` depuis le repository
- Les providers exposent les erreurs via `AsyncValue.error`
- Messages d'erreur en francais courant pour l'utilisateur
- Logs techniques (anglais) pour le debug

---

## 13. Internationalisation

### 13.1 V1 : Francais uniquement

- Tous les textes dans `app_strings.dart` ou `intl` / `arb` files
- Pas de texte hardcode dans les widgets
- Formatage :
  - Dates : `intl` package (`DateFormat('dd/MM/yyyy', 'fr')`)
  - Montants : `NumberFormat.currency(locale: 'fr', symbol: 'XOF', decimalDigits: 0)`
  - Poids : `'${value.toStringAsFixed(1)} kg'`

---

## 14. Git & CI

### 14.1 Branches

- `main` — production
- `develop` — integration
- `feature/<nom>` — feature branch
- `fix/<nom>` — bug fix
- `release/<version>` — preparation release

### 14.2 Commits

- Format : `type(scope): description`
- Types : `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`
- Scope : nom du module (`auth`, `flocks`, `dashboard`, etc.)
- Exemples :
  - `feat(flocks): ajouter creation de lot`
  - `fix(daily-records): corriger calcul effectif apres mortalite`

### 14.3 Pre-commit

- `dart format .`
- `dart analyze --fatal-infos`
- `dart run build_runner build` (si fichiers generes modifies)

### 14.4 CI

- Lint (`dart analyze`)
- Tests (`flutter test`)
- Build (`flutter build apk --release`)

---

## 15. Registre des fonctionnalites

> **OBLIGATOIRE** : Avant de coder une fonctionnalite, verifier ici si elle existe deja.
> Apres implementation, ajouter une entree avec le chemin et une description.

### Widgets partages (shared/widgets/)

| Widget | Fichier | Description |
|--------|---------|-------------|
| GGButton | `shared/widgets/gg_button.dart` | Bouton primaire/secondaire/danger/accent, 52px, coins arrondis, loading state |
| GGCard | `shared/widgets/gg_card.dart` | Carte avec elevation douce, radius 16px, variante active |
| GGTextField | `shared/widgets/gg_text_field.dart` | Champ de saisie Material 3 avec label, icone prefixe, validation |
| GGStatCard | `shared/widgets/gg_stat_card.dart` | Carte stat DahiraConnect: icone cercle colore, valeur grande, trend |
| GGMemberCard | `shared/widgets/gg_member_card.dart` | Carte gradient sombre (teal->vert), avatar, nom, role, ID, QR, badge Actif |
| GGBottomNavBar | `shared/widgets/gg_bottom_nav_bar.dart` | Bottom nav 4 onglets + FAB central (+) style DahiraConnect |
| GGAppBar | `shared/widgets/gg_app_bar.dart` | Header avec role utilisateur + icone notification avec badge |
| GGChip | `shared/widgets/gg_chip.dart` | Badge statut colore (Actif, Termine, En attente, Paye, etc.) |
| GGEmptyState | `shared/widgets/gg_empty_state.dart` | Etat vide avec icone, titre, description, bouton action |
| GGSkeleton | `shared/widgets/gg_skeleton.dart` | Shimmer loading (rectangle, circle, text, card) |
| GGSyncIndicator | `shared/widgets/gg_sync_indicator.dart` | Pastille sync (vert/orange/rouge/gris) + label |
| GGPhotoPicker | `shared/widgets/gg_photo_picker.dart` | Selection photo camera/galerie avec compression |
| GGAmountCard | `shared/widgets/gg_amount_card.dart` | Carte montant total avec icone tendance style DahiraConnect |

### Features implementees

| Feature | Module | Fichiers principaux | Description |
|---------|--------|---------------------|-------------|
| Auth | `features/auth/` | splash, onboarding, phone_input, otp, profile_setup, team_setup, initial_config | Authentification OTP, creation profil, equipe, config initiale |
| Dashboard | `features/dashboard/` | dashboard_screen, main_shell | Ecran principal DahiraConnect: greeting, member card, stats 2x2, amount card, lots actifs, alertes |
| Flocks | `features/flocks/` | flocks_list, flock_detail, create_flock, close_flock | CRUD lots elevage avec filtres, stats, historique, cloture avec bilan |
| DailyRecords | `features/daily_records/` | daily_record_screen, daily_record_history | Saisie quotidienne rapide (compteurs +/-), historique par lot |
| Incubation | `features/incubation/` | incubation_list, create_batch, candling, hatch_result | Gestion couveuses, mirage, eclosion, countdown J/total |
| Finances | `features/finances/` | finances, expenses_list, create_expense, sales_list, create_sale, debts, financial_report | Vue d'ensemble, CRUD depenses/ventes, creances, rapport financier |
| Stocks | `features/stocks/` | stocks_screen, stock_history | Etat stocks avec jauges, historique mouvements entree/sortie |
| Customers | `features/customers/` | customers_list, customer_detail, create_customer | CRUD clients avec historique achats et solde creances |
| Orders | `features/orders/` | orders_list, create_order | CRUD commandes avec statuts (En attente, Confirmee, Livree, Annulee) |
| Vaccination | `features/vaccination/` | vaccination_calendar, protocol_list, create_protocol | Calendrier vaccinal par lot, CRUD protocoles |
| Notifications | `features/notifications/` | notifications_screen | Liste notifications avec badge lu/non lu, priorite |
| Team | `features/team/` | team_screen, members_screen, invite_screen | Gestion equipe, membres, code invitation |
| Settings | `features/settings/` | settings_screen, farming_settings | Parametres app et elevage (objectifs, seuils) |
| Profile | `features/profile/` | profile_screen | Profil utilisateur avec menu acces rapide, deconnexion |
| Reports | `features/reports/` | reports_screen, report_viewer_screen | Generateur rapports PDF (journalier, hebdo, mensuel, bilan lot), apercu et partage |

### Utilitaires (core/utils/)

| Utilitaire | Fichier | Description |
|-----------|---------|-------------|
| Validators | `core/utils/validators.dart` | Validation: required, phone, otp, name, positiveNumber, percentage, amount, weight, inviteCode |
| Formatters | `core/utils/formatters.dart` | Formatage: XOF/FCFA, dates (full/medium/short/relative), kg, pourcentages, oeufs/tablettes, telephone, countdown, timer |
| PdfGenerator | `core/utils/pdf_generator.dart` | Generation PDF : rapport journalier, hebdomadaire, mensuel, bilan de lot. Header Guett Gui, tableaux, couleurs #2EA831/#1D1D1B, pied de page |
| CsvExporter | `core/utils/csv_exporter.dart` | Export CSV (separateur ;) : ventes, depenses, saisies quotidiennes, clients. Headers en francais |

### Providers globaux

| Provider | Fichier | Description |
|----------|---------|-------------|
| dioProvider | `core/network/api_client.dart` | Instance Dio avec interceptors Auth/Logging/Retry |
| networkInfoProvider | `core/network/network_info.dart` | Detection connectivite (connectivity_plus) |
| secureStorageProvider | `core/storage/secure_storage.dart` | Stockage securise tokens/userId/teamId |
| routerProvider | `core/router/app_router.dart` | GoRouter avec redirect auth, ShellRoute bottom nav |
| authRepositoryProvider | `features/auth/.../auth_provider.dart` | Repository auth (DI) |
| authStateProvider | `features/auth/.../auth_provider.dart` | Etat auth (user, isAuthenticated, isLoading) |
| otpTimerProvider | `features/auth/.../auth_provider.dart` | Timer OTP 5 minutes avec countdown |
| dashboardStatsProvider | `features/dashboard/.../dashboard_provider.dart` | Stats dashboard (oeufs, effectif, revenus, alertes) |
| activeFlocksSummaryProvider | `features/dashboard/.../dashboard_provider.dart` | Liste lots actifs resume |
| activeAlertsProvider | `features/dashboard/.../dashboard_provider.dart` | Liste alertes actives |
| dashboardRepositoryProvider | `features/dashboard/.../dashboard_data_provider.dart` | Repository dashboard (DI) |
| dashboardDataProvider | `features/dashboard/.../dashboard_data_provider.dart` | Stats dashboard depuis API (FutureProvider.family) |
| dashboardRemoteDataSourceProvider | `features/dashboard/.../dashboard_data_provider.dart` | DataSource remote dashboard |
| flockRepositoryProvider | `features/flocks/.../flock_provider.dart` | Repository flocks (DI) |
| flockRemoteDataSourceProvider | `features/flocks/.../flock_provider.dart` | DataSource remote flocks |
| flockListProvider | `features/flocks/.../flock_provider.dart` | Liste tous les lots (FutureProvider.family) |
| activeFlockListProvider | `features/flocks/.../flock_provider.dart` | Liste lots actifs (FutureProvider.family) |
| flockDetailProvider | `features/flocks/.../flock_provider.dart` | Detail d'un lot (FutureProvider.family) |
| flockListNotifierProvider | `features/flocks/.../flock_provider.dart` | Notifier CRUD flocks (StateNotifier) |
| dailyRecordRepositoryProvider | `features/daily_records/.../daily_record_provider.dart` | Repository daily records (DI) |
| dailyRecordRemoteDataSourceProvider | `features/daily_records/.../daily_record_provider.dart` | DataSource remote daily records |
| dailyRecordListProvider | `features/daily_records/.../daily_record_provider.dart` | Liste saisies (FutureProvider.family) |
| flockDailyRecordsProvider | `features/daily_records/.../daily_record_provider.dart` | Saisies d'un lot (FutureProvider.family) |
| dailyRecordNotifierProvider | `features/daily_records/.../daily_record_provider.dart` | Notifier CRUD daily records (StateNotifier) |
| incubationRepositoryProvider | `features/incubation/.../incubation_provider.dart` | Repository incubation (DI) |
| incubationRemoteDataSourceProvider | `features/incubation/.../incubation_provider.dart` | DataSource remote incubation |
| incubatorsProvider | `features/incubation/.../incubation_provider.dart` | Liste couveuses (FutureProvider.family) |
| incubationBatchListProvider | `features/incubation/.../incubation_provider.dart` | Liste lots couveuse (FutureProvider.family) |
| incubationNotifierProvider | `features/incubation/.../incubation_provider.dart` | Notifier CRUD incubation (StateNotifier) |
| financeRepositoryProvider | `features/finances/.../finance_provider.dart` | Repository finances (DI) |
| financeRemoteDataSourceProvider | `features/finances/.../finance_provider.dart` | DataSource remote finances |
| expenseListProvider | `features/finances/.../finance_provider.dart` | Liste depenses (FutureProvider.family) |
| saleListProvider | `features/finances/.../finance_provider.dart` | Liste ventes (FutureProvider.family) |
| financialSummaryProvider | `features/finances/.../finance_provider.dart` | Bilan financier (FutureProvider.family) |
| financeNotifierProvider | `features/finances/.../finance_provider.dart` | Notifier CRUD finances (StateNotifier) |
| stockRepositoryProvider | `features/stocks/.../stock_provider.dart` | Repository stocks (DI) |
| stockRemoteDataSourceProvider | `features/stocks/.../stock_provider.dart` | DataSource remote stocks |
| stockListProvider | `features/stocks/.../stock_provider.dart` | Liste stocks (FutureProvider.family) |
| stockMovesProvider | `features/stocks/.../stock_provider.dart` | Historique mouvements (FutureProvider.family) |
| stockNotifierProvider | `features/stocks/.../stock_provider.dart` | Notifier stocks + ajustement (StateNotifier) |
| customerRepositoryProvider | `features/customers/.../customer_provider.dart` | Repository customers (DI) |
| customerRemoteDataSourceProvider | `features/customers/.../customer_provider.dart` | DataSource remote customers |
| customerListProvider | `features/customers/.../customer_provider.dart` | Liste clients (FutureProvider.family) |
| customerDetailProvider | `features/customers/.../customer_provider.dart` | Detail client (FutureProvider.family) |
| customerNotifierProvider | `features/customers/.../customer_provider.dart` | Notifier CRUD customers (StateNotifier) |

### Data Layer (datasources, models, repositories)

| Type | Feature | Fichier | Description |
|------|---------|---------|-------------|
| Model | Auth | `features/auth/data/models/user_model.dart` | UserModel fromJson/toJson |
| Model | Auth | `features/auth/data/models/auth_tokens_model.dart` | AuthTokensModel (accessToken, refreshToken, isNewUser) |
| DataSource | Auth | `features/auth/data/datasources/auth_remote_datasource.dart` | Appels Dio: sendOtp, verifyOtp, updateProfile, createTeam, joinTeam, getCurrentUser, logout |
| Repository | Auth | `features/auth/data/repositories/auth_repository_impl.dart` | Impl AuthRepository, gere SecureStorage |
| Model | Dashboard | `features/dashboard/data/models/dashboard_stats_model.dart` | DashboardStatsModel fromJson/toJson |
| DataSource | Dashboard | `features/dashboard/data/datasources/dashboard_remote_datasource.dart` | getDashboardStats, getActiveFlocks, getActiveAlerts |
| Repository | Dashboard | `features/dashboard/data/repositories/dashboard_repository_impl.dart` | Impl DashboardRepository |
| Model | Flocks | `features/flocks/data/models/flock_model.dart` | FlockModel fromJson/toJson |
| DataSource | Flocks | `features/flocks/data/datasources/flock_remote_datasource.dart` | CRUD flocks (GET/POST/PATCH/DELETE) |
| Repository | Flocks | `features/flocks/data/repositories/flock_repository_impl.dart` | Impl FlockRepository |
| Model | DailyRecords | `features/daily_records/data/models/daily_record_model.dart` | DailyRecordModel fromJson/toJson |
| DataSource | DailyRecords | `features/daily_records/data/datasources/daily_record_remote_datasource.dart` | create, getAll, update, getFlockRecords |
| Repository | DailyRecords | `features/daily_records/data/repositories/daily_record_repository_impl.dart` | Impl DailyRecordRepository |
| Model | Incubation | `features/incubation/data/models/incubation_batch_model.dart` | IncubationBatchModel fromJson/toJson |
| DataSource | Incubation | `features/incubation/data/datasources/incubation_remote_datasource.dart` | CRUD incubators + batches, candling, hatch |
| Repository | Incubation | `features/incubation/data/repositories/incubation_repository_impl.dart` | Impl IncubationRepository |
| Model | Finances | `features/finances/data/models/expense_model.dart` | ExpenseModel fromJson/toJson |
| Model | Finances | `features/finances/data/models/sale_model.dart` | SaleModel fromJson/toJson |
| Model | Finances | `features/finances/data/models/financial_summary_model.dart` | FinancialSummaryModel fromJson/toJson |
| DataSource | Finances | `features/finances/data/datasources/finance_remote_datasource.dart` | expenses, sales, payments, summary |
| Repository | Finances | `features/finances/data/repositories/finance_repository_impl.dart` | Impl FinanceRepository |
| Model | Stocks | `features/stocks/data/models/stock_model.dart` | StockModel fromJson/toJson |
| Model | Stocks | `features/stocks/data/models/stock_move_model.dart` | StockMoveModel fromJson/toJson |
| DataSource | Stocks | `features/stocks/data/datasources/stock_remote_datasource.dart` | getStocks, getMoves, adjustStock |
| Repository | Stocks | `features/stocks/data/repositories/stock_repository_impl.dart` | Impl StockRepository |
| Model | Customers | `features/customers/data/models/customer_model.dart` | CustomerModel fromJson/toJson |
| DataSource | Customers | `features/customers/data/datasources/customer_remote_datasource.dart` | CRUD customers |
| Repository | Customers | `features/customers/data/repositories/customer_repository_impl.dart` | Impl CustomerRepository |

### Domain Layer (entities, repositories abstraits)

| Type | Feature | Fichier | Description |
|------|---------|---------|-------------|
| Entity | Auth | `features/auth/domain/entities/user.dart` | User avec fullName, displayName, isOwner, hasTeam |
| Repository | Auth | `features/auth/domain/repositories/auth_repository.dart` | Interface AuthRepository + AuthResult |
| Entity | Dashboard | `features/dashboard/domain/entities/dashboard_stats.dart` | DashboardStats (eggsToday, totalEffective, monthRevenue, etc.) |
| Repository | Dashboard | `features/dashboard/domain/repositories/dashboard_repository.dart` | Interface DashboardRepository |
| Entity | Flocks | `features/flocks/domain/entities/flock.dart` | Flock avec mortalityRate, ageInDays, typeLabel |
| Repository | Flocks | `features/flocks/domain/repositories/flock_repository.dart` | Interface FlockRepository |
| Entity | DailyRecords | `features/daily_records/domain/entities/daily_record.dart` | DailyRecord (eggsLaid, mortality, feed, water, weight) |
| Repository | DailyRecords | `features/daily_records/domain/repositories/daily_record_repository.dart` | Interface DailyRecordRepository |
| Entity | Incubation | `features/incubation/domain/entities/incubation_batch.dart` | IncubationBatch avec hatchRate, fertilityRate |
| Repository | Incubation | `features/incubation/domain/repositories/incubation_repository.dart` | Interface IncubationRepository |
| Entity | Finances | `features/finances/domain/entities/expense.dart` | Expense |
| Entity | Finances | `features/finances/domain/entities/sale.dart` | Sale avec remainingAmount, isPaid, hasDebt |
| Entity | Finances | `features/finances/domain/entities/financial_summary.dart` | FinancialSummary |
| Repository | Finances | `features/finances/domain/repositories/finance_repository.dart` | Interface FinanceRepository |
| Entity | Stocks | `features/stocks/domain/entities/stock.dart` | Stock + StockMove avec isLow, fillPercentage, isEntry |
| Repository | Stocks | `features/stocks/domain/repositories/stock_repository.dart` | Interface StockRepository |
| Entity | Customers | `features/customers/domain/entities/customer.dart` | Customer avec fullName, hasDebt |
| Repository | Customers | `features/customers/domain/repositories/customer_repository.dart` | Interface CustomerRepository |

### Extensions

| Extension | Fichier | Methodes | Description |
|-----------|---------|----------|-------------|
| ContextExtension | `shared/extensions/context_extensions.dart` | theme, textTheme, screenWidth, showSuccessSnackBar, showErrorSnackBar, showWarningSnackBar, showConfirmDialog | Raccourcis BuildContext + feedback utilisateur |
| DateTimeExtension | `shared/extensions/date_extensions.dart` | fullDate, mediumDate, shortDate, relative, isToday, isYesterday, startOfDay, startOfWeek, isSameDay, daysDifference | Formatage et manipulation de dates |
| NumExtension | `shared/extensions/number_extensions.dart` | xof, xofCompact, xofShort, formatted | Formatage nombres en FCFA |
| IntExtension | `shared/extensions/number_extensions.dart` | eggs, trays | Formatage oeufs et tablettes |
| DoubleExtension | `shared/extensions/number_extensions.dart` | kg, kgInt, percent, percentInt | Formatage poids et pourcentages |

### Base de donnees locale (Drift) — Phase 12

#### Tables Drift (core/database/tables/)

| Table | Fichier | Colonnes principales |
|-------|---------|---------------------|
| Users | `core/database/tables/users_table.dart` | id, phone, firstName, lastName, avatarUrl + sync fields |
| Teams | `core/database/tables/teams_table.dart` | id, name, location, logoUrl, currency, inviteCode, targetLayingRate, targetFertility, targetHatchRate + sync fields |
| TeamMembers | `core/database/tables/team_members_table.dart` | id, userId, teamId, role, joinedAt, removedAt + sync fields |
| Flocks | `core/database/tables/flocks_table.dart` | id, teamId, name, type, breed, status, startDate, endDate, initialMales/Females/Total, currentMales/Females/Total, targetLayingRate, broilerDurationDays, notes + sync fields |
| DailyRecords | `core/database/tables/daily_records_table.dart` | id, flockId, date, eggsLaid, eggsBroken, eggsCollected, mortalityCount, mortalityCause, feedConsumedKg, waterConsumedL, avgWeightKg, sampleSize, notes, photoUrl, recordedById + sync fields |
| IncubationBatches | `core/database/tables/incubation_batches_table.dart` | id, teamId, incubatorId, sourceFlockId, status, loadDate, candling1/2Date, expectedHatchDate, actualHatchDate, eggsLoaded, eggsFertile, eggsClear, eggsDeadJ7, eggsAliveJ14, eggsDeadJ14, chicksHatched, eggsUnhatched, fertilityRate, hatchRate, overallRate + sync fields |
| Incubators | `core/database/tables/incubators_table.dart` | id, teamId, name, capacity, isActive + sync fields |
| Expenses | `core/database/tables/expenses_table.dart` | id, teamId, flockId, date, category, subCategory, description, amount, photoUrl, recordedById + sync fields |
| Sales | `core/database/tables/sales_table.dart` | id, teamId, flockId, customerId, orderId, date, productType, quantity, unitPrice, totalAmount, paymentStatus, amountPaid, paymentMethod, notes, recordedById + sync fields |
| SalePayments | `core/database/tables/sale_payments_table.dart` | id, saleId, date, amount, method, notes, recordedById + sync fields |
| Customers | `core/database/tables/customers_table.dart` | id, teamId, firstName, lastName, phone, city, district, type, notes + sync fields |
| Orders | `core/database/tables/orders_table.dart` | id, teamId, customerId, flockId, productType, quantity, unitPrice, requestedDate, status, notes, recordedById + sync fields |
| Stocks | `core/database/tables/stocks_table.dart` | id, teamId, type, name, currentQty, unit, alertThreshold + sync fields |
| StockMoves | `core/database/tables/stock_moves_table.dart` | id, stockId, type, quantity, date, description, expenseId, recordedById + sync fields |
| Alerts | `core/database/tables/alerts_table.dart` | id, teamId, type, priority, title, message, isRead, isDismissed, referenceId + sync fields |
| Vaccinations | `core/database/tables/vaccinations_table.dart` | id, flockId, vaccineName, scheduledDate, actualDate, route, doseGiven, isDone, doneById, notes + sync fields |
| VaccinationProtocols | `core/database/tables/vaccination_protocols_table.dart` | id, teamId, name, flockType, dayOfAdmin, route, notes + sync fields |
| SyncQueue | `core/database/tables/sync_queue_table.dart` | id, entity, entityId, action, payload, createdAt, retryCount, status, errorMessage |

> **Sync fields** communs : syncStatus (text, default 'pending'), syncedAt (dateTime, nullable), localCreatedAt (dateTime, default now), localUpdatedAt (dateTime, default now)

#### Database (core/database/)

| Fichier | Description |
|---------|-------------|
| `core/database/app_database.dart` | Definition Drift database, 18 tables, 7 DAOs, schemaVersion 1, SQLite via NativeDatabase |

#### DAOs (core/database/daos/)

| DAO | Fichier | Methodes |
|-----|---------|----------|
| FlocksDao | `core/database/daos/flocks_dao.dart` | getActiveFlocks, watchActiveFlocks, getAllFlocks, watchAllFlocks, getById, watchById, insertFlock, updateFlock, deleteFlock, getByStatus |
| DailyRecordsDao | `core/database/daos/daily_records_dao.dart` | getByFlockAndDate, getByFlock, watchByFlock, getByFlockAndDateRange, insertRecord, updateRecord |
| SalesDao | `core/database/daos/sales_dao.dart` | getByTeam, watchByTeam, getByCustomer, getPendingSales, insertSale, updateSale |
| ExpensesDao | `core/database/daos/expenses_dao.dart` | getByTeam, watchByTeam, getByCategory, getByDateRange, insertExpense, updateExpense |
| StocksDao | `core/database/daos/stocks_dao.dart` | getByTeam, watchByTeam, updateQty, insertStock, getByType |
| CustomersDao | `core/database/daos/customers_dao.dart` | getByTeam, watchByTeam, getById, watchById, insertCustomer, updateCustomer, searchByName |
| SyncQueueDao | `core/database/daos/sync_queue_dao.dart` | getPending, watchPendingCount, getRetryable, markSyncing, markSynced, markFailed, deleteOldSynced, enqueue, getAll |

#### Sync Engine (core/sync/)

| Fichier | Description |
|---------|-------------|
| `core/sync/sync_status.dart` | Enum SyncStatus (synced, pending, error, offline), SyncState, SyncStatusNotifier (StateNotifier), syncStatusProvider |
| `core/sync/conflict_resolver.dart` | ConflictResolver (last-write-wins sur updatedAt), LocalChange, ServerChange, SyncResolution, SyncAction |
| `core/sync/sync_engine.dart` | SyncEngine (push/pull mock), syncEngineProvider, appDatabaseProvider. Push lit SyncQueue pending et log. Pull mock. Timer periodique 5 min |

#### Providers locaux (core/database/)

| Provider | Fichier | Description |
|----------|---------|-------------|
| appDatabaseProvider | `core/sync/sync_engine.dart` | Instance AppDatabase (Drift) |
| syncEngineProvider | `core/sync/sync_engine.dart` | Instance SyncEngine (mock, pas d'appel reseau) |
| syncStatusProvider | `core/sync/sync_status.dart` | Etat de synchronisation (SyncStatusNotifier) |
| localFlockListProvider | `core/database/local_providers.dart` | Stream lots actifs depuis Drift (StreamProvider.family) |
| localAllFlocksProvider | `core/database/local_providers.dart` | Stream tous les lots depuis Drift (StreamProvider.family) |
| localDailyRecordsProvider | `core/database/local_providers.dart` | Stream saisies par lot depuis Drift (StreamProvider.family) |
| localSalesProvider | `core/database/local_providers.dart` | Stream ventes par equipe depuis Drift (StreamProvider.family) |
| localExpensesProvider | `core/database/local_providers.dart` | Stream depenses par equipe depuis Drift (StreamProvider.family) |
| localStocksProvider | `core/database/local_providers.dart` | Stream stocks par equipe depuis Drift (StreamProvider.family) |
| localCustomersProvider | `core/database/local_providers.dart` | Stream clients par equipe depuis Drift (StreamProvider.family) |

---

*Ce document est vivant. Chaque nouveau developpement doit mettre a jour le registre des fonctionnalites.*
