# SenGuett — Design System & UI/UX

**Version** : 1.0
**Date** : 2026-08-20
**Stack** : Flutter + Material 3
**Base sur** : Design System YobaLema (adapte vert agriculture)

---

## Table des matieres

1. Principes de design
2. Tokens — Couleurs
3. Tokens — Typographie
4. Tokens — Espacement & Formes
5. Tokens — Ombres & Elevations
6. Composants
7. Navigation
8. Ecrans — Dashboard
9. Ecrans — Elevage
10. Ecrans — Finances
11. Ecrans — Communs (Auth, Onboarding, Settings)
12. Ecrans — Stock, Clients, Commandes, Rapports
13. Icones & Illustrations
14. Animations & Micro-interactions
15. Accessibilite
16. Formatage
17. Responsive & Dark mode

---

## 1. Principes de design

### 1.1 Vision

SenGuett doit etre **l'outil le plus simple et le plus rapide pour gerer un elevage avicole au Senegal**.
L'interface cible trois qualites :

- **Simplicite** : une seule action principale visible par ecran, formulaires courts, saisie rapide
- **Lisibilite en exterieur** : contraste eleve, couleurs vives, texte large — utilisation en plein soleil dans le poulailler
- **Rapidite de saisie** : enregistrer les donnees du jour (oeufs, mortalite, alimentation) doit prendre moins de 30 secondes

### 1.2 Persona device

La majorite des utilisateurs ont un **Tecno Spark, Infinix Hot ou Samsung Galaxy A-series** (5-6 pouces, Android 12-14, RAM 4-6 Go). Le design est optimise pour :
- Utilisation en plein soleil (contrast ratio eleve, fond clair, couleurs saturees)
- Mains occupees ou sales (gros boutons, zones tactiles larges)
- Connexion 3G variable (offline-first, skeleton loaders, sync en arriere-plan)
- Batterie limitee (pas d'animations lourdes, mode clair uniquement)

### 1.3 Theme

**Mode clair uniquement pour la V1.** Fond blanc + accents vert agriculture + texte sombre.
Mode sombre possible en V2 (economie batterie OLED).

### 1.4 Objectifs UX

| Action | Temps cible |
|--------|-------------|
| Enregistrer les donnees du jour (oeufs + mortalite + alimentation) | < 30 secondes |
| Creer un nouveau lot | < 2 minutes |
| Enregistrer une vente | < 45 secondes |
| Consulter le dashboard | < 5 secondes |
| Ajouter une depense | < 30 secondes |
| Consulter le calendrier vaccinal | < 10 secondes |

---

## 2. Tokens — Couleurs

```dart
// lib/core/constants/app_colors.dart

class AppColors {
  AppColors._();

  // --- PRIMARY (Vert Agriculture) ---
  /// Vert ferme — CTA, highlights, actifs
  static const Color primary = Color(0xFF2E7D32);

  /// Vert fonce — headers, icones selectionnees
  static const Color primaryDark = Color(0xFF1B5E20);

  /// Vert clair — surfaces, arriere-plans teintes
  static const Color primaryLight = Color(0xFFE8F5E9);

  /// Vert pastel — chips, badges
  static const Color primaryContainer = Color(0xFFA5D6A7);

  /// Texte sur fond primary
  static const Color onPrimary = Color(0xFFFFFFFF);

  // --- ACCENT (Terre chaude) ---
  /// Brun terre — accents secondaires, liens, icones specifiques
  static const Color accent = Color(0xFF8D6E63);

  /// Brun fonce — texte accent
  static const Color accentDark = Color(0xFF5D4037);

  /// Brun clair — fond accent
  static const Color accentLight = Color(0xFFEFEBE9);

  /// Brun pastel — chips accent
  static const Color accentContainer = Color(0xFFD7CCC8);

  // --- NEUTRAL ---
  /// Noir SenGuett — textes principaux
  static const Color black = Color(0xFF1B2E1C);

  /// Gris 900
  static const Color grey900 = Color(0xFF212121);

  /// Gris fonce — textes secondaires
  static const Color grey700 = Color(0xFF424242);

  /// Gris 600
  static const Color grey600 = Color(0xFF616161);

  /// Gris 500
  static const Color grey500 = Color(0xFF757575);

  /// Gris moyen — placeholders, dividers
  static const Color grey400 = Color(0xFF9E9E9E);

  /// Gris 300
  static const Color grey300 = Color(0xFFBDBDBD);

  /// Gris clair
  static const Color grey200 = Color(0xFFEEEEEE);

  /// Gris arriere-plan
  static const Color grey100 = Color(0xFFF5F5F5);

  /// Gris 50
  static const Color grey50 = Color(0xFFFAFAFA);

  /// Blanc pur — surface principale
  static const Color white = Color(0xFFFFFFFF);

  // --- SEMANTIC ---
  /// Succes (lot sain, vente confirmee)
  static const Color success = Color(0xFF388E3C);
  static const Color successLight = Color(0xFFE8F5E9);

  /// Erreur (mortalite elevee, stock epuise)
  static const Color error = Color(0xFFD32F2F);
  static const Color errorLight = Color(0xFFFFEBEE);

  /// Avertissement (vaccin a venir, stock faible)
  static const Color warning = Color(0xFFF57F17);
  static const Color warningLight = Color(0xFFFFF8E1);

  /// Info (notification neutre)
  static const Color info = Color(0xFF0277BD);
  static const Color infoLight = Color(0xFFE1F5FE);

  // --- SURFACE ---
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color divider = Color(0xFFE0E0E0);

  // --- FLOCK STATUS CHIPS ---
  /// Lot actif (production en cours)
  static const Color flockActive = Color(0xFF388E3C);
  static const Color flockActiveLight = Color(0xFFE8F5E9);

  /// Lot en incubation
  static const Color flockIncubating = Color(0xFFF57F17);
  static const Color flockIncubatingLight = Color(0xFFFFF8E1);

  /// Lot en croissance (poussins/poulets en elevage)
  static const Color flockGrowing = Color(0xFF0277BD);
  static const Color flockGrowingLight = Color(0xFFE1F5FE);

  /// Lot termine/vendu
  static const Color flockCompleted = Color(0xFF9E9E9E);
  static const Color flockCompletedLight = Color(0xFFF5F5F5);

  /// Lot en alerte (mortalite, maladie)
  static const Color flockAlert = Color(0xFFD32F2F);
  static const Color flockAlertLight = Color(0xFFFFEBEE);

  /// Lot en pause
  static const Color flockPaused = Color(0xFF8D6E63);
  static const Color flockPausedLight = Color(0xFFEFEBE9);

  // --- ROLE CHIPS (2 rôles uniquement) ---
  static const Color roleOwner = Color(0xFF1B5E20);    // Proprietaire
  static const Color roleMember = Color(0xFF0277BD);   // Membre

  // --- POULTRY TYPE COLORS ---
  /// Goliath — rouge brun (reproducteurs)
  static const Color typeGoliath = Color(0xFFC62828);

  /// Pondeuses — jaune dore (oeufs)
  static const Color typeLayers = Color(0xFFF9A825);

  /// Poulets de chair — orange (viande)
  static const Color typeBroilers = Color(0xFFEF6C00);

  /// Cailles — violet gris
  static const Color typeQuails = Color(0xFF6A1B9A);
}
```

### 2.1 Palette visuelle

```
PRIMARY (Vert Agriculture)
 ████  #2E7D32  primary          — Boutons CTA, switch actif, bottom nav
 ████  #1B5E20  primaryDark      — App bar, icones selectionnees
 ████  #E8F5E9  primaryLight     — Fond chips, fond cards actives
 ████  #A5D6A7  primaryContainer — Badges, tags

ACCENT (Terre chaude)
 ████  #8D6E63  accent           — Accents secondaires, liens
 ████  #5D4037  accentDark       — Texte accent
 ████  #EFEBE9  accentLight      — Fond accent
 ████  #D7CCC8  accentContainer  — Chips accent

NEUTRAL
 ████  #1B2E1C  black            — Texte H1, logo, nav bar
 ████  #424242  grey700          — Texte body, labels
 ████  #9E9E9E  grey400          — Placeholder, dividers
 ████  #F5F5F5  grey100          — Background screens
 ████  #FFFFFF  white            — Surface cards

SEMANTIC
 ████  #388E3C  success          — Lot sain, vente confirmee
 ████  #D32F2F  error            — Mortalite elevee, stock epuise
 ████  #F57F17  warning          — Vaccin a venir, stock faible
 ████  #0277BD  info             — Notifications neutres

FLOCK STATUS
 ████  #388E3C  flockActive      — En production
 ████  #F57F17  flockIncubating  — En incubation
 ████  #0277BD  flockGrowing     — En croissance
 ████  #9E9E9E  flockCompleted   — Termine/vendu
 ████  #D32F2F  flockAlert       — Alerte sante
 ████  #8D6E63  flockPaused      — En pause

POULTRY TYPES
 ████  #C62828  typeGoliath       — Reproducteurs Goliath
 ████  #F9A825  typeLayers        — Pondeuses
 ████  #EF6C00  typeBroilers      — Poulets de chair
 ████  #6A1B9A  typeQuails        — Cailles
```

---

## 3. Tokens — Typographie

```dart
// lib/core/constants/app_typography.dart

import 'package:google_fonts/google_fonts.dart';

class AppTypography {
  AppTypography._();

  // Police principale : Inter (bonne lisibilite, support multilingue)
  // Utilisee aussi par GP Connect

  static TextTheme get textTheme => GoogleFonts.interTextTheme().copyWith(
    // --- DISPLAY ---
    displayLarge: GoogleFonts.inter(
      fontSize: 32, fontWeight: FontWeight.w700,
      color: AppColors.black, letterSpacing: -0.5,
    ),
    displayMedium: GoogleFonts.inter(
      fontSize: 28, fontWeight: FontWeight.w700,
      color: AppColors.black,
    ),

    // --- HEADLINES ---
    headlineLarge: GoogleFonts.inter(
      fontSize: 24, fontWeight: FontWeight.w700,
      color: AppColors.black,
    ),
    headlineMedium: GoogleFonts.inter(
      fontSize: 20, fontWeight: FontWeight.w600,
      color: AppColors.black,
    ),
    headlineSmall: GoogleFonts.inter(
      fontSize: 18, fontWeight: FontWeight.w600,
      color: AppColors.black,
    ),

    // --- TITLES ---
    titleLarge: GoogleFonts.inter(
      fontSize: 16, fontWeight: FontWeight.w600,
      color: AppColors.black,
    ),
    titleMedium: GoogleFonts.inter(
      fontSize: 14, fontWeight: FontWeight.w600,
      color: AppColors.black,
    ),
    titleSmall: GoogleFonts.inter(
      fontSize: 12, fontWeight: FontWeight.w600,
      color: AppColors.grey700,
    ),

    // --- BODY ---
    bodyLarge: GoogleFonts.inter(
      fontSize: 16, fontWeight: FontWeight.w400,
      color: AppColors.black, height: 1.5,
    ),
    bodyMedium: GoogleFonts.inter(
      fontSize: 14, fontWeight: FontWeight.w400,
      color: AppColors.grey700, height: 1.5,
    ),
    bodySmall: GoogleFonts.inter(
      fontSize: 12, fontWeight: FontWeight.w400,
      color: AppColors.grey400,
    ),

    // --- LABELS ---
    labelLarge: GoogleFonts.inter(
      fontSize: 14, fontWeight: FontWeight.w600,
      color: AppColors.white, letterSpacing: 0.2,
    ),
    labelMedium: GoogleFonts.inter(
      fontSize: 12, fontWeight: FontWeight.w500,
      color: AppColors.grey700,
    ),
    labelSmall: GoogleFonts.inter(
      fontSize: 10, fontWeight: FontWeight.w500,
      color: AppColors.grey400, letterSpacing: 0.5,
    ),
  );

  // Montants FCFA — chiffres tabulaires pour l'alignement
  static TextStyle get fcfaLarge => GoogleFonts.inter(
    fontSize: 28, fontWeight: FontWeight.w700,
    color: AppColors.black,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static TextStyle get fcfaMedium => GoogleFonts.inter(
    fontSize: 18, fontWeight: FontWeight.w700,
    color: AppColors.black,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static TextStyle get fcfaSmall => GoogleFonts.inter(
    fontSize: 14, fontWeight: FontWeight.w600,
    color: AppColors.primary,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  // Compteurs grands (oeufs du jour, mortalite)
  static TextStyle get counterLarge => GoogleFonts.inter(
    fontSize: 36, fontWeight: FontWeight.w800,
    color: AppColors.primary,
    fontFeatures: [FontFeature.tabularFigures()],
  );

  static TextStyle get counterMedium => GoogleFonts.inter(
    fontSize: 24, fontWeight: FontWeight.w700,
    color: AppColors.black,
    fontFeatures: [FontFeature.tabularFigures()],
  );
}
```

### 3.1 Correspondance avec les usages

| Usage | Taille | Poids | TextTheme |
|-------|--------|-------|-----------|
| Titre principal ecran | 28px | Bold | `displayMedium` |
| Titre section | 24px | Bold | `headlineLarge` |
| Sous-titre | 18px | SemiBold | `headlineSmall` |
| Texte normal | 16px | Regular | `bodyLarge` |
| Texte secondaire | 14px | Regular | `bodyMedium` |
| Petit texte | 12px | Regular | `bodySmall` |
| Compteur oeufs/mortalite | 36px | ExtraBold | `counterLarge` |
| Montant FCFA hero | 28px | Bold | `fcfaLarge` |

---

## 4. Tokens — Espacement & Formes

```dart
// lib/core/constants/app_dimensions.dart

class AppDimensions {
  AppDimensions._();

  // --- SPACING (grille 4px, base 8px) ---
  static const double space2  = 2.0;
  static const double space4  = 4.0;
  static const double space6  = 6.0;
  static const double space8  = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;
  static const double space40 = 40.0;
  static const double space48 = 48.0;
  static const double space64 = 64.0;

  // --- BORDER RADIUS ---
  static const double radiusXs  = 4.0;
  static const double radiusSm  = 8.0;
  static const double radiusMd  = 12.0;
  static const double radiusLg  = 16.0;
  static const double radiusXl  = 24.0;
  static const double radiusFull = 100.0;   // Boutons pills, avatars

  // --- ICON SIZES ---
  static const double iconSm = 16.0;
  static const double iconMd = 20.0;
  static const double iconLg = 24.0;
  static const double iconXl = 32.0;
  static const double iconXxl = 48.0;

  // --- TOUCH TARGETS ---
  static const double touchMin = 48.0;    // WCAG minimum — agrandi pour mains sales/gantees

  // --- COMPONENTS ---
  static const double buttonHeight     = 52.0;
  static const double buttonHeightSm   = 40.0;
  static const double inputHeight      = 56.0;
  static const double avatarSm         = 36.0;
  static const double avatarMd         = 48.0;
  static const double avatarLg         = 64.0;
  static const double avatarXl         = 96.0;
  static const double bottomNavHeight  = 72.0;
  static const double appBarHeight     = 56.0;
  static const double cardElevation    = 2.0;

  // --- FARM-SPECIFIC COMPONENTS ---
  static const double flockCardHeight      = 140.0;
  static const double dailyEntryCardHeight = 120.0;
  static const double incubationCardHeight = 160.0;
  static const double statCardHeight       = 100.0;
  static const double stockCardHeight      = 80.0;
  static const double walletCardHeight     = 120.0;
  static const double alertCardHeight      = 72.0;
  static const double timelineNodeSize     = 32.0;
  static const double timelineLineWidth    = 2.0;
  static const double progressBarHeight    = 8.0;
  static const double quickActionSize      = 64.0;
  static const double counterInputSize     = 56.0;

  // --- SCREEN PADDING ---
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(
    horizontal: 16.0,
    vertical: 16.0,
  );
  static const EdgeInsets screenPaddingH = EdgeInsets.symmetric(horizontal: 16.0);
}
```

---

## 5. Tokens — Ombres & Elevations

```dart
// lib/core/constants/app_shadows.dart

class AppShadows {
  AppShadows._();

  static const BoxShadow sm = BoxShadow(
    color: Color(0x0D000000),
    blurRadius: 4, offset: Offset(0, 2),
  );

  static const BoxShadow md = BoxShadow(
    color: Color(0x1A000000),
    blurRadius: 8, offset: Offset(0, 4),
  );

  static const BoxShadow lg = BoxShadow(
    color: Color(0x26000000),
    blurRadius: 16, offset: Offset(0, 8),
  );

  // Bottom sheet shadow (remonte depuis le bas)
  static const BoxShadow bottomSheet = BoxShadow(
    color: Color(0x33000000),
    blurRadius: 24, offset: Offset(0, -8),
  );

  // Card active / selectionnee (halo vert)
  static const BoxShadow activeGlow = BoxShadow(
    color: Color(0x332E7D32),
    blurRadius: 12, offset: Offset(0, 4),
  );
}
```

---

## 6. Composants

### 6.1 SgButton

```dart
// Bouton principal — CTA vert agriculture
SgButton(
  label: 'Enregistrer',
  onPressed: () {},
)

// Bouton secondaire — outline vert
SgButton.outlined(
  label: 'Voir le lot',
  onPressed: () {},
)

// Bouton danger
SgButton.danger(
  label: 'Supprimer le lot',
  onPressed: () {},
)

// Bouton loading
SgButton(
  label: 'Enregistrement...',
  isLoading: true,
  onPressed: null,
)

// Bouton accent (brun)
SgButton.accent(
  label: 'Ajouter un client',
  onPressed: () {},
)
```

**Specifications :**
- Hauteur : 52px, border-radius : 12px
- Primary : fond `#2E7D32`, texte blanc, fontWeight 600
- Outlined : bordure 2px `#2E7D32`, fond transparent, texte vert
- Danger : fond `#D32F2F`, texte blanc
- Accent : fond `#8D6E63`, texte blanc
- Loading : spinner blanc centre, bouton non-cliquable
- Disabled : opacite 40%, non-cliquable

---

### 6.2 SgTextField

```dart
SgTextField(
  label: 'Nombre d\'oeufs',
  hint: 'Ex: 120',
  prefixIcon: LucideIcons.egg,
  keyboardType: TextInputType.number,
  controller: controller,
  validator: (v) => v!.isEmpty ? 'Champ requis' : null,
)
```

**Specifications :**
- Hauteur : 56px, border-radius : 12px
- Bordure repos : `#E0E0E0` (1px)
- Bordure focus : `#2E7D32` (2px)
- Bordure erreur : `#D32F2F` (2px)
- Label flottant (Material 3 style)
- Icone prefixe : 20px, couleur `#9E9E9E`
- Variante numerique : clavier numerique avec boutons +/- integres

---

### 6.3 SgCard

```dart
SgCard(
  child: Column(...),
  onTap: () {},
)
```

**Specifications :**
- Fond blanc, border-radius 16px, bordure `grey200` 1px
- Padding interne 16px
- Ombre : `sm` par defaut
- Variante active : bordure `primary` 2px + ombre `activeGlow`

---

### 6.4 SgFlockCard

Carte principale pour afficher un lot d'elevage.

```
+---------------------------------------------+
|  [Icone type]  Lot Pondeuses #3   [Active]  |
|               200 sujets                     |
|  -------------------------------------------+
|  Oeufs/j  Mortalite  Age    Alim/j          |
|  142      0.5%       18s    35 kg            |
|  -------------------------------------------+
|  Derniere saisie : Aujourd'hui 08:30        |
|                           [ Saisir >]       |
+---------------------------------------------+
```

**Specifications :**
- Fond blanc, border-radius 16px, bordure 1px `grey200`
- Icone type en couleur (`typeLayers` jaune pour pondeuses, etc.)
- StatusChip en haut a droite
- 4 mini-stats en ligne horizontale
- Bouton "Saisir" primaire en bas a droite
- Tap sur la carte → navigation vers le detail du lot
- Hauteur : ~140px

---

### 6.5 SgDailyEntryCard

Carte de saisie journaliere rapide.

```
+---------------------------------------------+
|  Saisie du jour — 20 aout 2026              |
|  Lot Pondeuses #3                           |
|  -------------------------------------------+
|                                              |
|  Oeufs         Mortalite       Alimentation  |
|  [  -  142  +] [  -   1  +]   [  -  35  +]  |
|                                     kg       |
|  -------------------------------------------+
|  Note : RAS                    [ Modifier ]  |
|  -------------------------------------------+
|  [     Enregistrer la saisie     ]          |
+---------------------------------------------+
```

**Specifications :**
- Fond blanc, border-radius 16px
- 3 compteurs avec boutons +/- (zone tactile 48x48px chacun)
- Valeur centrale en `counterMedium` (24px bold)
- Unite affichee sous chaque compteur
- Champ note optionnel (1 ligne)
- Bouton enregistrer pleine largeur
- Hauteur : ~120px (compact, sans bouton)

---

### 6.6 SgIncubationCard

Carte pour un lot d'incubation.

```
+---------------------------------------------+
|  [Oeuf]  Lot Incubation #7     [J12 / 21]  |
|          Goliath — 350 oeufs                |
|  -------------------------------------------+
|  Fertiles  Eclos   Morts   Taux eclosion    |
|  320       —       12      —                |
|  -------------------------------------------+
|  [==========>............]  57%              |
|  Eclosion prevue : 28 aout 2026             |
|  -------------------------------------------+
|  Prochain mirage : dans 2 jours             |
+---------------------------------------------+
```

**Specifications :**
- Fond blanc, border-radius 16px
- Badge jour (J12/21) en `warning` (orange)
- Barre de progression verte avec pourcentage
- Stats en grille 4 colonnes
- Rappel prochain mirage en bas
- Hauteur : ~160px

---

### 6.7 SgStockCard

Carte pour un article en stock.

```
+---------------------------------------------+
|  [Icone]  Aliment Pondeuse P2    [Faible]   |
|           Stock : 120 kg                     |
|           Seuil alerte : 50 kg              |
|  -------------------------------------------+
|  [=========>.....]  60%                     |
|  Derniere entree : 15 aout (+500 kg)        |
+---------------------------------------------+
```

**Specifications :**
- Fond blanc, border-radius 16px
- Icone selon la categorie (alimentation, medicament, materiel)
- Chip "Faible" en warning si sous seuil, "Epuise" en error si 0
- Barre de progression coloree selon niveau
- Hauteur : ~80px

---

### 6.8 SgWalletCard

Carte resumee des finances.

```
+---------------------------------------------+
|  Finances du mois         [Aout 2026]       |
|  -------------------------------------------+
|                                              |
|  Revenus           Depenses                  |
|  +850 000 FCFA     -420 000 FCFA             |
|                                              |
|  Balance                                     |
|  430 000 FCFA                                |
|  -------------------------------------------+
|  Dettes en cours : 75 000 FCFA              |
|  [ Voir les details ]                       |
+---------------------------------------------+
```

**Specifications :**
- Fond `primaryLight` (#E8F5E9), border-radius 16px
- Montants en `fcfaLarge` pour la balance
- Revenus en vert `success`, depenses en rouge `error`
- Dettes en `warning`
- Hauteur : ~120px

---

### 6.9 SgStatusChip

```dart
SgStatusChip(status: FlockStatus.active)      // ● Actif (vert)
SgStatusChip(status: FlockStatus.incubating)  // ● Incubation (orange)
SgStatusChip(status: FlockStatus.growing)     // ● Croissance (bleu)
SgStatusChip(status: FlockStatus.completed)   // ✓ Termine (gris)
SgStatusChip(status: FlockStatus.alert)       // ⚠ Alerte (rouge)
SgStatusChip(status: FlockStatus.paused)      // ● En pause (brun)
```

**Specifications :**
- Fond colore clair, texte colore fonce
- Border-radius `radiusFull` (pill)
- Padding horizontal 12px, vertical 4px
- Police `labelMedium` (12px w500)
- Icone circulaire 6px avant le texte

| Statut | Fond | Texte |
|--------|------|-------|
| Actif | `flockActiveLight` | `flockActive` |
| Incubation | `flockIncubatingLight` | `flockIncubating` |
| Croissance | `flockGrowingLight` | `flockGrowing` |
| Termine | `flockCompletedLight` | `flockCompleted` |
| Alerte | `flockAlertLight` | `flockAlert` |
| En pause | `flockPausedLight` | `flockPaused` |

---

### 6.10 SgAlertCard

Carte d'alerte contextuelle.

```
+---------------------------------------------+
|  [!]  Vaccination J14 dans 2 jours          |
|       Lot Pondeuses #3 — Newcastle          |
|                            [ Voir > ]       |
+---------------------------------------------+
```

```
+---------------------------------------------+
|  [!]  Mortalite anormale detectee            |
|       Lot Chair #2 — 5 morts aujourd'hui    |
|                            [ Agir > ]       |
+---------------------------------------------+
```

**Specifications :**
- Fond `warningLight` ou `errorLight` selon gravite
- Bordure gauche 4px en couleur correspondante
- Icone d'alerte (triangle ou cloche)
- Texte descriptif + lien d'action
- Hauteur : ~72px

---

### 6.11 SgStatCard

Mini-carte pour une statistique du dashboard.

```
+------------------+
|  Oeufs/j         |
|  142              |
|  ▲ +5 vs hier    |
+------------------+
```

```
+------------------+
|  Mortalite       |
|  0.5%            |
|  ▼ stable        |
+------------------+
```

**Specifications :**
- Fond blanc, border-radius 12px, bordure `grey200` 1px
- Label en `bodySmall` (12px)
- Valeur en `counterMedium` (24px bold)
- Tendance : fleche verte (amelioration) ou rouge (degradation)
- Grille 2x2 sur le dashboard
- Hauteur : ~100px

---

### 6.12 SgProgressBar

```dart
SgProgressBar(
  value: 0.57,
  label: 'Incubation J12/21',
  color: AppColors.primary,
)
```

**Specifications :**
- Hauteur : 8px, border-radius `radiusFull`
- Fond : `grey200`
- Remplissage : couleur parametrable (defaut `primary`)
- Label optionnel au-dessus
- Pourcentage optionnel a droite

---

### 6.13 SgTimeline

Timeline verticale pour le suivi d'un lot d'incubation.

```
  ● J1 — Mise en couveuse
  |  350 oeufs — 20 aout 2026
  |
  ● J7 — Premier mirage
  |  320 fertiles, 30 retires
  |
  ◌ J14 — Deuxieme mirage (dans 2j)
  |
  ◌ J18 — Transfert eclosoir
  |
  ◌ J21 — Eclosion prevue
```

**Specifications :**
- Noeuds circulaires 32px
- Noeud passe : fond `primary`, icone check blanc
- Noeud courant : bordure `primary` 2px, fond blanc, pulse animation
- Noeud futur : fond `grey200`, bordure `grey300`
- Ligne verticale 2px `grey300` entre les noeuds
- Texte : titre en `titleMedium`, detail en `bodySmall`

---

### 6.14 SgBottomSheet

```
+=============================================+
|  ─────  (poignee drag 40x4px)               |
|                                              |
|  [Contenu du bottom sheet]                   |
|                                              |
|  [     Bouton action     ]                   |
+=============================================+
```

**Specifications :**
- Fond blanc, coins arrondis haut 24px
- Poignee drag en haut (40x4px, gris `grey300`)
- Padding 16px
- Ombre `bottomSheet`
- Utilise pour : choix du lot, filtre de dates, confirmation d'actions

---

### 6.15 SgDialog

```dart
SgDialog(
  title: 'Supprimer ce lot ?',
  description: 'Cette action est irreversible. Toutes les donnees seront perdues.',
  confirmLabel: 'Supprimer',
  confirmStyle: SgButtonStyle.danger,
  cancelLabel: 'Annuler',
  onConfirm: () {},
)
```

**Specifications :**
- Fond blanc, border-radius 16px
- Titre en `headlineSmall` (18px semibold)
- Description en `bodyMedium` (14px)
- Deux boutons : Annuler (ghost) + Confirmer (primary ou danger)
- Overlay sombre 50% opacite

---

### 6.16 SgSnackbar

```dart
SgSnackbar.success('Saisie enregistree avec succes');
SgSnackbar.error('Erreur de synchronisation');
SgSnackbar.info('Synchronisation en cours...');
SgSnackbar.warning('Stock aliment faible');
```

**Specifications :**
- Fond noir (`black`), texte blanc
- Border-radius 12px
- Position bas d'ecran (floating, au-dessus de la bottom nav)
- Duree 3 secondes
- Icone de couleur semantique a gauche

---

### 6.17 SgSkeleton

```dart
SgSkeleton.flockCard()      // Simule une SgFlockCard
SgSkeleton.dailyEntry()     // Simule une SgDailyEntryCard
SgSkeleton.statCard()       // Simule une SgStatCard
SgSkeleton.listItem()       // Pour les listes generiques
```

**Specifications :**
- Package `shimmer`
- Effet de brillance horizontale sur fond `grey200`
- Meme dimensions que le composant simule
- Utilise partout pendant le chargement ou la synchronisation

---

### 6.18 SgEmptyState

```dart
SgEmptyState(
  icon: LucideIcons.egg,
  title: 'Aucun lot en cours',
  subtitle: 'Creez votre premier lot pour commencer le suivi',
  action: SgButton(label: 'Creer un lot', onPressed: () {}),
)
```

```
+---------------------------+
|                           |
|    [Illustration]         |
|                           |
|    Aucun lot en cours     |
|    Creez votre premier    |
|    lot pour commencer     |
|                           |
|    [ Creer un lot ]       |
|                           |
+---------------------------+
```

**Specifications :**
- Centre verticalement dans la zone disponible
- Illustration ou icone grande (48px)
- Titre en `headlineSmall` (18px)
- Sous-titre en `bodyMedium` (14px, gris)
- Bouton d'action primaire optionnel

---

### 6.19 SgAvatar

```dart
SgAvatar(
  imageUrl: 'https://...',
  size: SgAvatarSize.md,  // 48px
  fallbackInitials: 'MD',
)
```

**Specifications :**
- Rond, tailles : 36px (sm), 48px (md), 64px (lg), 96px (xl)
- Image avec `cached_network_image`
- Fallback : initiales sur fond `primaryLight`
- Bordure optionnelle pour le proprietaire (2px `primary`)

---

### 6.20 SgRoleChip

```dart
SgRoleChip(role: TeamRole.owner)     // Proprietaire (vert fonce)
SgRoleChip(role: TeamRole.member)    // Membre (bleu)
```

**Specifications :**
- Pill (radiusFull), padding 8x4px
- Fond clair de la couleur du role, texte fonce
- Police `labelSmall` (10px)

| Role | Couleur | Label |
|------|---------|-------|
| Owner | `roleOwner` (#1B5E20) | Proprietaire |
| Member | `roleMember` (#0277BD) | Membre |

Seule difference : le Proprietaire a un badge distinct pour identifier qui gere les membres de l'equipe.

---

## 7. Navigation

### 7.1 Architecture de navigation (go_router)

```
/                               → SplashScreen
/onboarding                     → OnboardingScreen (3 slides)
/auth/phone                     → PhoneInputScreen
/auth/otp                       → OtpVerificationScreen
/auth/team-choice               → TeamChoiceScreen (creer ou rejoindre)
/auth/team-create               → TeamCreateScreen
/auth/team-join                  → TeamJoinScreen (code invitation)
/auth/profile-setup             → ProfileSetupScreen
/auth/config-wizard             → InitialConfigWizardScreen (type elevage, etc.)

── DASHBOARD ──
/dashboard                      → DashboardScreen (home)
/dashboard/notifications        → NotificationsScreen

── ELEVAGE ──
/flocks                         → FlockListScreen
/flocks/create                  → FlockCreateScreen
/flocks/:id                     → FlockDetailScreen
/flocks/:id/daily               → DailyEntryScreen (saisie du jour)
/flocks/:id/daily/:date         → DailyEntryDetailScreen
/flocks/:id/history             → FlockHistoryScreen (graphiques)
/incubation                     → IncubationListScreen
/incubation/create              → IncubationCreateScreen
/incubation/:id                 → IncubationDetailScreen (timeline)
/incubation/:id/mirage          → MirageEntryScreen
/vaccination                    → VaccinationCalendarScreen
/vaccination/:id                → VaccinationDetailScreen

── FINANCES ──
/finances                       → FinancialSummaryScreen
/finances/expenses              → ExpensesListScreen
/finances/expenses/create       → ExpenseCreateScreen
/finances/sales                 → SalesListScreen
/finances/sales/create          → SaleCreateScreen
/finances/debts                 → DebtsListScreen
/finances/debts/create          → DebtCreateScreen
/finances/debts/:id             → DebtDetailScreen
/finances/reports               → FinancialReportsScreen

── STOCK ──
/stock                          → StockListScreen
/stock/create                   → StockItemCreateScreen
/stock/:id                      → StockItemDetailScreen
/stock/:id/entry                → StockEntryScreen (entree/sortie)

── CLIENTS ──
/clients                        → ClientListScreen
/clients/create                 → ClientCreateScreen
/clients/:id                    → ClientDetailScreen

── COMMANDES ──
/orders                         → OrdersListScreen
/orders/create                  → OrderCreateScreen
/orders/:id                     → OrderDetailScreen

── RAPPORTS ──
/reports                        → ReportsScreen
/reports/export                 → ExportScreen

── PROFIL ──
/profile                        → ProfileScreen
/profile/edit                   → ProfileEditScreen
/profile/team                   → TeamManagementScreen
/profile/team/members           → MembersListScreen
/profile/team/members/invite    → InviteMemberScreen
/profile/settings               → SettingsScreen
/profile/settings/notifications → NotificationSettingsScreen
```

### 7.2 Bottom Navigation Bar

```
[ Dashboard ] [ Elevage ] [ Finances ] [ Profil ]
     Home        Egg         Wallet      User
```

4 onglets (pas 5 — plus simple, adapte au contexte agricole) :

| Onglet | Icone | Route |
|--------|-------|-------|
| Dashboard | `LucideIcons.layoutDashboard` | `/dashboard` |
| Elevage | `LucideIcons.egg` | `/flocks` |
| Finances | `LucideIcons.wallet` | `/finances` |
| Profil | `LucideIcons.user` | `/profile` |

**Specifications :**
- Hauteur : 72px + safe area
- Fond blanc, bordure top `#E0E0E0` 1px
- Icone + label en dessous (11px Inter w600)
- Selectionne : vert `#2E7D32`, fond rond `#E8F5E9` derriere l'icone
- Non selectionne : gris `#9E9E9E`
- Badge notification sur Dashboard si alertes non lues (rouge, 6px)

---

## 8. Ecrans — Dashboard

### 8.1 Dashboard (Home)

**Objectif :** Vue d'ensemble de l'elevage — stats du jour, alertes, acces rapides.

```
+--------------------------------------------+
|  Bonjour, Moussa               [Avatar]    |
|  Mercredi 20 aout 2026                     |
|  -----------------------------------------+
|                                             |
|  --- Alertes (2) ---------------------------+
|  [!] Vaccination J14 dans 2 jours          |
|      Lot Pondeuses #3 — Newcastle     [>]  |
|  [!] Stock aliment pondeuse faible         |
|      Reste 45 kg (seuil: 50 kg)       [>]  |
|  -----------------------------------------+
|                                             |
|  --- Aujourd'hui ---------------------------+
|  +--------+  +--------+  +--------+        |
|  |Oeufs/j |  |Mort.   |  |Alim.   |        |
|  | 142    |  | 1      |  | 35 kg  |        |
|  | +5     |  | +1     |  | -2 kg  |        |
|  +--------+  +--------+  +--------+        |
|  +--------+                                 |
|  |Ventes  |                                 |
|  | 25000 F|                                 |
|  | +8000  |                                 |
|  +--------+                                 |
|  -----------------------------------------+
|                                             |
|  --- Actions rapides -----------------------+
|  [ Saisie du jour ]  [ Nouvelle vente ]    |
|  [ Ajouter depense ] [ Voir le stock ]     |
|  -----------------------------------------+
|                                             |
|  --- Lots actifs (3) ----------------------+
|  +------------------------------------------+
|  | [Oeuf] Pondeuses #3        [Active]     |
|  |        200 sujets                        |
|  | Oeufs: 142   Mort: 0.5%   Age: 18s     |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|  +------------------------------------------+
|  | [Poulet] Chair #2          [Croissance] |
|  |          500 sujets                      |
|  | Poids: 1.2kg  Mort: 0.3%  Age: 5s      |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|  +------------------------------------------+
|  | [Oeuf] Incubation #7      [J12/21]     |
|  |        350 oeufs Goliath                |
|  | [========>........]  57%                |
|  | Eclosion: 28 aout            [ Voir > ] |
|  +------------------------------------------+
|  -----------------------------------------+
|                                             |
|  --- Indicateurs semaine -------------------+
|  [Graphique barres — oeufs 7 derniers jours]|
|  Lun  Mar  Mer  Jeu  Ven  Sam  Dim         |
|  138  140  142  —    —    —    —            |
|  -----------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

**Comportement :**
- Pull-to-refresh synchronise les donnees
- Les alertes sont cliquables et menent a l'ecran concerne
- Les stats s'animent au chargement (count up)
- Les actions rapides sont des boutons carres 64x64px avec icone + label
- La liste des lots est scrollable horizontalement si >3 lots
- Le graphique utilise `fl_chart`
- Indicateur offline si pas de connexion (bandeau jaune en haut)

---

## 9. Ecrans — Elevage

### 9.1 Flock List Screen (Liste des lots)

```
+--------------------------------------------+
|  ←  Mes lots                    [+ Creer]  |
|  -----------------------------------------+
|  [Tous] [Actifs] [Incubation] [Termines]   |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Oeuf] Pondeuses #3        [Active]     |
|  |        200 sujets                        |
|  | Oeufs: 142   Mort: 0.5%   Age: 18s     |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Poulet] Chair #2          [Croissance] |
|  |          500 sujets                      |
|  | Poids: 1.2kg  Mort: 0.3%  Age: 5s      |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Goliath] Reproducteurs #1  [Active]    |
|  |           50 sujets (30F + 20M)         |
|  | Oeufs: 22   Fertil: 92%   Age: 32s     |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Caille] Cailles #1        [Active]     |
|  |          100 sujets                      |
|  | Oeufs: 85   Mort: 0.2%    Age: 12s     |
|  |                         [ Saisir > ]    |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

**Comportement :**
- Filtres en chips scrollables horizontalement
- Bouton "+ Creer" en haut a droite
- Pull-to-refresh
- Etat vide si aucun lot : illustration poule + "Creez votre premier lot"

---

### 9.2 Flock Create Screen

```
+--------------------------------------------+
|  ←  Nouveau lot                             |
|  -----------------------------------------+
|                                             |
|  Type d'elevage                             |
|  [● Pondeuses] [○ Chair] [○ Goliath]       |
|  [○ Cailles]                                |
|  -----------------------------------------+
|                                             |
|  Nom du lot                                 |
|  +----------------------------------------+|
|  | Pondeuses #3                           ||
|  +----------------------------------------+|
|                                             |
|  Nombre de sujets                           |
|  +----------------------------------------+|
|  | 200                                    ||
|  +----------------------------------------+|
|                                             |
|  Date de debut                              |
|  +----------------------------------------+|
|  | 20 avril 2026                          ||
|  +----------------------------------------+|
|                                             |
|  Race / Souche (optionnel)                  |
|  +----------------------------------------+|
|  | Isa Brown                              ||
|  +----------------------------------------+|
|                                             |
|  Batiment                                   |
|  +----------------------------------------+|
|  | Batiment A                             ||
|  +----------------------------------------+|
|                                             |
|  Fournisseur (optionnel)                    |
|  +----------------------------------------+|
|  | Sedima                                 ||
|  +----------------------------------------+|
|                                             |
|  [       Creer le lot       ]               |
+--------------------------------------------+
```

---

### 9.3 Flock Detail Screen

```
+--------------------------------------------+
|  ←  Pondeuses #3               [...menu]   |
|  -----------------------------------------+
|                                             |
|  [Oeuf] Pondeuses #3          [Active]     |
|  Isa Brown — Batiment A                     |
|  200 sujets — Debut: 20 avr 2026           |
|  Age: 18 semaines                           |
|  -----------------------------------------+
|                                             |
|  --- Stats du jour -------------------------+
|  +--------+  +--------+  +--------+        |
|  |Oeufs   |  |Mort.   |  |Alim.   |        |
|  | 142    |  | 0      |  | 35 kg  |        |
|  +--------+  +--------+  +--------+        |
|  +--------+  +--------+                    |
|  |Taux    |  |Poids   |                    |
|  |ponte   |  |moyen   |                    |
|  | 71%    |  | 1.8 kg |                    |
|  +--------+  +--------+                    |
|  -----------------------------------------+
|                                             |
|  [    Saisie du jour    ]                   |
|  -----------------------------------------+
|                                             |
|  --- Graphique production 30j --------------+
|  [Courbe oeufs / mortalite / alimentation] |
|  -----------------------------------------+
|                                             |
|  --- Vaccinations prevues ------------------+
|  ● Newcastle J14 — 4 mai 2026    [Fait]    |
|  ● Gumboro J21 — 11 mai 2026     [Fait]    |
|  ◌ Rappel Newcastle — 25 aout    [A faire] |
|  -----------------------------------------+
|                                             |
|  --- Historique saisies --------------------+
|  20 aout — Oeufs: 142 | Mort: 0 | 35kg    |
|  19 aout — Oeufs: 137 | Mort: 1 | 37kg    |
|  18 aout — Oeufs: 140 | Mort: 0 | 35kg    |
|  [ Voir tout l'historique ]                 |
|  -----------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

**Menu (...) :**
- Modifier le lot
- Mettre en pause
- Archiver / Terminer
- Supprimer

---

### 9.4 Daily Entry Screen (Saisie du jour)

```
+--------------------------------------------+
|  ←  Saisie du jour                          |
|  Pondeuses #3 — 20 aout 2026               |
|  -----------------------------------------+
|                                             |
|  Oeufs collectes                            |
|  +-----+  +---------------------------+    |
|  | [-] |  |          142              |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  Hier : 137                                 |
|  -----------------------------------------+
|                                             |
|  Mortalite                                  |
|  +-----+  +---------------------------+    |
|  | [-] |  |           1               |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  Cause (optionnel)                          |
|  +----------------------------------------+|
|  | Inconnue                               ||
|  +----------------------------------------+|
|  -----------------------------------------+
|                                             |
|  Alimentation (kg)                          |
|  +-----+  +---------------------------+    |
|  | [-] |  |          35               |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  -----------------------------------------+
|                                             |
|  Eau (litres, optionnel)                    |
|  +----------------------------------------+|
|  | 80                                     ||
|  +----------------------------------------+|
|  -----------------------------------------+
|                                             |
|  Poids moyen (kg, optionnel)                |
|  +----------------------------------------+|
|  | 1.8                                    ||
|  +----------------------------------------+|
|  -----------------------------------------+
|                                             |
|  Observations                               |
|  +----------------------------------------+|
|  | RAS — production normale               ||
|  |                                        ||
|  +----------------------------------------+|
|  -----------------------------------------+
|                                             |
|  [      Enregistrer la saisie      ]        |
+--------------------------------------------+
```

**Comportement :**
- Boutons +/- avec zone tactile 48x48px
- Tap long sur +/- → incrementation rapide
- Valeur par defaut : derniere saisie
- Auto-save brouillon en local
- Succes → snackbar vert + retour au detail lot
- Offline → sauvegarde locale + sync ulterieure (icone nuage barre)

---

### 9.5 Incubation List Screen

```
+--------------------------------------------+
|  ←  Incubation               [+ Nouveau]   |
|  -----------------------------------------+
|  [Tous] [En cours] [Termines]              |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Oeuf] Lot #7              [J12 / 21]  |
|  |        Goliath — 350 oeufs              |
|  | Fertiles: 320  Morts: 12               |
|  | [========>........]  57%                |
|  | Eclosion: 28 aout            [ Voir > ] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Oeuf] Lot #6              [Termine]    |
|  |        Pondeuses — 200 oeufs            |
|  | Eclos: 172/190  Taux: 90.5%            |
|  | Termine le 10 aout           [ Voir > ] |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 9.6 Incubation Detail Screen (avec Timeline)

```
+--------------------------------------------+
|  ←  Incubation #7             [...menu]    |
|  -----------------------------------------+
|                                             |
|  [Oeuf]  Goliath — 350 oeufs  [J12 / 21]  |
|  Debut: 8 aout 2026                        |
|  Eclosion prevue: 28 aout 2026             |
|  -----------------------------------------+
|                                             |
|  [===========>............]  57%            |
|  -----------------------------------------+
|                                             |
|  --- Stats ----------------------------------
|  +--------+  +--------+  +--------+        |
|  |Fertiles|  |Morts   |  |Taux    |        |
|  | 320    |  | 12     |  | 91.4%  |        |
|  +--------+  +--------+  +--------+        |
|  -----------------------------------------+
|                                             |
|  --- Timeline incubation -------------------+
|                                             |
|  ● J1 — Mise en couveuse                   |
|  |  350 oeufs deposes                      |
|  |  Temperature: 37.5C  Humidite: 55%      |
|  |  8 aout 2026                            |
|  |                                          |
|  ● J7 — Premier mirage                     |
|  |  320 fertiles, 30 retires (8.6%)        |
|  |  14 aout 2026                           |
|  |                                          |
|  ● J12 — Aujourd'hui                       |
|  |  12 morts detectes au 2eme mirage       |
|  |  Retournement: OK                       |
|  |  20 aout 2026                           |
|  |                                          |
|  ◌ J14 — Deuxieme mirage (dans 2j)        |
|  |  Prevu le 22 aout 2026                  |
|  |                                          |
|  ◌ J18 — Transfert eclosoir               |
|  |  Prevu le 26 aout 2026                  |
|  |                                          |
|  ◌ J21 — Eclosion prevue                  |
|     Prevu le 28 aout 2026                  |
|  -----------------------------------------+
|                                             |
|  [   Enregistrer une observation   ]        |
|  -----------------------------------------+
|                                             |
|  --- Historique temperature ----------------+
|  [Graphique courbe temp/humidite 12 jours] |
|  -----------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 9.7 Vaccination Calendar Screen

```
+--------------------------------------------+
|  ←  Calendrier vaccinal                     |
|  -----------------------------------------+
|  [< Aout] Aout 2026 [Septembre >]         |
|  -----------------------------------------+
|                                             |
|  --- A venir --------------------------------
|                                             |
|  22 aout                                    |
|  +------------------------------------------+
|  | [Seringue] Rappel Newcastle             |
|  |            Lot Pondeuses #3             |
|  |            Age: 18 semaines             |
|  |            [ Marquer fait ]     [>]     |
|  +------------------------------------------+
|                                             |
|  28 aout                                    |
|  +------------------------------------------+
|  | [Seringue] Gumboro rappel               |
|  |            Lot Chair #2                 |
|  |            Age: 6 semaines              |
|  |            [ Marquer fait ]     [>]     |
|  +------------------------------------------+
|  -----------------------------------------+
|                                             |
|  --- Fait -----------------------------------
|                                             |
|  14 aout                                    |
|  +------------------------------------------+
|  | [Check] Newcastle J14        [Fait]     |
|  |         Lot Pondeuses #3               |
|  +------------------------------------------+
|                                             |
|  7 aout                                     |
|  +------------------------------------------+
|  | [Check] Gumboro J7           [Fait]     |
|  |         Lot Chair #2                    |
|  +------------------------------------------+
|  -----------------------------------------+
|                                             |
|  [  + Ajouter une vaccination  ]            |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

**Comportement :**
- Navigation par mois
- Vaccinations a venir en haut, terminees en bas
- Bouton "Marquer fait" → dialog de confirmation avec champs optionnels (produit, dose, veterinaire)
- Notification push 1 jour avant et le jour J

---

## 10. Ecrans — Finances

### 10.1 Financial Summary Screen

```
+--------------------------------------------+
|  ←  Finances                                |
|  -----------------------------------------+
|  [< Juillet] Aout 2026 [>]                |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | Finances du mois           [Aout 2026]  |
|  | ----------------------------------------|
|  |                                          |
|  | Revenus            Depenses              |
|  | +850 000 FCFA      -420 000 FCFA        |
|  |                                          |
|  | Balance                                  |
|  | 430 000 FCFA                             |
|  | ----------------------------------------|
|  | Dettes en cours : 75 000 FCFA           |
|  +------------------------------------------+
|  -----------------------------------------+
|                                             |
|  --- Repartition depenses ------------------+
|  [Graphique camembert]                      |
|  ● Alimentation    60%  252 000 F          |
|  ● Veterinaire     15%   63 000 F          |
|  ● Main d'oeuvre   12%   50 400 F          |
|  ● Transport        8%   33 600 F          |
|  ● Autres            5%   21 000 F          |
|  -----------------------------------------+
|                                             |
|  --- Acces rapides -------------------------+
|  +----------+  +----------+  +----------+  |
|  | Depenses |  | Ventes   |  | Dettes   |  |
|  | [>]      |  | [>]      |  | [>]      |  |
|  +----------+  +----------+  +----------+  |
|  -----------------------------------------+
|                                             |
|  --- Evolution 6 mois ---------------------+
|  [Graphique barres — revenus vs depenses]  |
|  Mar  Avr  Mai  Jun  Jul  Aou              |
|  -----------------------------------------+
|                                             |
|  [ Telecharger le rapport PDF ]             |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 10.2 Expenses List Screen

```
+--------------------------------------------+
|  ←  Depenses                 [+ Ajouter]   |
|  -----------------------------------------+
|  [Toutes] [Aliment] [Veto] [Transport] [+] |
|  -----------------------------------------+
|  Total aout : 420 000 FCFA                  |
|  -----------------------------------------+
|                                             |
|  20 aout 2026                               |
|  +------------------------------------------+
|  | [Sac] Aliment pondeuse P2               |
|  |       10 sacs x 15 000 F                |
|  |       150 000 FCFA         [ Modifier ] |
|  +------------------------------------------+
|                                             |
|  18 aout 2026                               |
|  +------------------------------------------+
|  | [Seringue] Vaccin Newcastle             |
|  |            2 flacons x 5 000 F          |
|  |            10 000 FCFA      [ Modifier ] |
|  +------------------------------------------+
|                                             |
|  15 aout 2026                               |
|  +------------------------------------------+
|  | [Camion] Transport poussins             |
|  |          1 voyage                       |
|  |          25 000 FCFA        [ Modifier ] |
|  +------------------------------------------+
|                                             |
|  (etat vide)                                |
|  Aucune depense ce mois                     |
|  [ Ajouter une depense ]                    |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 10.3 Expense Create Screen

```
+--------------------------------------------+
|  ←  Nouvelle depense                        |
|  -----------------------------------------+
|                                             |
|  Categorie                                  |
|  [● Alimentation] [○ Veterinaire]          |
|  [○ Transport] [○ Main d'oeuvre]           |
|  [○ Materiel] [○ Autre]                   |
|  -----------------------------------------+
|                                             |
|  Description                                |
|  +----------------------------------------+|
|  | Aliment pondeuse P2                    ||
|  +----------------------------------------+|
|                                             |
|  Montant (FCFA)                             |
|  +----------------------------------------+|
|  | 150 000                                ||
|  +----------------------------------------+|
|                                             |
|  Quantite (optionnel)                       |
|  +----------------------------------------+|
|  | 10 sacs                                ||
|  +----------------------------------------+|
|                                             |
|  Date                                       |
|  +----------------------------------------+|
|  | 20 aout 2026                           ||
|  +----------------------------------------+|
|                                             |
|  Lot associe (optionnel)                    |
|  +----------------------------------------+|
|  | Pondeuses #3                    [v]    ||
|  +----------------------------------------+|
|                                             |
|  Fournisseur (optionnel)                    |
|  +----------------------------------------+|
|  | Sedima                                 ||
|  +----------------------------------------+|
|                                             |
|  Note (optionnel)                           |
|  +----------------------------------------+|
|  | Livraison directe a la ferme           ||
|  +----------------------------------------+|
|                                             |
|  [    Enregistrer la depense    ]           |
+--------------------------------------------+
```

---

### 10.4 Sales List Screen

```
+--------------------------------------------+
|  ←  Ventes                   [+ Vendre]    |
|  -----------------------------------------+
|  [Toutes] [Oeufs] [Poulets] [Cailles]     |
|  -----------------------------------------+
|  Total aout : 850 000 FCFA                  |
|  -----------------------------------------+
|                                             |
|  20 aout 2026                               |
|  +------------------------------------------+
|  | [Oeuf] Vente oeufs                     |
|  |        10 plateaux x 3 000 F            |
|  |        30 000 FCFA                      |
|  |        Client: Mme Diop     [Paye]     |
|  +------------------------------------------+
|                                             |
|  19 aout 2026                               |
|  +------------------------------------------+
|  | [Poulet] Vente poulets chair            |
|  |          20 poulets x 4 500 F           |
|  |          90 000 FCFA                    |
|  |          Client: Chez Fatou  [Partiel]  |
|  +------------------------------------------+
|                                             |
|  18 aout 2026                               |
|  +------------------------------------------+
|  | [Oeuf] Vente oeufs fecondes            |
|  |        5 plateaux x 5 000 F             |
|  |        25 000 FCFA                      |
|  |        Client: Mr Ndiaye    [Paye]     |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 10.5 Sale Create Screen

```
+--------------------------------------------+
|  ←  Nouvelle vente                          |
|  -----------------------------------------+
|                                             |
|  Type de produit                            |
|  [● Oeufs consommation] [○ Oeufs fecondes]|
|  [○ Poulets vivants] [○ Poulets abattus]  |
|  [○ Poussins] [○ Cailles] [○ Autre]      |
|  -----------------------------------------+
|                                             |
|  Quantite                                   |
|  +-----+  +---------------------------+    |
|  | [-] |  |          10              |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  Unite : [Plateaux v]                       |
|  -----------------------------------------+
|                                             |
|  Prix unitaire (FCFA)                       |
|  +----------------------------------------+|
|  | 3 000                                 ||
|  +----------------------------------------+|
|                                             |
|  Total : 30 000 FCFA                        |
|  -----------------------------------------+
|                                             |
|  Client                                     |
|  +----------------------------------------+|
|  | Mme Diop                       [v]    ||
|  +----------------------------------------+|
|  [ + Nouveau client ]                       |
|  -----------------------------------------+
|                                             |
|  Statut paiement                            |
|  [● Paye] [○ Partiel] [○ A credit]        |
|                                             |
|  Montant recu (si partiel)                  |
|  +----------------------------------------+|
|  | 20 000                                 ||
|  +----------------------------------------+|
|  -----------------------------------------+
|                                             |
|  Date                                       |
|  +----------------------------------------+|
|  | 20 aout 2026                           ||
|  +----------------------------------------+|
|                                             |
|  Lot source (optionnel)                     |
|  +----------------------------------------+|
|  | Pondeuses #3                    [v]    ||
|  +----------------------------------------+|
|                                             |
|  [    Enregistrer la vente    ]             |
+--------------------------------------------+
```

---

### 10.6 Debts List Screen

```
+--------------------------------------------+
|  ←  Dettes et creances       [+ Ajouter]   |
|  -----------------------------------------+
|  [Tout] [A recevoir] [A payer]             |
|  -----------------------------------------+
|  Total dettes : 75 000 FCFA                 |
|  -----------------------------------------+
|                                             |
|  --- A recevoir (clients) ------------------
|                                             |
|  +------------------------------------------+
|  | Chez Fatou                              |
|  | 45 000 FCFA — depuis le 19 aout         |
|  | Vente poulets (90 000F, recu 45 000F)   |
|  | [Encaisser]                   [>]       |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | Mr Ndiaye                               |
|  | 30 000 FCFA — depuis le 12 aout         |
|  | Vente oeufs fecondes                    |
|  | [Encaisser]                   [>]       |
|  +------------------------------------------+
|                                             |
|  --- A payer (fournisseurs) ----------------
|                                             |
|  +------------------------------------------+
|  | Sedima                                  |
|  | 0 FCFA — tout paye                      |
|  | Dernier achat: 15 aout                  |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 10.7 Financial Reports Screen

```
+--------------------------------------------+
|  ←  Rapports financiers                     |
|  -----------------------------------------+
|                                             |
|  Periode                                    |
|  [Ce mois] [3 mois] [6 mois] [1 an]       |
|  [Personnalise]                             |
|  -----------------------------------------+
|                                             |
|  --- Resume --------------------------------+
|  Revenus totaux      : 4 850 000 FCFA      |
|  Depenses totales    : 2 520 000 FCFA      |
|  Benefice net        : 2 330 000 FCFA      |
|  Marge               : 48%                  |
|  -----------------------------------------+
|                                             |
|  --- Revenus vs Depenses -------------------+
|  [Graphique barres empilees par mois]       |
|  -----------------------------------------+
|                                             |
|  --- Repartition revenus -------------------+
|  [Graphique camembert]                      |
|  ● Oeufs consommation   55%               |
|  ● Poulets de chair     30%               |
|  ● Oeufs fecondes       10%               |
|  ● Poussins              5%               |
|  -----------------------------------------+
|                                             |
|  --- Top clients ---------------------------+
|  1. Mme Diop         850 000 FCFA          |
|  2. Chez Fatou        620 000 FCFA          |
|  3. Mr Ndiaye         380 000 FCFA          |
|  -----------------------------------------+
|                                             |
|  [ Exporter en PDF ]  [ Exporter en Excel ] |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

## 11. Ecrans — Communs

### 11.1 Splash Screen

```
+--------------------------------------------+
|                                             |
|                                             |
|                                             |
|           [Logo SenGuett]                   |
|            SENGUETT                         |
|       Gerez votre elevage                   |
|                                             |
|                                             |
|            ooo  (loader)                    |
+--------------------------------------------+
```

**Design :** Fond `#1B5E20` (vert fonce), logo blanc + vert clair, loader vert.
**Duree :** 1.5s puis redirection auto.

---

### 11.2 Onboarding (3 slides)

**Slide 1 — Le probleme**
```
+--------------------------------------------+
|                                             |
|  [Illustration : eleveur avec carnet        |
|   papier, volailles autour, style flat      |
|   africain]                                 |
|                                             |
|  Fini le carnet papier                      |
|  Suivez votre elevage en un clin d'oeil    |
|                                             |
|  o . .                    [ Suivant > ]     |
+--------------------------------------------+
```

**Slide 2 — La solution**
```
+--------------------------------------------+
|                                             |
|  [Illustration : smartphone avec graphes,   |
|   poules pondeuses, oeufs — style flat      |
|   africain]                                 |
|                                             |
|  Tout en un seul endroit                    |
|  Production, finances, stock et vaccination|
|                                             |
|  . o .                    [ Suivant > ]     |
+--------------------------------------------+
```

**Slide 3 — L'equipe**
```
+--------------------------------------------+
|                                             |
|  [Illustration : equipe de fermiers avec    |
|   tablettes, poulailler, style flat         |
|   africain]                                 |
|                                             |
|  Travaillez en equipe                       |
|  Invitez vos collaborateurs et partagez    |
|  les donnees en temps reel                  |
|                                             |
|  . . o                    [ Commencer ]     |
+--------------------------------------------+
```

---

### 11.3 Phone Input Screen

```
+--------------------------------------------+
|  ←                                          |
|                                             |
|  Bienvenue sur SenGuett                     |
|  Entrez votre numero                        |
|                                             |
|  +----------------------------------------+|
|  | SN +221  |  77 123 45 67              ||
|  +----------------------------------------+|
|                                             |
|  Vous recevrez un code par SMS              |
|                                             |
|  [  Recevoir mon code  ]                    |
|                                             |
|  CGU - Politique de confidentialite         |
+--------------------------------------------+
```

**Etats :**
- Repos : bouton grise
- Numero valide (9 chiffres apres +221) : bouton vert active
- Chargement : bouton avec spinner

---

### 11.4 OTP Verification Screen

```
+--------------------------------------------+
|  ←                                          |
|                                             |
|  Code envoye par SMS                        |
|  au +221 77 123 45 67                       |
|                                             |
|  [_] [_] [_] [_] [_] [_]                   |
|                                             |
|  Valide 10 minutes                          |
|                                             |
|  Vous n'avez pas recu le code ?             |
|  Renvoyer (00:45)                           |
|                                             |
|  Recevoir par WhatsApp                      |
+--------------------------------------------+
```

**Comportement :**
- 6 cases individuelles, auto-focus case suivante
- Auto-submit quand les 6 cases remplies
- Compte a rebours avant de pouvoir renvoyer
- Erreur : cases rouges + message "Code incorrect"

---

### 11.5 Team Choice Screen

```
+--------------------------------------------+
|                                             |
|  Votre elevage                              |
|                                             |
|  +----------------------------------------+|
|  | [Poule] Creer mon elevage              ||
|  |                                        ||
|  | Je suis proprietaire                   ||
|  | et je cree mon espace                  ||
|  +----------------------------------------+|
|                                             |
|  +----------------------------------------+|
|  | [Equipe] Rejoindre un elevage          ||
|  |                                        ||
|  | J'ai un code d'invitation              ||
|  | d'un proprietaire                      ||
|  +----------------------------------------+|
|                                             |
+--------------------------------------------+
```

---

### 11.6 Team Create Screen

```
+--------------------------------------------+
|  ←  Creer votre elevage                     |
|  -----------------------------------------+
|                                             |
|  Nom de l'elevage                           |
|  +----------------------------------------+|
|  | Ferme Avicole Diallo                   ||
|  +----------------------------------------+|
|                                             |
|  Localisation                               |
|  +----------------------------------------+|
|  | Thies, Senegal                         ||
|  +----------------------------------------+|
|                                             |
|  Type(s) d'elevage                          |
|  [x] Pondeuses                              |
|  [x] Poulets de chair                       |
|  [ ] Reproducteurs (Goliath)                |
|  [ ] Cailles                                |
|                                             |
|  Photo (optionnel)                          |
|  +----------------------------------------+|
|  |  [Camera]  Prendre une photo           ||
|  |  ou importer depuis la galerie         ||
|  +----------------------------------------+|
|                                             |
|  [     Creer l'elevage     ]                |
+--------------------------------------------+
```

---

### 11.7 Team Join Screen

```
+--------------------------------------------+
|  ←  Rejoindre un elevage                    |
|  -----------------------------------------+
|                                             |
|  Entrez le code d'invitation                |
|  recu de votre proprietaire                 |
|                                             |
|  +----------------------------------------+|
|  | FARM-XXXX-XXXX                         ||
|  +----------------------------------------+|
|                                             |
|  [     Rejoindre     ]                      |
|                                             |
|  Vous n'avez pas de code ?                  |
|  Demandez a votre proprietaire de vous      |
|  inviter depuis l'application.              |
+--------------------------------------------+
```

---

### 11.8 Profile Setup Screen

```
+--------------------------------------------+
|  ←  Votre profil                            |
|  -----------------------------------------+
|                                             |
|  [Avatar placeholder — Camera]              |
|                                             |
|  Prenom                                     |
|  +----------------------------------------+|
|  | Moussa                                 ||
|  +----------------------------------------+|
|                                             |
|  Nom                                        |
|  +----------------------------------------+|
|  | Diallo                                 ||
|  +----------------------------------------+|
|                                             |
|  Role dans l'elevage                        |
|  +----------------------------------------+|
|  | Proprietaire               (auto)      ||
|  +----------------------------------------+|
|                                             |
|  [    Terminer la configuration    ]        |
+--------------------------------------------+
```

---

### 11.9 Initial Config Wizard Screen

```
+--------------------------------------------+
|  Configuration initiale        Etape 1/3   |
|  -----------------------------------------+
|                                             |
|  ● ─── ○ ─── ○                             |
|  Type   Lot    Stock                        |
|  -----------------------------------------+
|                                             |
|  Quel type d'elevage gerez-vous ?           |
|                                             |
|  +--[Oeuf]--+ +--[Poulet]--+               |
|  | Pondeuses| | Chair      |               |
|  +----------+ +------------+               |
|  +--[Goliath]+  +--[Caille]+               |
|  | Reprod.  |  | Cailles   |               |
|  +----------+  +-----------+               |
|                                             |
|  Vous pouvez en selectionner plusieurs      |
|                                             |
|  [        Suivant        ]                  |
+--------------------------------------------+
```

```
+--------------------------------------------+
|  Configuration initiale        Etape 2/3   |
|  -----------------------------------------+
|                                             |
|  ● ─── ● ─── ○                             |
|  Type   Lot    Stock                        |
|  -----------------------------------------+
|                                             |
|  Avez-vous un lot en cours ?                |
|                                             |
|  [Oui, j'ai un lot actif]                  |
|  [Non, je commence bientot]                |
|                                             |
|  (Si oui → formulaire rapide lot)           |
|  Nombre de sujets                           |
|  +----------------------------------------+|
|  | 200                                    ||
|  +----------------------------------------+|
|                                             |
|  Age actuel (semaines)                      |
|  +----------------------------------------+|
|  | 18                                     ||
|  +----------------------------------------+|
|                                             |
|  [        Suivant        ]                  |
+--------------------------------------------+
```

```
+--------------------------------------------+
|  Configuration initiale        Etape 3/3   |
|  -----------------------------------------+
|                                             |
|  ● ─── ● ─── ●                             |
|  Type   Lot    Stock                        |
|  -----------------------------------------+
|                                             |
|  Voulez-vous configurer votre stock ?       |
|                                             |
|  [Oui, je gere mon stock]                  |
|  [Plus tard]                                |
|                                             |
|  (Si oui → ajout rapide stocks)             |
|  Aliment en stock (kg)                      |
|  +----------------------------------------+|
|  | 500                                    ||
|  +----------------------------------------+|
|                                             |
|  Seuil alerte (kg)                          |
|  +----------------------------------------+|
|  | 50                                     ||
|  +----------------------------------------+|
|                                             |
|  [    Terminer et commencer    ]            |
+--------------------------------------------+
```

---

### 11.10 Notifications Screen

```
+--------------------------------------------+
|  ←  Notifications                           |
|  -----------------------------------------+
|                                             |
|  Aujourd'hui                                |
|  +------------------------------------------+
|  | [!] Vaccination rappel                  |
|  |     Rappel Newcastle — Pondeuses #3     |
|  |     Il y a 2h                           |
|  +------------------------------------------+
|  +------------------------------------------+
|  | [Oeuf] Saisie du jour                   |
|  |     N'oubliez pas la saisie du jour     |
|  |     Il y a 4h                           |
|  +------------------------------------------+
|                                             |
|  Hier                                       |
|  +------------------------------------------+
|  | [Stock] Stock aliment faible            |
|  |     Aliment P2 sous le seuil (45 kg)    |
|  |     Hier, 16:30                         |
|  +------------------------------------------+
|  +------------------------------------------+
|  | [Equipe] Nouveau membre                 |
|  |     Fatou a rejoint votre elevage       |
|  |     Hier, 10:15                         |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 11.11 Settings Screen

```
+--------------------------------------------+
|  ←  Parametres                              |
|  -----------------------------------------+
|                                             |
|  --- General --------------------------------
|  Langue                         [Francais >]|
|  Notifications              [Active    >]  |
|  Unite de poids                  [kg >]    |
|  -----------------------------------------+
|                                             |
|  --- Elevage --------------------------------
|  Rappel saisie quotidienne   [08:00 >]     |
|  Rappel vaccination           [1 jour avant]|
|  Alerte mortalite             [> 2% >]     |
|  Seuils stock par defaut      [50 kg >]    |
|  -----------------------------------------+
|                                             |
|  --- Equipe ---------------------------------
|  Gerer les membres              [>]        |
|  Code d'invitation               [>]        |
|  -----------------------------------------+
|                                             |
|  --- Donnees --------------------------------
|  Exporter les donnees (CSV)      [>]        |
|  Synchronisation                 [>]        |
|  Supprimer mon compte            [>]        |
|  -----------------------------------------+
|                                             |
|  --- A propos -------------------------------
|  Version                         1.0.0      |
|  Conditions d'utilisation        [>]        |
|  Politique de confidentialite    [>]        |
|  Contacter le support            [>]        |
|  -----------------------------------------+
|                                             |
|  [   Se deconnecter   ]                     |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 11.12 Members Management Screen

```
+--------------------------------------------+
|  ←  Membres de l'equipe     [+ Inviter]    |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Moussa Diallo   [Proprietaire] |
|  |          +221 77 123 45 67              |
|  |          Inscrit le 1er mars 2026       |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Fatou Ndiaye       [Manager]   |
|  |          +221 78 234 56 78              |
|  |          Inscrit le 15 mars 2026    [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Ibou Sow            [Membre]   |
|  |          +221 76 345 67 89              |
|  |          Inscrit le 20 avril 2026   [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Rama Diop           [Membre]   |
|  |          +221 77 456 78 90              |
|  |          Inscrit le 5 mai 2026      [>] |
|  +------------------------------------------+
|                                             |
|  --- Invitations en attente ----------------+
|  +------------------------------------------+
|  | [Horloge] +221 70 567 89 01  [Attente]  |
|  |           Invite le 18 aout         [x] |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 11.13 Profile Screen

```
+--------------------------------------------+
|                                             |
|  [Avatar 96px]                              |
|  Moussa Diallo          [Proprietaire]      |
|  +221 77 123 45 67                          |
|  Ferme Avicole Diallo — Thies              |
|  -----------------------------------------+
|                                             |
|  --- Mon elevage ---------------------------+
|  Membres                         4 / 5  [>]|
|  Lots actifs                         3  [>]|
|  Date de creation           1 mars 2026    |
|  -----------------------------------------+
|                                             |
|  --- Raccourcis ----------------------------+
|  Parametres                          [>]    |
|  Exporter les donnees                [>]    |
|  Aide & Support                      [>]    |
|  A propos de SenGuett                [>]    |
|  -----------------------------------------+
|                                             |
|  [   Modifier le profil   ]                 |
|                                             |
|  [   Se deconnecter   ]                     |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

## 12. Ecrans — Stock, Clients, Commandes, Rapports

### 12.1 Stock List Screen

```
+--------------------------------------------+
|  ←  Stock                    [+ Ajouter]   |
|  -----------------------------------------+
|  [Tout] [Aliment] [Medicament] [Materiel]  |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Sac] Aliment Pondeuse P2   [Faible]   |
|  |       Stock : 45 kg                     |
|  |       Seuil alerte : 50 kg             |
|  |       [========>.....]  45%             |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Sac] Aliment Chair S2       [OK]       |
|  |       Stock : 320 kg                    |
|  |       Seuil alerte : 100 kg            |
|  |       [===============>.]  80%          |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Pilule] Vitamine E          [Epuise]   |
|  |          Stock : 0 flacons              |
|  |          Seuil alerte : 2 flacons       |
|  |          [...................] 0%       |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Outil] Mangeoires            [OK]      |
|  |         Stock : 15 unites               |
|  |         Seuil alerte : 5 unites         |
|  |         [===============>.]  75%        |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.2 Stock Item Detail Screen

```
+--------------------------------------------+
|  ←  Aliment Pondeuse P2       [...menu]    |
|  -----------------------------------------+
|                                             |
|  Stock actuel                               |
|  45 kg                          [Faible]   |
|  Seuil alerte : 50 kg                      |
|  [==========>........]  45%                |
|  -----------------------------------------+
|                                             |
|  [  + Entree  ]     [  - Sortie  ]         |
|  -----------------------------------------+
|                                             |
|  --- Historique mouvements -----------------+
|                                             |
|  20 aout — Sortie 35 kg                    |
|            Distribution Pondeuses #3       |
|                                             |
|  15 aout — Entree +500 kg                  |
|            Achat Sedima — 150 000 FCFA     |
|                                             |
|  14 aout — Sortie 35 kg                    |
|            Distribution Pondeuses #3       |
|                                             |
|  [ Voir tout l'historique ]                 |
|  -----------------------------------------+
|                                             |
|  --- Consommation moyenne ------------------+
|  [Graphique — conso quotidienne 30 jours]  |
|  Moyenne : 35 kg/jour                       |
|  Autonomie estimee : 1.3 jours             |
|  -----------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.3 Stock Entry Screen

```
+--------------------------------------------+
|  ←  Entree de stock                         |
|  -----------------------------------------+
|                                             |
|  Article : Aliment Pondeuse P2              |
|  Stock actuel : 45 kg                       |
|  -----------------------------------------+
|                                             |
|  Type de mouvement                          |
|  [● Entree (achat)] [○ Sortie (usage)]    |
|  -----------------------------------------+
|                                             |
|  Quantite (kg)                              |
|  +-----+  +---------------------------+    |
|  | [-] |  |          500              |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  -----------------------------------------+
|                                             |
|  Fournisseur (optionnel)                    |
|  +----------------------------------------+|
|  | Sedima                                 ||
|  +----------------------------------------+|
|                                             |
|  Cout total (FCFA, optionnel)               |
|  +----------------------------------------+|
|  | 150 000                                ||
|  +----------------------------------------+|
|  → Creer aussi une depense ? [Oui / Non]   |
|                                             |
|  Date                                       |
|  +----------------------------------------+|
|  | 20 aout 2026                           ||
|  +----------------------------------------+|
|                                             |
|  Note (optionnel)                           |
|  +----------------------------------------+|
|  | Livraison directe                      ||
|  +----------------------------------------+|
|                                             |
|  [    Enregistrer    ]                      |
+--------------------------------------------+
```

---

### 12.4 Client List Screen

```
+--------------------------------------------+
|  ←  Clients                  [+ Ajouter]   |
|  -----------------------------------------+
|  [Rechercher un client...]                  |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Mme Diop                      |
|  |          +221 77 111 22 33              |
|  |          Total achats: 850 000 FCFA     |
|  |          Derniere commande: 20 aout [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Chez Fatou                     |
|  |          +221 78 444 55 66              |
|  |          Total achats: 620 000 FCFA     |
|  |          Dette: 45 000 FCFA         [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Avatar] Mr Ndiaye                      |
|  |          +221 76 777 88 99              |
|  |          Total achats: 380 000 FCFA     |
|  |          Dette: 30 000 FCFA         [>] |
|  +------------------------------------------+
|                                             |
|  (etat vide)                                |
|  Aucun client enregistre                    |
|  [ Ajouter un client ]                      |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.5 Client Detail Screen

```
+--------------------------------------------+
|  ←  Mme Diop                 [...menu]     |
|  -----------------------------------------+
|                                             |
|  [Avatar 64px]                              |
|  Mme Diop                                  |
|  +221 77 111 22 33                          |
|  Adresse: Marche Thiaroye                   |
|  -----------------------------------------+
|                                             |
|  --- Resume --------------------------------+
|  Total achats       850 000 FCFA            |
|  Nombre de ventes   23                      |
|  Dette en cours     0 FCFA                  |
|  Client depuis      mars 2026              |
|  -----------------------------------------+
|                                             |
|  --- Dernieres transactions ----------------+
|  20 aout — Oeufs 10 plateaux  30 000 F  ✓  |
|  15 aout — Oeufs 8 plateaux   24 000 F  ✓  |
|  10 aout — Poulets 15 unites  67 500 F  ✓  |
|  [ Voir tout ]                              |
|  -----------------------------------------+
|                                             |
|  [  Nouvelle vente  ]   [  Appeler  ]       |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.6 Client Create Screen

```
+--------------------------------------------+
|  ←  Nouveau client                          |
|  -----------------------------------------+
|                                             |
|  Nom / Raison sociale                       |
|  +----------------------------------------+|
|  | Mme Diop                              ||
|  +----------------------------------------+|
|                                             |
|  Telephone                                  |
|  +----------------------------------------+|
|  | +221 77 111 22 33                      ||
|  +----------------------------------------+|
|                                             |
|  Adresse (optionnel)                        |
|  +----------------------------------------+|
|  | Marche Thiaroye                        ||
|  +----------------------------------------+|
|                                             |
|  Type de client                             |
|  [● Particulier] [○ Revendeur]             |
|  [○ Restaurant] [○ Autre]                  |
|                                             |
|  Notes (optionnel)                          |
|  +----------------------------------------+|
|  | Commande reguliere le lundi            ||
|  +----------------------------------------+|
|                                             |
|  [    Enregistrer le client    ]            |
+--------------------------------------------+
```

---

### 12.7 Orders List Screen

```
+--------------------------------------------+
|  ←  Commandes                [+ Nouvelle]  |
|  -----------------------------------------+
|  [Toutes] [En attente] [Confirmees] [...]  |
|  -----------------------------------------+
|                                             |
|  +------------------------------------------+
|  | CMD-2026-0045              [En attente] |
|  | Mme Diop — 10 plateaux oeufs           |
|  | 30 000 FCFA                             |
|  | Livraison: 22 aout                      |
|  | [Confirmer]  [Annuler]              [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | CMD-2026-0044              [Confirmee]  |
|  | Chez Fatou — 20 poulets                 |
|  | 90 000 FCFA                             |
|  | Livraison: 21 aout                      |
|  | [Marquer livree]                    [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | CMD-2026-0043              [Livree]     |
|  | Mr Ndiaye — 5 plat. oeufs fecondes     |
|  | 25 000 FCFA                             |
|  | Livre le 18 aout                        |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.8 Order Create Screen

```
+--------------------------------------------+
|  ←  Nouvelle commande                       |
|  -----------------------------------------+
|                                             |
|  Client                                     |
|  +----------------------------------------+|
|  | Mme Diop                       [v]    ||
|  +----------------------------------------+|
|  [ + Nouveau client ]                       |
|  -----------------------------------------+
|                                             |
|  Produit                                    |
|  +----------------------------------------+|
|  | Oeufs consommation             [v]    ||
|  +----------------------------------------+|
|                                             |
|  Quantite                                   |
|  +-----+  +---------------------------+    |
|  | [-] |  |          10              |    |
|  +-----+  +---------------------------+    |
|            +-----+                          |
|            | [+] |                          |
|            +-----+                          |
|  Unite : [Plateaux v]                       |
|  -----------------------------------------+
|                                             |
|  Prix unitaire (FCFA)                       |
|  +----------------------------------------+|
|  | 3 000                                 ||
|  +----------------------------------------+|
|                                             |
|  Total : 30 000 FCFA                        |
|  -----------------------------------------+
|                                             |
|  Date de livraison                          |
|  +----------------------------------------+|
|  | 22 aout 2026                           ||
|  +----------------------------------------+|
|                                             |
|  Notes (optionnel)                          |
|  +----------------------------------------+|
|  | Livraison au marche le matin           ||
|  +----------------------------------------+|
|                                             |
|  [    Creer la commande    ]                |
+--------------------------------------------+
```

---

### 12.9 Order Detail Screen

```
+--------------------------------------------+
|  ←  Commande CMD-2026-0045    [En attente] |
|  -----------------------------------------+
|                                             |
|  Client : Mme Diop                          |
|  Telephone : +221 77 111 22 33              |
|  -----------------------------------------+
|                                             |
|  --- Details --------------------------------
|  Produit : Oeufs consommation               |
|  Quantite : 10 plateaux                     |
|  Prix unitaire : 3 000 FCFA                 |
|  Total : 30 000 FCFA                        |
|  -----------------------------------------+
|                                             |
|  Date de commande : 20 aout 2026            |
|  Date de livraison : 22 aout 2026           |
|  -----------------------------------------+
|                                             |
|  Notes : Livraison au marche le matin       |
|  -----------------------------------------+
|                                             |
|  [  Confirmer  ]  [  Modifier  ]            |
|  [  Annuler  ]                              |
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.10 Reports Screen

```
+--------------------------------------------+
|  ←  Rapports                                |
|  -----------------------------------------+
|                                             |
|  --- Rapports disponibles ------------------+
|                                             |
|  +------------------------------------------+
|  | [Graphe] Rapport de production          |
|  |          Production d'oeufs, mortalite, |
|  |          alimentation par lot           |
|  |          [ Generer ]                [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Wallet] Rapport financier              |
|  |          Revenus, depenses, benefice,   |
|  |          dettes par periode             |
|  |          [ Generer ]                [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Sac] Rapport de stock                  |
|  |       Niveaux actuels, consommation,    |
|  |       historique mouvements             |
|  |       [ Generer ]                   [>] |
|  +------------------------------------------+
|                                             |
|  +------------------------------------------+
|  | [Oeuf] Rapport d'incubation             |
|  |        Taux d'eclosion, fertilite,      |
|  |        historique par lot               |
|  |        [ Generer ]                  [>] |
|  +------------------------------------------+
|                                             |
| [Dashboard] [Elevage] [Finances] [Profil]  |
+--------------------------------------------+
```

---

### 12.11 Export Screen

```
+--------------------------------------------+
|  ←  Exporter les donnees                    |
|  -----------------------------------------+
|                                             |
|  Type de rapport                            |
|  +----------------------------------------+|
|  | Rapport de production          [v]     ||
|  +----------------------------------------+|
|                                             |
|  Periode                                    |
|  [Ce mois] [3 mois] [6 mois] [1 an]       |
|  [Personnalise]                             |
|                                             |
|  Du : [1 aout 2026]                         |
|  Au : [20 aout 2026]                        |
|  -----------------------------------------+
|                                             |
|  Lots inclus                                |
|  [x] Pondeuses #3                           |
|  [x] Chair #2                               |
|  [x] Reproducteurs #1                       |
|  [ ] Cailles #1                             |
|  -----------------------------------------+
|                                             |
|  Format                                     |
|  [● PDF]  [○ Excel]  [○ CSV]              |
|  -----------------------------------------+
|                                             |
|  [    Generer et telecharger    ]           |
|                                             |
|  [ Envoyer par WhatsApp ]                   |
+--------------------------------------------+
```

---

## 13. Icones & Illustrations

### 13.1 Icones

**Package :** `lucide_icons_flutter` (clean, moderne, coherent)

| Contexte | Icone |
|----------|-------|
| Dashboard | `LucideIcons.layoutDashboard` |
| Elevage / Lot | `LucideIcons.egg` |
| Finances | `LucideIcons.wallet` |
| Profil | `LucideIcons.user` |
| Oeufs | `LucideIcons.egg` |
| Poulet / Chair | `LucideIcons.drumstick` |
| Mortalite | `LucideIcons.skull` |
| Alimentation | `LucideIcons.wheat` |
| Stock | `LucideIcons.warehouse` |
| Vaccination | `LucideIcons.syringe` |
| Calendrier | `LucideIcons.calendar` |
| Incubation | `LucideIcons.thermometer` |
| Vente | `LucideIcons.shoppingCart` |
| Depense | `LucideIcons.receiptText` |
| Client | `LucideIcons.users` |
| Commande | `LucideIcons.clipboardList` |
| Alerte | `LucideIcons.alertTriangle` |
| Notification | `LucideIcons.bell` |
| Parametres | `LucideIcons.settings` |
| Retour | `LucideIcons.arrowLeft` |
| Ajouter | `LucideIcons.plus` |
| Recherche | `LucideIcons.search` |
| Filtre | `LucideIcons.filter` |
| Graphique | `LucideIcons.barChart3` |
| Exporter | `LucideIcons.download` |
| Partager | `LucideIcons.share2` |
| Equipe | `LucideIcons.usersRound` |
| Telephone | `LucideIcons.phone` |
| Camera | `LucideIcons.camera` |
| Deconnexion | `LucideIcons.logOut` |
| Eau | `LucideIcons.droplets` |
| Poids | `LucideIcons.scale` |
| Batiment | `LucideIcons.building` |
| Synchronisation | `LucideIcons.refreshCw` |
| Hors-ligne | `LucideIcons.wifiOff` |
| Rapport | `LucideIcons.fileText` |
| Tendance haut | `LucideIcons.trendingUp` |
| Tendance bas | `LucideIcons.trendingDown` |
| Check / Fait | `LucideIcons.check` |
| Editer | `LucideIcons.pencil` |
| Supprimer | `LucideIcons.trash2` |

### 13.2 Illustrations

Style **flat design avec palette africaine** (personnages divers, decors ferme senegalaise, couleurs chaudes et naturelles).

Livrables illustration :
- Onboarding x 3 (eleveur avec carnet, smartphone avec graphes, equipe en poulailler)
- Empty states x 6 (aucun lot, aucune vente, aucun client, stock vide, aucune commande, erreur reseau)
- Splash screen (logo SenGuett anime)
- Succes animations x 3 (saisie enregistree, vente confirmee, lot cree)

**Outil recommande :** Lottie pour les animations, SVG pour les illustrations statiques.

---

## 14. Animations & Micro-interactions

```dart
// lib/core/constants/app_animations.dart

class AppAnimations {
  AppAnimations._();

  // Durees standard
  static const Duration fast   = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 250);
  static const Duration slow   = Duration(milliseconds: 400);

  // Courbes
  static const Curve easeOut = Curves.easeOut;
  static const Curve spring  = Curves.elasticOut;
}
```

| Element | Animation |
|---------|-----------|
| Bouton tap | Scale 0.96 → 1.0 (150ms) |
| Page transition | Slide from right (250ms easeOut) |
| Bottom sheet | Slide from bottom (300ms) |
| Badge notification | Bounce in (spring) |
| Skeleton loader | Shimmer horizontal (1.5s loop) |
| Compteur +/- | Scale up leger du chiffre (100ms) |
| Stat card chargement | Count up animation (800ms) |
| Barre de progression | Fill animation (400ms easeOut) |
| Timeline noeud courant | Pulse lent (2s loop, opacite 0.5→1→0.5) |
| Saisie enregistree | Lottie checkmark vert (600ms) |
| OTP case remplie | Scale up leger (100ms) |
| Alerte apparition | Slide from top + fade (300ms) |
| Snackbar | Slide from bottom (250ms) + auto-dismiss (3s) |
| Pull-to-refresh | Spring bounce (400ms) |
| Chip filtre selection | Background color transition (150ms) |
| Sync offline | Rotation icone nuage (1s loop) |

**A eviter :**
- Animations decoratives sans utilite
- Parallax ou effets 3D
- Transitions longues (> 400ms)
- Animations GPU-intensives (batterie limitee)

---

## 15. Accessibilite

| Critere | Standard | Implementation |
|---------|----------|----------------|
| Contrast texte/fond | WCAG AA (4.5:1) | `#1B2E1C` sur blanc = 15.8:1 |
| Contrast en exterieur | Eleve | Couleurs saturees, pas de gris subtils |
| Taille minimum texte | 14sp | Minimum `bodySmall` = 12sp (exception badges) |
| Touch targets | 48x48px minimum | Tous les boutons >= 52px, compteurs +/- = 48px |
| Screen reader | Semantic labels | `Semantics(label: '...')` sur chaque widget custom |
| Focus visible | Oui | `FocusNode` + bordure verte visible |
| Erreurs | Pas uniquement par couleur | Icone + texte + couleur |
| Images | Alt text | `semanticLabel` sur toutes les `Image` |
| Animations | Respect `reduceMotion` | Check `MediaQuery.of(ctx).disableAnimations` |
| Mains sales/gantees | Zones tactiles larges | Boutons +/- grands (48px), espacement genereux |
| Soleil direct | Contraste renforce | Pas de gris clair sur blanc, couleurs primaires saturees |

---

## 16. Formatage

### 16.1 Montants

- Toujours en FCFA avec separateur de milliers (espace)
- Exemples : `2 500 FCFA`, `150 000 FCFA`, `1 250 000 FCFA`
- Positif : prefixe `+` en vert
- Negatif : prefixe `-` en rouge
- Code formatage : `NumberFormat('#,###', 'fr_FR').format(amount).replaceAll(',', ' ') + ' FCFA'`

### 16.2 Poids

- Kilogrammes : `35 kg`, `1.8 kg`, `500 kg`
- Grammes pour petites quantites : `250 g`
- Pas de decimales inutiles : `35 kg` (pas `35.0 kg`)

### 16.3 Dates

- Format court : `20 aout 2026`
- Format relatif : `Il y a 2h`, `Hier`, `Lundi`
- Format jour/age : `J12 / 21` (incubation), `18 semaines` (age lot)
- Heure : `08:30` (format 24h)

### 16.4 Pourcentages

- Taux de ponte : `71%`
- Taux de mortalite : `0.5%`
- Taux d'eclosion : `90.5%`
- Pas plus d'une decimale

### 16.5 Quantites

- Oeufs : nombre entier (`142 oeufs`, `10 plateaux`)
- Sujets : nombre entier (`200 sujets`)
- Avec unite toujours explicitee

### 16.6 Telephones

- Format senegalais : `+221 77 123 45 67`
- Affichage masque possible : `+221 77 *** ** 67`

---

## 17. Responsive & Dark Mode

### 17.1 Responsive

- **Mobile** : priorite absolue (375-428px largeur)
- **Tablette** : adaptation layout en 2 colonnes pour les listes et le dashboard
- **Desktop** : pas prevu (app mobile uniquement V1)

Breakpoints :
| Device | Largeur | Layout |
|--------|---------|--------|
| Mobile petit | < 375px | 1 colonne, padding 12px |
| Mobile standard | 375-428px | 1 colonne, padding 16px |
| Tablette | > 600px | 2 colonnes pour listes, dashboard en grille |

### 17.2 Dark Mode

**V1 : mode clair uniquement.**

L'architecture (AppColors centralise, ThemeData) permet d'ajouter un mode sombre sans modifier les composants.

Mapping prevu pour V2 :
| Token clair | Token sombre |
|-------------|-------------|
| `background` #F5F5F5 | `background` #121212 |
| `surface` #FFFFFF | `surface` #1E1E1E |
| `black` #1B2E1C | `white` #E0E0E0 |
| `primary` #2E7D32 | `primary` #66BB6A |
| `grey100` #F5F5F5 | `grey900` #212121 |

---

*Prochaine etape : Phase 6 — Architecture technique*
*En attente de validation du Design System.*
