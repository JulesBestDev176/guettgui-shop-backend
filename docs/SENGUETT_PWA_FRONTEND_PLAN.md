# SenGuett — plan frontend PWA mobile-first

**Portée :** frontend uniquement. Ce plan reprend le PRD, l'architecture, le schéma de données et les contrats REST disponibles dans `docs/specs/`. Il ne modifie ni ne reconstruit le backend NestJS.

## Décision technique

Créer une nouvelle application isolée dans `apps/senguett-app/` avec **React, TypeScript et Vite**, plutôt que Next.js. SenGuett est une application d'exploitation locale-first : l'interface doit lire et écrire dans IndexedDB, y compris hors connexion. Une SPA rend ce fonctionnement plus simple et plus fiable qu'un rendu serveur, sans besoin SEO.

| Besoin | Choix |
|---|---|
| UI mobile-first | React 19 + TypeScript + Tailwind CSS |
| Composants accessibles | Radix UI / composants maison SenGuett |
| Navigation | React Router, avec shell à 4 onglets |
| Formulaires | React Hook Form + Zod |
| Etat serveur/local | TanStack Query + Dexie (IndexedDB) |
| Offline | Dexie comme source de vérité UI ; file `syncQueue` persistante |
| API | client HTTP typé vers NestJS REST, JWT en stockage sécurisé web |
| Temps réel | Socket.IO seulement au premier plan ; déclenche une synchronisation |
| Graphiques | Recharts, chargé à la demande |
| PWA | `vite-plugin-pwa`, manifeste, service worker Workbox, icônes maskable |
| Qualité | Vitest + Testing Library + Playwright + Lighthouse CI |

### Compatibilité iOS et Android

L'application sera installable depuis Chrome/Edge sur Android et depuis **Safari > Partager > Sur l'écran d'accueil** sur iPhone/iPad. Elle sera responsive dès 320 px, utilisable au tactile, et mise en cache hors ligne.

Une PWA ne peut toutefois pas garantir les mêmes tâches d'arrière-plan qu'une application native, surtout sur iOS : pas de Background Sync fiable, WebSocket suspendu en arrière-plan, et notifications web uniquement pour une PWA installée sur iOS 16.4+. Le plan adopte donc la solution fiable : sauvegarde locale immédiate, synchronisation au retour au premier plan, au retour du réseau, à l'ouverture et par action explicite de l'utilisateur. Les alertes serveur et push restent dépendantes du backend/FCM.

## Principes UX

- Français, FCFA, fuseau Afrique/Dakar, formats et numéros sénégalais (`+221`).
- Fond clair, contrastes élevés et cible tactile minimale de 48 px, lisibles au soleil.
- Une action principale par écran ; saisie quotidienne en moins de 30 secondes.
- Indicateur permanent de synchronisation : synchronisé, en attente, hors ligne ou erreur.
- Design : vert agriculture `#2E7D32`, vert sombre `#1B5E20`, terre `#8D6E63`, couleurs sémantiques du design system source.

### Référence visuelle : `charcut-frontend`

La référence locale `C:\Users\HP\Documents\Informatique\autres\charcutsn\charcut-frontend` est utilisée pour la finition visuelle, sans en reprendre les parcours e-commerce :

- **Typographie :** Poppins pour titres, libellés et chiffres ; Inter pour les textes descriptifs.
- **Surfaces :** page `#FAFAFA`, cartes blanches, bordures très discrètes `#F0F0F0`, coins de 16 à 20 px et ombres courtes.
- **Vert :** `#22A849` comme accent interactif ; le vert agriculture `#2E7D32` reste la teinte métier pour les statuts et actions élevage.
- **Mobile :** barre basse fixe avec zone tactile de 44 px minimum et respect de `safe-area-inset-bottom`.
- **Desktop/tablette :** priorité mobile ; à partir de 600 px, les cartes passent en deux colonnes sans introduire de navigation latérale dans la V1 terrain.

## Architecture cible

```text
apps/senguett-app/
  src/
    app/                 # providers, routeur, shell et PWA update prompt
    features/
      auth/ dashboard/ flocks/ daily-records/ incubation/
      finances/ stocks/ customers/ orders/ vaccinations/
      alerts/ reports/ team/ settings/
    shared/              # design tokens, composants, formatters, validateurs
    data/
      local/             # Dexie : tables miroir et syncQueue
      api/               # client REST, DTO, mappers, WebSocket
      sync/              # push/pull, conflits LWW, statut réseau
  public/icons/          # 192, 512, maskable, apple-touch-icon
  vite.config.ts
```

Chaque fonctionnalité expose ses types métier, schémas Zod, dépôt local-first, écrans et tests. L'écran lit toujours IndexedDB ; le réseau complète la réplication et ne bloque jamais la saisie.

## Écrans et routes

| Domaine | Routes principales | Priorité |
|---|---|---|
| Accès | `/`, `/onboarding`, `/auth/telephone`, `/auth/otp`, `/configuration/*` | P0 |
| Dashboard | `/dashboard`, `/notifications` | P0 |
| Élevage | `/lots`, `/lots/nouveau`, `/lots/:id`, `/saisie`, `/couveuses`, `/incubation/:id` | P0 |
| Finances | `/finances`, `/depenses`, `/depenses/nouvelle`, `/ventes`, `/ventes/nouvelle`, `/creances` | P1 |
| Stocks et clients | `/stocks`, `/stocks/:id`, `/clients`, `/clients/:id`, `/commandes` | P1 |
| Prévention et profil | `/vaccinations`, `/rapports`, `/equipe`, `/parametres` | P2 |

La barre basse contient exactement : **Accueil, Élevage, Finances, Profil**. Le bouton d'action flottant ouvre la saisie du jour ; les raccourcis Dashboard ouvrent vente et dépense.

## Plan d'exécution

### Phase 0 — cadrage et socle (P0)

1. Créer `apps/senguett-app`, tooling TypeScript, lint, formatage, variables `.env.example` et CI.
2. Implémenter tokens, composants génériques (bouton, carte, champ, sélecteur, dialogue, skeleton, empty/error state, sync status) et thème clair.
3. Configurer le routeur, les layouts auth/app, la navigation basse, les états chargement/erreur et le jeu de données de démonstration.
4. Configurer le manifeste PWA, les icônes Android/iOS, le service worker et l'écran de mise à jour de l'application.

**Validation :** installable sur Android et iOS Safari, navigation au clavier/tactile, Lighthouse PWA et accessibilité sans erreurs bloquantes.

### Phase 1 — accès, équipe et local-first (P0)

1. Onboarding, téléphone/OTP, profil, création ou adhésion à une équipe et configuration initiale du cheptel.
2. Client API pour `/auth/*`, `/teams/*`, rafraîchissement de session et gestion de session expirée.
3. Tables IndexedDB : profil, équipe, lots, saisies, couveuses, incubations, dépenses, ventes, stocks, clients, commandes, vaccinations, alertes et `syncQueue`.
4. Moteur de synchronisation : écriture transactionnelle locale + opération en attente, push/pull, last-write-wins, réessai progressif et indicateur utilisateur.

**Validation :** créer une saisie sans réseau, fermer/réouvrir l’app, puis la synchroniser sans perte quand le réseau revient.

### Phase 2 — cœur élevage et dashboard (P0)

1. Dashboard : quatre statistiques, actions rapides, lots actifs, alertes et indicateurs hebdomadaires.
2. Lots : liste filtrable, création selon le type (reproducteur, pondeuse, chair, caille), détail, historique et clôture.
3. Saisie quotidienne adaptative : ponte/mortalité/aliment pour reproducteur-pondeuse-caille ; mortalité/aliment/eau/poids pour chair.
4. Couveuses et cycles : création, compte à rebours, mirage J7/J14, éclosion et calculs de fertilité/éclosion.

**Validation :** parcours « saisir le jour » réalisable sur téléphone en moins de 30 secondes, intégralement hors ligne.

### Phase 3 — finances, stocks et commerce (P1)

1. Dépenses, ventes, paiements partiels, créances et bilan par période.
2. Stocks et historique des mouvements ; mise à jour locale optimiste selon les flux prévus par le PRD.
3. Clients, fiche client, commandes et passage d'une commande livrée à une vente.
4. Graphiques accessibles et légers : ponte, poids, revenus/dépenses, répartition.

**Validation :** montants en FCFA corrects, validations des formulaires, filtres et données locales cohérents après synchronisation.

### Phase 4 — prévention, partage et finition (P2)

1. Notifications in-app, vaccination, paramètres d'élevage, membres (actions propriétaire seulement) et préférences.
2. Rapports visuels ; export CSV et impression/partage via les APIs Web. Les exports PDF dépendront du format réellement fourni par le backend ou d'un générateur frontend validé.
3. Photos : stockage local temporaire, compression navigateur, upload différé lorsque l'API `/upload` est disponible.
4. Gestion du cycle de vie PWA : prompt d'installation, permissions de notifications, retour au premier plan, reprise de sync.

**Validation :** tests de régression, audit accessibilité, test manuel iOS Safari et Android Chrome sur réseau dégradé.

## Contrat frontend/backend à verrouiller avant intégration réelle

Le fichier `BACKEND_NESTJS_SPEC.md` fourni est vide. Les routes utilisées proviennent donc de `02_ARCHITECTURE.md`. Avant de remplacer les mocks, vérifier avec l'API réelle : enveloppe de réponse, DTO exacts, payload OTP, renouvellement JWT, pagination, format des erreurs, CORS, Socket.IO, contenu de `/sync/push` et `/sync/pull`, et la gestion multipart des photos.

## Répartition des agents IA

| Agent | Mission | Sortie attendue |
|---|---|---|
| Agent 1 — Lead frontend | Initialiser le projet, architecture, conventions, routeur, CI et revue des PR | socle maintenable et guide de contribution |
| Agent 2 — Design/PWA | Transposer le design system en tokens/composants et configurer manifeste, SW, installation et accessibilité | UI cohérente et PWA installable |
| Agent 3 — Data/offline | Dexie, file de sync, client API, gestion réseau, conflits et tests offline | lecture/écriture locale fiable + synchronisation |
| Agent 4 — Parcours élevage | Auth, onboarding, dashboard, lots, saisie quotidienne et incubation | MVP terrain P0 complet |
| Agent 5 — Gestion commerciale | Finances, stocks, clients, commandes et graphiques | parcours P1 complet |
| Agent 6 — QA mobile | Tests unitaires/E2E, matrice iOS/Android, Lighthouse, a11y et réseau dégradé | rapport de recette et corrections priorisées |

Les agents 2 et 3 interviennent avant les agents de fonctionnalités. Les agents 4 et 5 peuvent ensuite travailler en parallèle sur des dossiers de fonctionnalités distincts. L'agent 6 valide à la fin de chaque phase, pas uniquement à la livraison finale.

## Définition de terminé

- PWA installable, responsive et accessible sur iOS Safari et Android Chrome.
- Les parcours P0 sont entièrement fonctionnels avec les données de démonstration, puis connectables aux endpoints NestJS documentés.
- Toute création/modification est durable hors ligne et visible dans l'indicateur de sync.
- Aucun écran essentiel ne dépend exclusivement du réseau pour afficher les données déjà téléchargées.
- Tests critiques verts et recette manuelle sur appareils ou émulateurs iOS/Android documentée.
