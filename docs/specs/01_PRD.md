# SenGuett — Product Requirements Document (PRD)

**Version** : 1.0 — Document final
**Date** : 2026-08-21
**Statut** : Validé

---

## 1. Présentation

**SenGuett** est une application mobile de **gestion d'élevage avicole** destinée aux éleveurs sénégalais. Elle permet de suivre au quotidien la production (ponte, incubation, éclosion, croissance), la gestion financière (dépenses, revenus, bilan), les stocks (aliments, médicaments), les clients et les ventes.

L'app supporte **plusieurs espèces** : poulets Goliath (reproducteurs), poules pondeuses, poulets de chair, cailles — et est conçue pour être extensible à d'autres types d'élevage.

**Application unique Flutter** avec gestion par **équipe** (jusqu'à 5 membres avec permissions différenciées). L'architecture prévoit le multi-équipe pour permettre à d'autres groupes d'éleveurs d'avoir leur propre espace à terme.

---

## 2. Vision

Devenir l'outil de référence pour la gestion d'élevage avicole au Sénégal, en permettant à chaque éleveur de piloter sa production avec des données fiables, de maîtriser ses coûts et de maximiser sa rentabilité.

---

## 3. Objectifs V1

- Une seule app mobile (Android + iOS)
- Backend NestJS + PostgreSQL + Prisma
- Support offline-first (synchronisation quand connecté)
- Multi-espèce (Goliath, pondeuses, chair, cailles)
- Gestion par équipe (1 équipe, jusqu'à 5 membres)
- Dashboard avec graphiques
- Alertes et rappels
- Export PDF/Excel
- Langues : **Français** (Anglais ultérieur)
- Hébergement : Hetzner + Coolify

### Hors périmètre V1

| Feature | Prévu en |
|---------|----------|
| Site web de commande pour les clients | V2 |
| Multi-équipe (plusieurs élevages indépendants) | V2 |
| Anglais | V2 |
| Intégration comptable | V3 |

---

## 4. Utilisateurs

### 4.1 Rôles dans l'équipe

| Rôle | Description | Permissions |
|------|-------------|-------------|
| **Propriétaire** | Créateur de l'équipe, accès total | Tout : CRUD complet, **gestion des membres** (inviter, retirer), paramètres équipe, suppression données |
| **Membre** | Collaborateur de l'équipe | Tout comme le propriétaire **sauf** : gestion des membres, suppression de l'équipe, transfert de propriété |

Tous les membres ont les mêmes droits : saisie quotidienne, gestion lots, finances, ventes, clients, stocks, dashboard, export, etc. La seule différence est que le **propriétaire** gère qui fait partie de l'équipe.

### 4.2 Modèle d'équipe

- Une **équipe** = un élevage (un compte, un cheptel, une comptabilité)
- Chaque équipe a son propre espace de données isolé
- Un utilisateur peut appartenir à **une seule équipe** en V1
- Le propriétaire invite les membres par numéro de téléphone
- Architecture prête pour le multi-équipe en V2 (un utilisateur pourra appartenir à plusieurs équipes)

---

## 5. Espèces et types d'élevage

### 5.1 Types supportés

| Type | Espèce | Objectif | Durée type | Produits |
|------|--------|----------|------------|----------|
| **Reproducteur** | Goliath, autre | Production d'œufs féconds + poussins | Long terme | Poussins, œufs féconds |
| **Pondeuse** | Poule pondeuse | Production d'œufs de consommation | ~18 mois | Œufs de consommation |
| **Chair** | Poulet de chair | Engraissement pour abattage | ~45 jours | Poulets vivants/abattus |
| **Caille** | Caille | Production mixte | Long terme | Œufs de caille, cailles vivantes, chair |

### 5.2 Extensibilité

Le système est conçu avec un modèle **générique** : chaque type d'élevage a ses paramètres propres (durée, métriques, produits). Ajouter un nouveau type = configuration en BDD, pas de code.

---

## 6. Navigation

### Bottom Navigation (4 onglets)

| Onglet | Icône | Écran |
|--------|-------|-------|
| Dashboard | home | Vue d'ensemble, indicateurs clés |
| Élevage | bird | Gestion des lots, saisie quotidienne |
| Finances | wallet | Dépenses, revenus, bilan |
| Profil | user | Équipe, paramètres, export |

---

## 7. Parcours d'inscription

### 7.1 Flux général

```
Splash (2s max)
  |→ Connecté ? → Dashboard
  |→ Pas connecté ? → Onboarding (3 pages)
      |→ "Commencer"
          |→ Saisie téléphone (+221)
              |→ OTP (SMS/WhatsApp via Relayio)
                  |→ Création profil (Nom, Prénom)
                      |→ Créer une équipe OU Rejoindre une équipe (code invitation)
                          |→ Si "Créer" : Nom de l'élevage, localisation
                          |→ Configuration initiale : cheptel actuel
                          |→ Dashboard
```

### 7.2 Onboarding (3 pages)

**Page 1**
- Titre : "Gérez votre élevage simplement."
- Description : "Suivez votre production, vos finances et vos stocks au quotidien."

**Page 2**
- Titre : "Des données fiables, de meilleures décisions."
- Description : "Dashboard, alertes et rapports pour piloter votre rentabilité."

**Page 3**
- Titre : "Travaillez en équipe."
- Description : "Invitez vos collaborateurs et partagez le suivi en temps réel."
- Boutons : "Commencer" (primaire) + "Se connecter" (secondaire)

### 7.3 Authentification

- Connexion par **numéro de téléphone + OTP** (pas de mot de passe)
- OTP envoyé via **Relayio** (SMS ou WhatsApp)
- Code à 6 chiffres, validité 5 minutes
- JWT + Refresh Token côté backend

### 7.4 Configuration initiale

Après création de l'équipe, un assistant guide l'éleveur :

**Étape 1 — Types d'élevage actifs**
- Quels types d'élevage pratiquez-vous ? (checkboxes)
- Reproducteurs / Pondeuses / Chair / Cailles

**Étape 2 — Cheptel actuel (par type coché)**
- Nombre de femelles
- Nombre de mâles
- Équipement : nombre de couveuses, capacité par couveuse
- Optionnel : lots en cours (poulets chair en croissance, œufs en couveuse)

**Étape 3 — Objectifs**
- Taux de ponte cible (%) — par défaut 70%
- Taux de fertilité cible (%) — par défaut 85%
- Taux d'éclosion cible (%) — par défaut 82%
- Ces valeurs servent de référence pour le dashboard (réel vs objectif)

---

## 8. Gestion de l'élevage

### 8.1 Concept de "Lot"

Un **lot** est un groupe d'animaux gérés ensemble. C'est l'unité centrale de suivi.

| Type de lot | Exemples | Cycle de vie |
|-------------|----------|--------------|
| **Lot reproducteur** | "Goliath - Noyau 1" | Long terme, suivi ponte/incubation |
| **Lot pondeuses** | "Pondeuses ISA Brown - Lot 1" | ~18 mois, suivi ponte consommation |
| **Lot chair** | "Chair - Lot 12 - Août 2026" | ~45 jours, suivi croissance/poids |
| **Lot cailles** | "Cailles - Lot 1" | Long terme, suivi ponte + chair |

Chaque lot a :
- Nom, type, espèce/race
- Date de démarrage
- Effectif initial (mâles + femelles ou total)
- Effectif actuel (décrémenté par mortalité/vente)
- Statut : Actif / Terminé / Archivé
- Paramètres spécifiques (objectifs de ponte, durée d'engraissement, etc.)

### 8.2 Saisie quotidienne

Écran de saisie rapide accessible depuis le dashboard. Un formulaire par lot actif.

**Pour un lot reproducteur / pondeuse / caille :**
- Date (pré-remplie aujourd'hui)
- Nombre d'œufs pondus
- Nombre d'œufs cassés/perdus
- Nombre d'œufs collectés (= pondus - cassés)
- Mortalité du jour (nombre + cause optionnelle)
- Aliment consommé (kg)
- Notes/observations (texte libre, optionnel)
- Photo (optionnelle)

**Pour un lot chair :**
- Date
- Mortalité du jour (nombre + cause optionnelle)
- Aliment consommé (kg)
- Eau consommée (litres, optionnel)
- Poids moyen estimé (kg) — pesée d'un échantillon
- Nombre d'animaux pesés (pour l'échantillon)
- Notes/observations
- Photo (optionnelle)

**Causes de mortalité prédéfinies :**
- Maladie
- Prédateur
- Accident
- Chaleur/froid
- Inconnue
- Autre (texte libre)

### 8.3 Gestion des lots de couveuse (incubation)

Un **lot de couveuse** est un cycle d'incubation complet.

**Création d'un lot de couveuse :**
- Couveuse utilisée (si plusieurs)
- Nombre d'œufs chargés
- Lot d'origine des œufs (quel lot reproducteur/caille)
- Date de chargement → calcul automatique des dates clés :
  - Mirage J7
  - Mirage J14 (optionnel)
  - Transfert J21 (optionnel)
  - Éclosion prévue J24 (poulet) / J17 (caille)
- Statut : En cours / Mirage / Éclosion / Terminé

**Suivi du lot de couveuse :**

| Étape | Jour | Saisie |
|-------|------|--------|
| Chargement | J0 | Nombre d'œufs chargés |
| Mirage 1 | J7 | Œufs fertiles, œufs clairs (retirés), œufs morts |
| Mirage 2 | J14 | Œufs vivants, œufs morts (retirés) |
| Éclosion | J24/J17 | Poussins éclos, œufs non éclos |
| Bilan | J24+1 | Poussins vivants à J1, mortalité J0 |

**Calculs automatiques :**
- Taux de fertilité = œufs fertiles / œufs chargés
- Taux d'éclosion = poussins éclos / œufs fertiles
- Taux global = poussins éclos / œufs chargés
- Comparaison avec les objectifs configurés

**Alertes couveuse :**
- Rappel veille du mirage J7
- Rappel veille du mirage J14
- Rappel veille de l'éclosion
- Notification "Lot terminé — saisissez le bilan"

### 8.4 Gestion du cheptel reproducteur

- Suivi du ratio mâles/femelles (objectif 1:4-5)
- Alerte si le ratio est déséquilibré
- Suivi de la ponte quotidienne vs objectif
- Calcul automatique : œufs produits vs capacité couveuse → surplus vendable en tablettes
- Historique de ponte par période (jour, semaine, mois)

### 8.5 Gestion des pondeuses

- Suivi ponte quotidienne (œufs de consommation, pas féconds)
- Taux de ponte réel vs objectif
- Suivi de l'âge du lot (début de ponte, pic, déclin)
- Alerte fin de cycle prévisible (~18 mois)

### 8.6 Gestion chair

- Durée d'engraissement configurable (défaut 45 jours)
- Compte à rebours jusqu'à l'abattage prévu
- Suivi poids moyen par pesée d'échantillon
- Courbe de croissance (poids moyen par semaine)
- Calcul coût d'alimentation par animal
- Alerte J-7 avant abattage prévu
- Bilan de lot à la clôture : effectif initial, mortalité, poids moyen final, coût total, ventes, marge

### 8.7 Gestion cailles

- Même suivi que reproducteurs (ponte + incubation)
- Durée d'incubation différente (17 jours au lieu de 24)
- Produits : œufs de caille, cailles vivantes, chair de caille
- Prix de vente distincts

---

## 9. Gestion financière

### 9.1 Dépenses

**Catégories de dépenses :**
- Alimentation (aliment ponte, aliment croissance, mil, compléments)
- Santé (vaccins, médicaments, vitamines, consultation vétérinaire)
- Achat d'animaux (reproducteurs, poussins d'un jour, cailles)
- Équipement (couveuse, mangeoires, abreuvoirs, bâtiment)
- Main d'œuvre
- Transport
- Énergie (électricité, gaz)
- Autre

**Saisie d'une dépense :**
- Date
- Catégorie
- Sous-catégorie (optionnel)
- Description
- Montant (FCFA)
- Lot concerné (optionnel — permet de calculer le coût par lot)
- Photo justificatif (optionnel)
- Qui a saisi (automatique)

### 9.2 Revenus / Ventes

**Types de vente :**
- Poussins (unité)
- Œufs féconds (tablette de 30)
- Œufs de consommation (tablette de 30 ou alvéole)
- Poulets vivants (unité)
- Poulets abattus (unité ou kg)
- Cailles vivantes (unité)
- Œufs de caille (unité ou boîte)
- Chair de caille (unité ou kg)

**Saisie d'une vente :**
- Date
- Type de produit
- Quantité
- Prix unitaire (variable, pré-rempli avec le dernier prix utilisé)
- Montant total (calculé automatiquement)
- Client (sélection ou création rapide)
- Lot d'origine (optionnel)
- Statut paiement : Payé / En attente / Partiel
- Montant payé (si partiel)
- Mode de paiement : Espèces / Wave / Orange Money / Free Money / Autre
- Notes (optionnel)

### 9.3 Gestion des créances

- Liste des ventes avec paiement "En attente" ou "Partiel"
- Total des créances par client
- Historique des paiements reçus sur une vente
- Alerte si une créance dépasse X jours (configurable, défaut 30 jours)
- Bouton "Enregistrer un paiement" sur une vente en attente

### 9.4 Bilan financier

**Périodes :** Jour / Semaine / Mois / Trimestre / Année / Personnalisée

**Indicateurs :**
- Total revenus
- Total dépenses
- Résultat net (revenus - dépenses)
- Marge (%)
- Revenus par type de produit (graphique camembert)
- Dépenses par catégorie (graphique camembert)
- Évolution du résultat net (graphique en barres par mois)
- Coût par lot (dépenses affectées)
- Rentabilité par lot (revenus - dépenses du lot)

---

## 10. Gestion des stocks

### 10.1 Types de stock

| Stock | Unité | Seuil alerte par défaut |
|-------|-------|------------------------|
| Aliment ponte | kg (sac de 50 kg) | < 1 sac (50 kg) |
| Aliment croissance | kg (sac de 50 kg) | < 1 sac (50 kg) |
| Mil | kg (sac de 25 kg) | < 1 sac (25 kg) |
| Compléments/vitamines | unité | < 2 unités |
| Vaccins | dose | < 50 doses |
| Médicaments | unité | < 2 unités |
| Tablettes vides | unité | < 10 |

### 10.2 Mouvements de stock

- **Entrée** : achat (lié à une dépense), don, transfert
- **Sortie** : consommation quotidienne (lié à la saisie quotidienne), vente, perte, périmé

### 10.3 Fonctionnement

- Le stock est décrémenté automatiquement quand l'éleveur saisit la consommation d'aliment quotidienne
- Le stock est incrémenté automatiquement quand une dépense d'achat est saisie
- Historique de tous les mouvements
- Alerte push quand un stock passe sous le seuil

### 10.4 Stock d'œufs

- Œufs collectés quotidiennement (issus de la saisie)
- Œufs envoyés en couveuse (sortie → lot de couveuse)
- Œufs vendus (sortie → vente)
- Stock d'œufs disponibles = collectés - incubés - vendus - cassés
- Affiché en : nombre d'œufs ET tablettes équivalentes (÷ 30)

---

## 11. Gestion des clients

### 11.1 Fiche client

- Nom / Prénom
- Téléphone (WhatsApp)
- Ville / Quartier
- Type (Particulier / Revendeur / Éleveur)
- Notes
- Date de création
- Historique des achats
- Solde créances (montant dû)

### 11.2 Commandes

Les commandes sont saisies par l'équipe (pas d'accès client en V1).

**Saisie d'une commande :**
- Client
- Produit (poussins, œufs, poulets, etc.)
- Quantité
- Date de livraison souhaitée
- Statut : En attente / Confirmée / Livrée / Annulée
- Notes

**Fonctionnement :**
- Quand un lot de couveuse éclot, l'app affiche les commandes en attente de poussins
- Quand un lot chair arrive à terme, l'app affiche les commandes en attente de poulets
- Le vendeur peut marquer une commande comme "Livrée" → crée automatiquement une vente

---

## 12. Dashboard

### 12.1 Vue d'ensemble

**Header :**
- "Bonjour, {Prénom} !" + date du jour
- Nom de l'élevage
- Alerte badge si des actions sont requises

**Cartes stats rapides (2×2) :**
- Œufs aujourd'hui : X (↑↓ vs hier)
- Effectif total : X animaux
- Revenus du mois : X FCFA
- Alertes actives : X

**Section "Actions rapides" :**
- [+ Saisie du jour] (bouton principal)
- [+ Nouvelle vente]
- [+ Nouvelle dépense]

**Section "Lots actifs" :**
- Liste des lots actifs avec mini-stats (effectif, ponte du jour, jours restants pour chair)
- Les lots de couveuse avec compte à rebours

**Section "Indicateurs hebdo" (le tableau de bord du document) :**

| Indicateur | Objectif | Réel | Écart |
|------------|----------|------|-------|
| Œufs pondus | 98 | 92 | -6 |
| Taux de ponte | 70% | 66% | -4% |
| Mortalité | 0 | 1 | +1 |
| Aliment consommé | 20.2 kg | 21 kg | +0.8 |
| Ventes poussins | - | 39 | - |
| CA semaine | - | 46 000 F | - |

**Section "Alertes" :**
- Liste des alertes actives (stock bas, mirage à faire, etc.)

### 12.2 Graphiques

- Courbe de ponte sur 30 jours (par lot ou global)
- Barres revenus/dépenses par mois
- Camembert répartition revenus par produit
- Courbe de croissance poids (lots chair)
- Taux de mortalité par semaine
- Taux d'éclosion par lot de couveuse (historique)

---

## 13. Alertes et rappels

### 13.1 Types d'alertes

| Alerte | Déclencheur | Priorité |
|--------|-------------|----------|
| Stock aliment bas | Stock < seuil configuré | Haute |
| Mirage à faire | Veille de J7 ou J14 d'un lot couveuse | Haute |
| Éclosion prévue | Veille de J24 (poulet) ou J17 (caille) | Haute |
| Vaccination à faire | Date de rappel vaccin atteinte | Haute |
| Abattage prévu | J-7 avant fin d'un lot chair | Moyenne |
| Taux de ponte bas | Taux réel < objectif - 10% sur 7 jours | Moyenne |
| Mortalité anormale | > 2% de mortalité sur un lot en 7 jours | Haute |
| Créance ancienne | Vente impayée > X jours | Basse |
| Saisie manquante | Pas de saisie quotidienne hier | Basse |
| Ratio mâles/femelles | Ratio déséquilibré (> 1:6 ou < 1:3) | Basse |
| Fin de cycle pondeuses | Lot pondeuse > 16 mois | Moyenne |
| Commande à livrer | Commande confirmée dont la date approche | Moyenne |

### 13.2 Canaux

- **Push notification** (Firebase Cloud Messaging)
- **In-app** (écran notifications + badge)
- **WhatsApp** (via Relayio) pour les alertes critiques (optionnel, configurable)

### 13.3 Paramétrage

- Chaque type d'alerte peut être activé/désactivé
- Les seuils sont configurables (stock, mortalité, etc.)
- Heures de notification configurables (pas de notification la nuit)

---

## 14. Calendrier de vaccination

### 14.1 Protocoles

L'éleveur configure des protocoles de vaccination par type d'élevage.

**Saisie d'un protocole :**
- Nom du vaccin
- Type d'élevage concerné (reproducteur, pondeuse, chair, caille)
- Jour d'administration (J1, J7, J14, J21, J28, etc.)
- Mode d'administration (eau de boisson, injection, spray, collyre)
- Notes

**Protocoles prédéfinis (seed) :**
- Chair : Newcastle J7, Gumboro J14, Newcastle rappel J21, Gumboro rappel J28
- Pondeuses : idem + rappels trimestriels
- Reproducteurs : idem + rappels trimestriels

### 14.2 Suivi

- Quand un lot est créé avec une date de démarrage, les dates de vaccination sont calculées automatiquement
- Rappel push la veille de chaque vaccination
- L'éleveur coche "Fait" avec date et dose administrée
- Historique de vaccination par lot

---

## 15. Rapports et export

### 15.1 Rapports disponibles

| Rapport | Contenu |
|---------|---------|
| Rapport journalier | Ponte, mortalité, alimentation, ventes du jour |
| Rapport hebdomadaire | Le tableau de bord du document (12 indicateurs) |
| Rapport mensuel | Bilan financier + production + stock |
| Bilan de lot | Rapport complet d'un lot terminé (chair ou couveuse) |
| Rapport de ventes | Ventes par produit, par client, par période |
| Rapport de dépenses | Dépenses par catégorie, par lot, par période |

### 15.2 Export

- **PDF** : rapports formatés, imprimables
- **Excel** (CSV) : données brutes pour analyse
- **Partage** : via WhatsApp, email ou téléchargement

---

## 16. Paramètres

### 16.1 Paramètres de l'équipe

- Nom de l'élevage
- Localisation
- Logo/photo (optionnel)
- Devise (FCFA par défaut)
- Membres : inviter, modifier rôle, retirer
- Code d'invitation (généré automatiquement, régénérable)

### 16.2 Paramètres d'élevage

- Types d'élevage actifs
- Objectifs de production (taux ponte, fertilité, éclosion)
- Durée d'engraissement par défaut (chair)
- Seuils de stock
- Protocoles de vaccination

### 16.3 Paramètres personnels

- Profil (nom, téléphone, photo)
- Notifications (toggles par type)
- Langue (Français)
- Mode hors ligne (synchronisation manuelle ou auto)

---

## 17. Offline-first

### 17.1 Principe

L'app fonctionne **sans connexion Internet**. Toutes les saisies sont stockées localement et synchronisées quand la connexion est disponible.

### 17.2 Fonctionnement

- Les données sont stockées localement (SQLite / Hive / Drift)
- À chaque connexion, les données locales sont envoyées au serveur
- Les données du serveur sont récupérées (modifications des autres membres de l'équipe)
- En cas de conflit : la dernière modification gagne (last-write-wins) avec journalisation
- Indicateur visuel : pastille "Non synchronisé" (orange) ou "Synchronisé" (vert)

### 17.3 Données hors ligne

| Fonctionnalité | Hors ligne | Remarque |
|----------------|------------|----------|
| Saisie quotidienne | ✅ | Synchronisée après |
| Création de lot | ✅ | |
| Saisie dépense/vente | ✅ | |
| Consultation dashboard | ✅ | Données locales |
| Consultation graphiques | ✅ | Données locales |
| Inviter un membre | ❌ | Nécessite connexion |
| Export PDF | ✅ | Généré localement |
| Notifications push | ❌ | Nécessite connexion |

---

## 18. Règles métier

| ID | Règle |
|----|-------|
| RM-001 | La saisie quotidienne ne peut être faite qu'une fois par jour par lot (modifiable si erreur) |
| RM-002 | La mortalité décrémente automatiquement l'effectif du lot |
| RM-003 | Les œufs collectés alimentent le stock d'œufs disponibles |
| RM-004 | Charger une couveuse décrémente le stock d'œufs |
| RM-005 | Les poussins éclos créent un nouvel effectif (lot poussins ou lot chair) |
| RM-006 | Une vente décrémente le stock correspondant (œufs, poussins, poulets) |
| RM-007 | Un achat d'aliment incrémente le stock et crée une dépense |
| RM-008 | La consommation d'aliment quotidienne décrémente le stock |
| RM-009 | Le coût par animal = total dépenses du lot / effectif initial |
| RM-010 | La marge par lot = revenus du lot - dépenses du lot |
| RM-011 | Un lot terminé ne peut plus être modifié (mais reste consultable) |
| RM-012 | Le taux de ponte = œufs pondus / (nombre de femelles × jours) × 100 |
| RM-013 | Le surplus d'œufs = production - capacité couveuse (vendable en tablettes) |
| RM-014 | Seul le propriétaire peut gérer les membres et supprimer l'équipe |
| RM-015 | Toutes les modifications sont historisées (audit trail) |
| RM-016 | Les objectifs sont comparés aux résultats réels dans le dashboard |
| RM-017 | Les alertes sont calculées localement (fonctionnent hors ligne) |
| RM-018 | Le stock ne peut pas être négatif (alerte si saisie impossible) |
| RM-019 | Une commande "Livrée" génère automatiquement une vente |
| RM-020 | Le prix de vente est variable et pré-rempli avec le dernier prix utilisé |

---

## 19. Cas limites

| Situation | Comportement |
|-----------|-------------|
| Deux membres saisissent le même jour en hors ligne | Last-write-wins à la synchronisation, notification au premier |
| Stock à zéro mais saisie de consommation | Alerte "Stock insuffisant" mais saisie autorisée (le stock passe négatif pour ne pas bloquer) |
| Lot chair avec 100% mortalité | Le lot est automatiquement marqué "Terminé" avec flag "Mortalité totale" |
| Membre retiré de l'équipe | Ses saisies restent, il perd l'accès |
| Propriétaire quitte l'app | Il doit transférer le rôle propriétaire avant |
| Pas de connexion pendant 30 jours | Les données locales sont conservées, synchronisation au retour |
| Erreur de saisie hier | L'éleveur peut modifier une saisie passée (journalisé) |
| Lot couveuse oublié (éclosion passée) | L'app rappelle mais permet la saisie rétroactive |

---

## 20. Performances

- Temps de chargement < 2 secondes
- Saisie quotidienne < 30 secondes par lot
- Pagination sur toutes les listes
- Compression des photos
- Synchronisation en arrière-plan (non bloquante)
- Dashboard calculé localement pour la réactivité

---

## 21. Sécurité

- JWT + Refresh Token
- OTP via Relayio (pas de mot de passe)
- Rate Limiting
- Validation de toutes les entrées (serveur)
- Protection XSS, CSRF, SQL Injection
- Soft Delete sur toutes les entités
- Audit trail sur toutes les modifications
- Données d'équipe isolées (row-level security)
- HTTPS obligatoire
- Chiffrement local des données sensibles

---

## 22. Accessibilité

- Interface ultra-simple pour éleveurs peu familiers avec le numérique
- Gros boutons (48px min)
- Zones tactiles min 48x48px
- Icônes avec texte (jamais seules)
- Messages d'erreur simples en français courant
- Max 3 niveaux de navigation
- Saisie quotidienne en moins de 30 secondes
- Utilisable en plein soleil (contrastes élevés)

---

## 23. Stack technique

| Composant | Technologie |
|-----------|-------------|
| Mobile | Flutter (Android + iOS) |
| Backend | NestJS |
| Base de données serveur | PostgreSQL |
| ORM | Prisma |
| Base de données locale | Drift (SQLite) ou Hive |
| Synchronisation | Custom sync engine (last-write-wins) |
| Auth | JWT + OTP (Relayio) |
| Push notifications | Firebase Cloud Messaging |
| WhatsApp alertes | Relayio |
| Stockage photos | S3 compatible (Hetzner Object Storage) |
| Hébergement | Hetzner + Coolify |
| PDF generation | Flutter pdf package (local) |
| Graphiques | fl_chart |
