# Guett Gui — Plan d'implementation MVP

**Projet** : Application mobile de gestion d'elevage avicole (Flutter + NestJS)
**Renomme** : SenGuett -> Guett Gui
**Design** : Inspire de DahiraConnect (cards arrondies, header sombre, couleurs teal/vert fonce, FAB central)
**Logos** : `assets/logo_full.png` (splash) + `assets/logo.png` (icone app)
**Date** : 2026-08-30

---

## Phase 0 — Setup & Infrastructure

- [x] Initialiser le projet Flutter dans `mobile/`
- [x] Initialiser le backend NestJS dans `backend/`
- [ ] Preparer le dossier `backoffice/` (Next.js — plus tard, hors MVP)
- [x] Configurer Docker Compose (PostgreSQL + MinIO + API)
- [x] Configurer Prisma ORM + schema initial
- [ ] Creer le fichier .env.example
- [ ] Creer le CLAUDE.md du projet
- [x] Configurer .mcp.json (GitHub, Docker, Cloudflare, Coolify)

---

## Phase 1 — Design System & Theme (inspire DahiraConnect)

- [x] Definir les couleurs (teal fonce #1A3C40, dore #C5A44E, vert fonce #2E7D32, fond gris #F5F5F5)
- [x] Definir la typographie (titres bold, body regular, chiffres large)
- [x] Creer les tokens d'espacement et de formes (radius 16-20px, cards arrondies)
- [x] Creer le ThemeData Flutter complet
- [x] Composants partages :
  - [x] GGCard — Carte avec elevation douce et coins arrondis (style DahiraConnect)
  - [x] GGButton — Bouton primaire/secondaire (48px min)
  - [x] GGTextField — Champ de saisie
  - [x] GGStatCard — Carte stat avec icone + valeur + label (2x2 grid)
  - [x] GGMemberCard — Carte membre style DahiraConnect (gradient sombre, avatar, infos)
  - [x] GGBottomNavBar — Bottom nav avec FAB central (+)
  - [x] GGAppBar — Header avec role utilisateur + cloche notification
  - [x] GGChip — Badge statut (Actif, Termine, etc.)
  - [x] GGEmptyState — Etat vide
  - [x] GGSkeleton — Shimmer loading
  - [x] GGSyncIndicator — Pastille sync (vert/orange/rouge/gris)
  - [x] GGAmountCard — Carte montant total avec tendance
  - [x] GGPhotoPicker — Selection photo

---

## Phase 2 — Backend : Auth & Equipes

- [x] Module Auth
  - [x] DTO : SendOtpDto, VerifyOtpDto
  - [x] Service : generer OTP 6 chiffres, stocker en BDD (TTL 5min)
  - [x] Integration Relayio (SMS/WhatsApp) — mock en dev
  - [x] JWT + Refresh Token (1h / 30j)
  - [x] Controller : POST /auth/send-otp, POST /auth/verify-otp, POST /auth/refresh
  - [x] JwtStrategy + JwtAuthGuard
- [x] Module Teams
  - [x] CRUD equipe (creer, modifier, details)
  - [x] Code d'invitation (genere auto, regenerable)
  - [x] POST /teams/join (rejoindre via code)
  - [x] Gestion membres (inviter, retirer — OWNER only)
  - [x] TeamMemberGuard + RolesGuard
- [ ] Module Users
  - [ ] Profil utilisateur (nom, prenom, avatar)
  - [ ] PATCH /users/me
- [x] Common
  - [x] ValidationPipe global
  - [x] HttpExceptionFilter
  - [x] TransformInterceptor (format { data, meta })
  - [x] AuditInterceptor (journalisation mutations)
  - [x] PaginationDto

---

## Phase 3 — Backend : Elevage (Coeur metier)

- [x] Module Flocks (Lots)
  - [x] CRUD lots (creer, modifier, cloturer, lister)
  - [x] Types : BREEDER, LAYER, BROILER, QUAIL
  - [x] Statuts : ACTIVE, COMPLETED, ARCHIVED
  - [x] Calcul effectif courant (decremente par mortalite/vente)
- [x] Module DailyRecords (Saisie quotidienne)
  - [x] Creer saisie (ponte, mortalite, alimentation, poids)
  - [x] Contrainte : 1 saisie / lot / jour (modifiable)
  - [x] MAJ automatique : effectif lot, stock oeufs, stock aliment
  - [x] Historique par lot et par date
- [x] Module Incubation
  - [x] CRUD couveuses (Incubator)
  - [x] Creer lot de couveuse (IncubationBatch)
  - [x] Dates auto : mirage J7, J14, eclosion J24/J17
  - [x] Saisie mirage (oeufs fertiles, clairs, morts)
  - [x] Saisie eclosion (poussins eclos, non eclos)
  - [x] Calcul taux fertilite, eclosion, global
  - [x] Decrementation stock oeufs au chargement

---

## Phase 4 — Backend : Finances & Stocks

- [x] Module Finances
  - [x] CRUD Depenses (8 categories)
  - [x] CRUD Ventes (8 types de produits)
  - [x] Paiements partiels (SalePayment)
  - [x] Statut paiement : PAID, PENDING, PARTIAL
  - [x] Bilan financier (revenus, depenses, marge par periode)
  - [x] Lien achat aliment -> increment stock
  - [x] Lien vente -> decrement stock
- [x] Module Stocks
  - [x] 8 types de stock (LAYER_FEED, BROILER_FEED, MILLET, etc.)
  - [x] Mouvements de stock (StockMove) : entree/sortie/ajustement
  - [x] Stock oeufs auto-calcule (collecte - incube - vendu)
  - [x] Seuils d'alerte configurables
  - [x] Correction manuelle
- [x] Module Customers
  - [x] CRUD clients (nom, telephone, type, ville)
  - [x] Historique achats + solde creances
- [x] Module Orders
  - [x] CRUD commandes
  - [x] Statuts : PENDING, CONFIRMED, DELIVERED, CANCELLED
  - [x] Livraison -> creation auto d'une Sale

---

## Phase 5 — Backend : Alertes, Vaccination, Rapports

- [x] Module Alerts
  - [x] 12 types d'alertes (LOW_STOCK, CANDLING_DUE, HIGH_MORTALITY, etc.)
  - [x] Cron job toutes les heures
  - [x] Marquer comme lue / fermer
- [x] Module Vaccination
  - [x] CRUD protocoles (par type d'elevage, jour d'admin)
  - [x] Calcul auto dates vaccinations a la creation d'un lot
  - [x] Marquer "fait" avec date et dose
  - [x] Seed protocoles par defaut (Newcastle, Gumboro...)
- [x] Module Reports
  - [x] Rapport journalier, hebdo, mensuel
  - [x] Bilan de lot (chair ou couveuse)
- [x] Module Notifications
  - [x] Service FCM (push)
  - [x] Service Relayio (WhatsApp alertes critiques)
- [x] Module Sync
  - [x] POST /sync/push — recevoir modifs locales
  - [x] GET /sync/pull?since= — envoyer modifs serveur
  - [x] WebSocket Gateway pour sync temps reel
- [x] Module Upload
  - [x] Upload fichier multipart vers MinIO (S3-compatible)
  - [ ] Adapter StorageService pattern minifoot (sharp + proxy controller + rewriteForClient)

---

## Phase 6 — Flutter : Auth & Onboarding

- [x] Setup Riverpod + GoRouter + Drift + Dio
- [x] Splash Screen (2s max, check auth)
  - [ ] Integrer logo_full.png sur le splash screen
- [x] Onboarding (3 pages avec illustrations)
  - [x] Page 1 : "Gerez votre elevage simplement."
  - [x] Page 2 : "Des donnees fiables, de meilleures decisions."
  - [x] Page 3 : "Travaillez en equipe." + boutons Commencer/Se connecter
- [x] Ecran saisie telephone (+221)
- [x] Ecran OTP (6 chiffres, 5 min)
- [x] Ecran creation profil (Nom, Prenom)
- [x] Ecran creer/rejoindre equipe
- [x] Configuration initiale (types elevage, cheptel, objectifs)
- [x] Stockage securise tokens (flutter_secure_storage)

---

## Phase 7 — Flutter : Dashboard (Ecran principal, style DahiraConnect)

- [x] Header : "Bonjour, {Prenom} !" + date + nom elevage
- [x] Carte membre style DahiraConnect (gradient teal fonce, nom, role, ID elevage, QR code)
- [x] Grille 2x2 stats rapides :
  - [x] Oeufs aujourd'hui (+ tendance vs hier)
  - [x] Effectif total
  - [x] Revenus du mois (XOF)
  - [x] Alertes actives
- [x] Carte "Total verse" style DahiraConnect (montant total + graphe tendance)
- [x] Section "Actions rapides" (Saisie du jour, Nouvelle vente, Nouvelle depense)
- [x] Section "Lots actifs" (liste avec mini-stats)
- [x] Section "Alertes" (liste des alertes actives)
- [x] Bottom Navigation : Dashboard | Elevage | (+) FAB | Finances | Profil

---

## Phase 8 — Flutter : Elevage

- [x] Liste des lots (filtres par type/statut)
- [x] Detail d'un lot (stats, historique, graphiques)
- [x] Creation d'un lot (formulaire selon type)
- [x] Saisie quotidienne rapide (< 30s)
  - [x] Formulaire reproducteur/pondeuse/caille (ponte + mortalite + aliment)
  - [x] Formulaire chair (mortalite + aliment + poids moyen)
- [x] Historique saisies par lot
- [x] Gestion couveuses
  - [x] Liste lots de couveuse avec compte a rebours
  - [x] Saisie mirage (J7, J14)
  - [x] Saisie eclosion
  - [x] Taux calcules affiches
- [x] Cloture de lot (bilan final)

---

## Phase 9 — Flutter : Finances

- [x] Vue d'ensemble finances (revenus, depenses, marge)
- [x] Liste depenses + creation rapide
- [x] Liste ventes + creation rapide
- [x] Gestion creances (ventes impayees, paiements partiels)
- [x] Bilan financier avec graphiques (fl_chart)
  - [x] Camembert revenus par produit
  - [x] Camembert depenses par categorie
  - [x] Barres revenus/depenses par mois

---

## Phase 10 — Flutter : Stocks, Clients, Commandes

- [x] Ecran stocks (etat actuel, seuils, alertes)
- [x] Historique mouvements par stock
- [x] Liste clients + fiche client
- [x] Liste commandes + creation
- [ ] Marquage commande livree -> creation vente auto

---

## Phase 11 — Flutter : Alertes, Vaccination, Profil

- [x] Ecran notifications (liste, badge, marquer lu)
- [x] Calendrier vaccination par lot
- [x] Ecran profil/equipe
  - [x] Infos equipe + membres
  - [x] Inviter un membre (OWNER)
  - [x] Parametres elevage (objectifs, seuils)
  - [x] Parametres perso (notifs, langue)

---

## Phase 12 — Offline & Sync

- [ ] Base de donnees locale Drift (miroir schema serveur)
- [ ] Tables Drift pour toutes les entites
- [ ] SyncQueue (file d'attente modifications locales)
- [ ] SyncEngine (push/pull, conflict resolution last-write-wins)
- [ ] Declencheurs sync (connexion, foreground, pull-to-refresh, timer 5min)
- [x] Indicateur sync dans l'UI (vert/orange/rouge/gris)
- [ ] Fonctionnement offline de toutes les saisies

---

## Phase 13 — Rapports & Export

- [x] Generation PDF locale (package pdf)
- [x] Rapport journalier, hebdomadaire, mensuel
- [x] Bilan de lot
- [x] Export CSV
- [x] Partage via WhatsApp/email (share_plus)

---

## Phase 14 — Polish & Deploy

- [ ] Push notifications (FCM)
- [ ] Notifications locales (alertes offline)
- [ ] Compression photos avant upload
- [ ] Tests unitaires (services backend critiques)
- [ ] Tests widgets (ecrans principaux)
- [ ] Deploiement backend (Coolify + Docker + MinIO)
- [ ] Build APK/AAB release
  - [ ] Integrer logo.png comme icone app (Android + iOS)
- [ ] Publication Play Store

---

## Ordre de priorite MVP

Le MVP se concentre sur les phases suivantes dans cet ordre :

1. ~~**Phase 0** — Setup (fondation)~~ FAIT
2. ~~**Phase 1** — Design System (base visuelle)~~ FAIT
3. ~~**Phase 2** — Backend Auth + Equipes~~ FAIT
4. ~~**Phase 6** — Flutter Auth + Onboarding~~ FAIT
5. ~~**Phase 3** — Backend Elevage~~ FAIT
6. ~~**Phase 7** — Flutter Dashboard~~ FAIT
7. ~~**Phase 8** — Flutter Elevage~~ FAIT
8. ~~**Phase 4** — Backend Finances + Stocks~~ FAIT
9. ~~**Phase 9** — Flutter Finances~~ FAIT
10. **Phase 10-14** — Le reste progressivement (EN COURS)

**Total estime** : ~90+ ecrans Flutter, ~50+ endpoints API, ~15 tables BDD

## Reste a faire (priorite)

1. Flutter : Commandes, Notifications, Vaccination, Profil/Equipe (Phase 10-11)
2. Backend : Adapter StorageService avec pattern minifoot (MinIO + sharp + proxy)
3. Backend : Module Users (PATCH /users/me)
4. Offline & Sync (Phase 12) — critique pour le terrain
5. Rapports PDF (Phase 13)
6. Logos : integrer logo_full.png (splash) + logo.png (icone app)
7. Deploy (Phase 14)
