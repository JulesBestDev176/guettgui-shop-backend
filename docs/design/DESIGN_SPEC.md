# Guett Gui — Specification Design Complete

**Document pour le designer/dev qui va implementer**
**Date** : 2026-08-30
**Ecran cible** : 5-6 pouces (360x800dp logiques) — Tecno Spark, Infinix Hot, Samsung A
**Plateforme** : iOS + Android via Flutter

---

## 1. Philosophie de design

### Identite visuelle
L'app doit respirer le **professionnalisme agricole** — pas "tech startup", pas "jeu mobile". On cherche la **confiance** et la **clarte**. Un eleveur senegalais doit ouvrir l'app et immediatement comprendre ou il en est.

### Principes
1. **Densite informationnelle maitrisee** : montrer les bons chiffres, pas tous les chiffres
2. **Hierarchie visuelle forte** : l'oeil doit aller du plus important au moins important naturellement
3. **Respiration** : les elements ne se touchent jamais, toujours du vide entre eux
4. **Coherence** : meme langage visuel partout, pas de surprise
5. **Touch-friendly** : utilisable avec des mains sales/occupees, en plein soleil

### References d'inspiration (apps a etudier)
- **DahiraConnect** (code source disponible dans le projet mouride) — pour le pattern GlassCard, MemberCard, KPIs
- **Revolut** — pour la hierarchie financiere, les montants, les transitions
- **Notion mobile** — pour la navigation simple et les listes epurees
- **Linear mobile** — pour les status chips et les listes de taches
- **Duolingo** — pour la gamification subtile des stats (mais sans exagerer)

---

## 2. Palette de couleurs (extraite du logo)

### Couleurs principales
```
Vert logo (primary)  : #2EA831 — UNIQUEMENT pour : CTA, liens, accents, icones actives
Noir logo (night)    : #1D1D1B — UNIQUEMENT pour : titres, texte principal
Ivory (fond)         : #F7F4EE — fond de TOUTES les pages, jamais blanc pur
Blanc                : #FFFFFF — fond des cards, inputs
```

### Couleurs secondaires (avec parcimonie)
```
Gold (accent)        : #C8960C — UNIQUEMENT dans la member card et badges speciaux
Teal dark            : #1A3C40 — UNIQUEMENT dans le gradient de la member card
```

### Texte (4 niveaux seulement)
```
Titres               : #1D1D1B (night) — w600 ou w700
Texte normal         : #1D1D1B alpha 0.75
Texte secondaire     : #1D1D1B alpha 0.45
Texte desactive      : #1D1D1B alpha 0.25
```

### Semantique
```
Succes / bon         : #2EA831 (= primary)
Erreur / danger      : #D32F2F
Avertissement        : #F57F17
Info                 : #0277BD
```

### REGLES STRICTES
- PAS de gris Material (#9E9E9E, #757575, etc.) — utiliser night avec alpha
- PAS de dore/gold en dehors de la member card
- PAS de gradient en dehors de la member card
- Les cards sont BLANCHES sur fond IVORY — le contraste vient de la

---

## 3. Typographie

### Police : Inter (via Google Fonts ou system)
- Si Inter n'est pas dispo, fallback sur le system font — PAS de police exotique

### Echelle typographique (7 niveaux max)
```
headlineSmall   : 24px / w600  — Titres de page ("Bonjour, Amadou")
titleLarge      : 22px / w700  — Gros chiffres KPI ("142")
titleMedium     : 16px / w600  — Titres de section ("Lots actifs")
titleSmall      : 14px / w600  — Sous-titres, noms dans les listes
bodyMedium      : 14px / w400  — Texte courant
labelMedium     : 12px / w500  — Labels, tags
labelSmall      : 11px / w400  — Meta info, dates, suffixes ("mois", "XOF")
```

### Regles
- JAMAIS de fontSize hardcode dans un widget — toujours `Theme.of(context).textTheme.xxx`
- Les chiffres importants (montants, compteurs) utilisent `fontFeatures: [FontFeature.tabularFigures()]` pour l'alignement
- letter-spacing 0 partout sauf les labels uppercase (1.2-1.5)

---

## 4. Espacement & Grille

### Grille de base : 4dp
Tous les espacements sont des multiples de 4 :
```
4dp   — entre un label et sa valeur (intra-element)
8dp   — entre 2 elements lies (dans une card)
12dp  — entre 2 cards dans une row
16dp  — padding ecran horizontal + vertical (STANDARD)
20dp  — entre 2 sections dans un scroll
24dp  — avant un titre de section
```

### Padding ecran
```
Horizontal : 16dp de chaque cote (FIXE, jamais 20 ou 24)
Vertical   : 16dp en haut, 110dp en bas (pour le bottom nav + FAB)
```

### Cards
```
Padding interne : 14dp (pas 16 — c'est plus compact et elegant)
Border radius   : 16dp (pas 20 — trop rond fait "jouet")
Elevation       : 0 — pas d'ombre Material
Bordure         : 1dp solid rgba(0,0,0,0.06) OU backdrop blur glass effect
```

---

## 5. Composants — Specifications precises

### 5.1 Member Card (hero du dashboard)

**Dimensions** : pleine largeur - 32dp padding = 328dp large, ratio 1.6:1 = 205dp haut
**Position** : juste sous le greeting, c'est le PREMIER element visuellement fort

Contenu (de haut en bas, de gauche a droite) :
```
Ligne 1 : [logo coq 20x20 from assets/logo.png] [8dp] "GUETT" blanc alpha0.9 + "GUI" gold — [spacer] — badge "Actif" (pill vert)
Ligne 2 (centree verticalement) : [avatar cercle 48dp gold alpha0.25] [14dp] [Nom 18px w600 blanc] / [Role 12px blanc alpha0.65] / [NOM ELEVAGE 12px gold w600 uppercase]
```

**Fond** : gradient 3 stops (tealDark -> tealMedium -> primary)
**Effets** : glow orbs (comme DahiraConnect), dots pattern subtil, shimmer
**IMPORTANT** : le logo.png (coq) remplace l'icone `Icons.spa_outlined` dans le coin haut gauche

### 5.2 KPI Cards (stat cards)

**Dimensions** : 2 cards cote a cote = (328 - 12) / 2 = 158dp chacune, hauteur ~100dp
**Style** : GlassCard (backdrop blur + blanc alpha0.75) OU simple card blanche + bordure fine

Contenu :
```
[cercle 28dp avec icone outlined 16dp]
[10dp]
[label en labelSmall alpha0.45]
[2dp]
[valeur en titleLarge w700 night] [suffix en labelSmall alpha0.38]
```

**Les 4 KPIs du dashboard** :
1. Oeufs (icone egg_outlined, cercle warning alpha0.10) — "142" + "oeufs"
2. Effectif (icone pets_outlined, cercle primary alpha0.10) — "520" + "sujets"
3. Revenus (icone account_balance_wallet_outlined) — "850K" + "FCFA" — version large pleine largeur
4. PAS de 4eme KPI — 2 petits + 1 large = la bonne densite

### 5.3 Amount Card (montant large)

**Dimensions** : pleine largeur, hauteur ~90dp
**Style** : GlassCard

Contenu :
```
Row : [cercle 28dp night alpha0.08 + icone money] [spacer] [trending_up vert ou rouge]
[10dp]
[label en labelSmall alpha0.45 — "Total revenus (2026)"]
[2dp]
[montant en headlineSmall w700 night — "2 450 000"] [4dp] ["XOF" en labelSmall alpha0.38]
```

### 5.4 Flock Mini Card (lots actifs, scroll horizontal)

**Dimensions** : 160dp large x 100dp haut (pas 180x120 — c'est trop gros)
**Style** : GlassCard

Contenu :
```
Row : [dot 6dp couleur type] [8dp] [nom lot en titleSmall w600, 1 ligne max]
[8dp]
[effectif en labelSmall alpha0.45 — "200 sujets"]
[spacer]
[valeur cle en titleMedium w700 primary — "142 oeufs/j" ou "J-15" en warning]
```

### 5.5 Alert Card

**Dimensions** : pleine largeur, hauteur auto (~56dp)
**Style** : GlassCard OU card blanche + bordure gauche 3dp coloree

Contenu :
```
Row : [cercle 24dp couleur alpha0.12 + icone 14dp] [12dp] [titre titleSmall + message labelSmall] [chevron_right alpha0.25]
```

### 5.6 Bottom Navigation

**Hauteur** : 64dp + safe area bottom
**Style** : fond ivory, pas blanc — coherent avec le reste

```
4 items + FAB central :
[Accueil home_outlined] [Elevage egg_outlined] [FAB + 48dp circle vert] [Finances wallet_outlined] [Profil person_outlined]
```

**FAB** : 48dp (pas 56 — c'est trop gros), cercle primary, icone add 22dp blanc, ombre primary alpha0.25
**Labels** : 10px, alpha0.35 inactif, primary actif
**Icones** : 22dp (pas 24), outlined toujours

### 5.7 App Bar (header)

**Hauteur** : 48dp (pas 56 — on gagne de la place)
**Fond** : ivory (pas blanc)

```
Row : [icone person_outlined 22dp night] [8dp] [role uppercase labelSmall w700 night] [spacer] [notification bell 22dp + badge si > 0]
```

### 5.8 Boutons

**Bouton primaire** :
- Hauteur 48dp, radius 12dp
- Fond primary, texte blanc 15px w600
- Full width dans les formulaires

**Bouton outlined** :
- Hauteur 48dp, radius 12dp
- Bordure primary 1.5dp, texte primary 15px w600

**Bouton texte** :
- Pas de fond, texte primary 14px w600
- Utilise pour les liens ("Voir tout", "Passer", "Se connecter")

### 5.9 Champs de saisie

- Hauteur 52dp, radius 12dp
- Fond blanc, bordure night alpha0.12
- Focus : bordure primary 1.5dp
- Label au-dessus en labelMedium alpha0.55 (pas flottant)
- Placeholder en night alpha0.20

### 5.10 GlassCard (carte de base)

```
ClipRRect(radius 16dp)
  BackdropFilter(blur sigmaX: 12, sigmaY: 12)  // 12 pas 16, plus subtil
    Container(
      padding: 14dp,
      decoration: blanc alpha0.70,  // 0.70 pas 0.75
      border: blanc alpha0.30,
      shadow: night alpha0.03, blur 16, offset(0,3)  // tres subtil
    )
```

---

## 6. Ecrans — Specification par ecran

### 6.1 Splash (2 secondes)

```
Fond ivory
Centre vertical :
  [logo_full.png width 200dp]  // PAS 280 — c'est trop gros
  [40dp]
  [CircularProgressIndicator 24dp, stroke 2dp, primary]
```

Pas de texte additionnel. Pas d'animation. Simple, propre.

### 6.2 Onboarding (2 pages intro + 1 page connexion)

**Pages intro (swipe)** :
```
Fond ivory
Centre vertical :
  [logo.png (coq) width 80dp height 80dp]  // petit, discret
  [32dp]
  [titre headlineSmall w600 night — 2 lignes max]
  [12dp]
  [description bodyMedium alpha0.55 — 3 lignes max, centre]
```

**Page connexion (derniere page)** :
```
Fond ivory
Scroll vertical :
  [32dp top]
  [logo_full.png width 180dp]  // PAS 220 — plus compact
  [36dp]
  [titre headlineSmall w600 — "Connectez-vous"]
  [6dp]
  [sous-titre bodySmall alpha0.55 — "Entrez votre numero..."]
  [28dp]
  [champ telephone +221 | 7X XXX XX XX]
  [20dp]
  [bouton primary "Se connecter" full width]
  [16dp]
  [texte "Pas de compte ? Inscription" centre]
```

**Dots indicator** en bas : 3 dots, actif = primary 24dp large x 8dp, inactif = night alpha0.12 8x8dp

### 6.3 Inscription

```
Fond ivory
AppBar ivory + fleche retour
Scroll :
  [logo.png coq 64dp centre]  // PAS 80
  [20dp]
  [titre headlineSmall — "Creer un compte"]
  [6dp]
  [sous-titre bodySmall alpha0.55]
  [24dp]
  [champ Prenom]
  [12dp]
  [champ Nom]
  [12dp]
  [champ Telephone +221]
  [28dp]
  [bouton primary "S'inscrire"]
  [16dp]
  [texte "Deja un compte ? Se connecter"]
```

### 6.4 Dashboard (ecran principal)

C'est la page la plus importante. Elle doit etre PARFAITE.

```
Fond ivory
[AppBar 48dp : person + "PROPRIETAIRE" + bell]

ListView padding(16, 16, 16, 110) :
  [date — labelSmall alpha0.45 — "30 aout 2026"]
  [4dp]
  [greeting — headlineSmall w600 — "Bonjour, Amadou"]
  [16dp]
  [MemberCard — ratio 1.6:1 — gradient, logo coq, nom, role, elevage]
  [16dp]
  [Row : KPI Oeufs (158dp) + 12dp + KPI Effectif (158dp)]  // 100dp haut
  [12dp]
  [AmountCard — revenus pleine largeur]  // 90dp haut
  [24dp]
  [section header "Lots actifs" + "Voir tout"]
  [12dp]
  [horizontal scroll : FlockMiniCards 160x100dp, gap 12dp]
  [24dp]
  [section header "Alertes" + "Voir tout"]
  [12dp]
  [AlertCards empilees, gap 8dp]
  [32dp bottom]
```

**CALCUL DE DENSITE** : sur un ecran 800dp de haut - 48dp appbar - 64dp bottom nav = 688dp visible.
- Date + greeting : ~50dp
- MemberCard : ~205dp
- KPIs row : ~100dp + 12dp + AmountCard ~90dp = ~202dp
- Section lots : ~24dp titre + 100dp cards = ~124dp
- TOTAL au-dessus du fold : ~581dp — les alertes sont juste en dessous, il faut scroller un peu. C'est bien.

### 6.5 Liste des lots

```
Fond ivory
AppBar ivory : titre "Elevage" + filtre chips (Tous | Repro | Pondeuse | Chair | Caille)
  Les chips : fond night alpha0.06, texte night alpha0.45, actif = fond primary alpha0.12 texte primary

Liste vertical (ListView.builder) :
  Chaque lot = GlassCard 14dp padding :
    Row :
      [dot 8dp couleur type] [12dp]
      Column :
        [nom titleSmall w600]
        [effectif + type en labelSmall alpha0.45]
      [spacer]
      Column align end :
        [valeur cle en titleSmall w700 primary]
        [chip statut — "Actif" vert / "Termine" gris]

  Gap entre cards : 8dp
```

### 6.6 Detail d'un lot

```
Fond ivory
AppBar ivory : titre = nom du lot + menu 3 dots (cloturer)

Scroll :
  [Card resume — GlassCard] :
    Row : type icon + nom
    Row 2x2 : effectif | mortalite | ponte/j | jours restants
  [16dp]
  [Section "Actions"] :
    3 boutons horizontaux : Saisie du jour | Historique | Incubation
    Style : GlassCard 80x80dp, icone + label en dessous
  [16dp]
  [Section "Derniere saisie"] :
    Card avec les donnees du jour (ou "Aucune saisie aujourd'hui")
```

### 6.7 Saisie quotidienne

**ECRAN CRITIQUE** — doit prendre < 30 secondes

```
Fond ivory
AppBar : "Saisie du jour" + date

Scroll :
  [Nom du lot en titre]
  [16dp]

  Pour lot reproducteur/pondeuse :
    [compteur Oeufs pondus — gros +/- buttons, chiffre au centre 36px]
    [12dp]
    [compteur Oeufs casses]
    [12dp]
    [ligne "Oeufs collectes" = auto calcul, en vert]
    [16dp]
    [compteur Mortalite + dropdown cause]
    [16dp]
    [champ Aliment consomme (kg) — clavier numerique]
    [16dp]
    [champ Notes — optionnel, 2 lignes]
    [24dp]
    [bouton "Enregistrer" primary]

  Le compteur +/- :
    Row : [bouton - cercle 44dp blanc bordure] [chiffre 36px w700 centre 80dp large] [bouton + cercle 44dp primary]
    Hauteur totale : 56dp
```

### 6.8 Finances (avec tabs)

```
Fond ivory
AppBar : "Finances"
TabBar : Resume | Depenses | Ventes | Creances
  Style tabs : pas de Material TabBar — utiliser des chips/pills horizontaux
  Actif : fond primary alpha0.12 + texte primary w600
  Inactif : texte night alpha0.45

Tab Resume :
  [Card revenus/depenses/net/marge — chiffres alignes a droite]
  [barres horizontales revenus par produit]
  [barres horizontales depenses par categorie]

Tab Depenses :
  [liste de cards avec categorie, description, montant, date]
  [FAB ou bouton flottant "+" en bas a droite pour ajouter]

Tab Ventes :
  [idem]

Tab Creances :
  [liste des impayees avec montant du, client, date]
```

### 6.9 Profil

```
Fond ivory
Scroll :
  [Card profil — avatar + nom + telephone]
  [16dp]
  [Liste de menus — chaque item = GlassCard] :
    Equipe        → team_screen
    Rapports      → reports_screen
    Parametres    → settings_screen
    [separateur 16dp]
    Deconnexion   → rouge, confirmer

  Chaque menu item :
    Row : [cercle 32dp primary alpha0.08 + icone outlined] [12dp] [label titleSmall] [spacer] [chevron_right alpha0.25]
    Hauteur : 56dp
    Pas de bordure entre les items — juste du spacing
```

### 6.10 Formulaires (create expense, sale, flock, customer, order)

**Pattern universel** :
```
Fond ivory
AppBar : titre + X pour fermer (pas fleche retour, c'est une modal logiquement)
Scroll :
  [champs empiles, gap 12dp entre chaque]
  [24dp]
  [bouton primary "Enregistrer" full width]
  [16dp bottom]

Dropdowns : utiliser un DropdownButtonFormField avec decoration identique aux TextFields
Dates : utiliser showDatePicker Material
```

---

## 7. Icones

### Regles
- **TOUTES les icones sont outlined** (jamais filled) — Icons.xxx_outlined
- PAS d'icones custom ou de packages d'icones — Material Icons uniquement
- PAS d'emoji, PAS d'illustration

### Mapping des icones par feature
```
Dashboard     : home_outlined
Elevage/Lots  : egg_outlined
Finances      : account_balance_wallet_outlined
Profil        : person_outlined
Notifications : notifications_outlined
Oeufs         : egg_outlined
Effectif      : pets_outlined
Mortalite     : trending_down_outlined (pas skull)
Aliment       : restaurant_outlined
Poids         : scale_outlined (ou monitor_weight_outlined)
Couveuse      : device_thermostat_outlined
Vaccination   : vaccines_outlined (ou medical_services_outlined)
Clients       : people_outlined
Commandes     : shopping_bag_outlined
Stocks        : inventory_2_outlined
Rapports      : assessment_outlined
Parametres    : settings_outlined
Equipe        : group_outlined
Deconnexion   : logout_outlined
Ajouter       : add (dans le FAB uniquement)
Fermer        : close_outlined
Retour        : arrow_back_outlined
Menu          : more_vert
Copier        : content_copy_outlined
Partager      : share_outlined
Filtrer       : filter_list_outlined
Rechercher    : search_outlined
Alerte haute  : warning_outlined
Alerte basse  : info_outlined
Tendance +    : trending_up_outlined
Tendance -    : trending_down_outlined
```

### Logo
- `assets/logo.png` (coq seul) : utilise dans la member card coin haut-gauche (20x20dp) et dans les pages intro onboarding (80x80dp)
- `assets/logo_full.png` (coq + texte) : utilise UNIQUEMENT dans le splash (200dp) et la page connexion (180dp)
- PAS d'autres images/illustrations

---

## 8. Transitions & Animations

### Navigation
```
Bottom nav tabs    : NoTransition (instantane)
Push vers detail   : SlideTransition right-to-left, 300ms, easeOutCubic
Push vers creation : SlideTransition bottom-to-top, 300ms, easeOutCubic (modal-like)
Pop (retour)       : reverse du push
Bottom sheet       : slide up Material default
```

### Micro-interactions
```
Bouton press  : Material InkWell ripple (deja par defaut)
Card press    : scale 0.98 + opacity 0.8, 100ms
Pull to refresh : Material RefreshIndicator, couleur primary
Compteur +/-  : pas d'animation, changement instantane (c'est un outil de travail)
Dots onboarding : AnimatedContainer width 24<->8, 300ms
```

### PAS d'animations
- Pas de fade-in sur le chargement des listes — skeleton shimmer OU affichage direct
- Pas de hero animation
- Pas de parallax
- Pas de lottie/rive

---

## 9. Responsive & Adaptations

### Ecran cible : 360x800dp (5.5 pouces)
- Minimum supporte : 320dp large (Galaxy A01 Core)
- Maximum supporte : 428dp large (iPhone 14 Pro Max)
- PAS de layout tablette — c'est une app mobile

### Regles
- Padding horizontal FIXE a 16dp — les cards s'adaptent en largeur
- Les KPI cards sont toujours 2 par row — jamais 1 ni 3
- Les FlockMiniCards dans le scroll horizontal ont une largeur FIXE de 160dp
- Les textes longs ont TOUJOURS maxLines + overflow: ellipsis
- Le bottom nav est FIXE — pas de hide on scroll

### Web (debug Chrome)
- Contraindre la largeur max a 428dp (iPhone size) avec un Container centre
- Fond gris autour pour simuler le device

---

## 10. Checklist qualite avant chaque ecran

- [ ] Fond ivory #F7F4EE (pas blanc, pas gris Material)
- [ ] Toutes les couleurs de texte sont night (#1D1D1B) avec alpha (pas de grey xxx)
- [ ] Toutes les icones sont outlined
- [ ] Padding horizontal 16dp
- [ ] Cards avec radius 16dp et padding 14dp
- [ ] Boutons 48dp de haut, radius 12dp
- [ ] Champs 52dp de haut, radius 12dp
- [ ] Zones tactiles min 44dp (idealement 48dp)
- [ ] Typo via Theme.of(context).textTheme (pas de fontSize hardcode)
- [ ] Pas d'import inutile
- [ ] Pas d'icone filled
- [ ] Pas de couleur gris Material
- [ ] Logo uniquement via assets/logo.png ou assets/logo_full.png
- [ ] Snackbar apres chaque action
- [ ] Bouton retour sur les ecrans hors bottom nav

---

## 11. Arborescence des ecrans (34 ecrans finaux)

```
Splash → Onboarding (2 intro + 1 connexion)
                    ↓ Inscription → TeamSetup → Dashboard
                    ↓ Connexion → Dashboard

Dashboard (tab 0)
  ├── Notifications
  ├── Flock Detail → Daily Record
  │                → Daily Record History
  │                → Close Flock
  ├── Incubation List → Create Batch
  │                   → Candling
  │                   → Hatch Result
  └── (via FAB) → Create Flock
                → Create Sale
                → Create Expense

Elevage (tab 1)
  ├── Flock Detail (meme que ci-dessus)
  └── Create Flock

Finances (tab 2)
  ├── Financial Report
  ├── Create Expense
  └── Create Sale

Profil (tab 3)
  ├── Team
  ├── Reports
  ├── Settings
  ├── Stocks
  ├── Customers → Customer Detail
  │             → Create Customer
  ├── Orders → Create Order
  ├── Vaccination Calendar
  │   → Protocol List
  └── Logout
```

Profondeur max : 3 niveaux (tab → liste → detail). Jamais plus.
