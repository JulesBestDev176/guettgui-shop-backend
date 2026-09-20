class AppStrings {
  AppStrings._();

  // --- APP ---
  static const String appName = 'Guett Gui';
  static const String appTagline = 'Gestion d\'elevage avicole';

  // --- AUTH ---
  static const String welcomeBack = 'Bon retour !';
  static const String phoneLabel = 'Numero de telephone';
  static const String phoneHint = '+221 7X XXX XX XX';
  static const String phonePrefix = '+221';
  static const String loginButton = 'Se connecter';
  static const String startButton = 'Commencer';

  // --- ONBOARDING ---
  static const String onboarding1Title = 'Gerez votre elevage simplement.';
  static const String onboarding1Desc =
      'Suivez votre production, vos finances et vos stocks au quotidien.';
  static const String onboarding2Title =
      'Des donnees fiables, de meilleures decisions.';
  static const String onboarding2Desc =
      'Dashboard, alertes et rapports pour piloter votre rentabilite.';
  static const String onboarding3Title = 'Travaillez en equipe.';
  static const String onboarding3Desc =
      'Invitez vos collaborateurs et partagez le suivi en temps reel.';

  // --- TEAM SETUP ---
  static const String teamSetupTitle = 'Votre elevage';
  static const String createTeam = 'Creer un elevage';
  static const String joinTeam = 'Rejoindre un elevage';
  static const String teamName = 'Nom de l\'elevage';
  static const String teamLocation = 'Localisation';
  static const String inviteCode = 'Code d\'invitation';
  static const String joinButton = 'Rejoindre';

  // --- PROFILE ---
  static const String firstName = 'Prenom';
  static const String lastName = 'Nom';
  static const String continueButton = 'Continuer';
  static const String profile = 'Profil';
  static const String editProfile = 'Modifier le profil';
  static const String logout = 'Deconnexion';
  static const String logoutConfirm =
      'Voulez-vous vraiment vous deconnecter ?';

  // --- FARMING SETTINGS (merged into settings) ---
  static const String breederType = 'Reproducteurs';
  static const String layerType = 'Pondeuses';
  static const String broilerType = 'Poulets de chair';
  static const String quailType = 'Cailles';
  static const String females = 'Femelles';
  static const String males = 'Males';
  static const String layingRateTarget = 'Taux de ponte cible (%)';
  static const String fertilityRateTarget = 'Taux de fertilite cible (%)';
  static const String hatchRateTarget = 'Taux d\'eclosion cible (%)';

  // --- DASHBOARD ---
  static const String greeting = 'Bonjour';
  static const String dashboard = 'Tableau de bord';
  static const String eggsToday = 'Oeufs aujourd\'hui';
  static const String totalEffective = 'Effectif total';
  static const String monthRevenue = 'Revenus du mois';
  static const String activeAlerts = 'Alertes';
  static const String totalRevenue = 'Total revenus';
  static const String activeFlocksSection = 'Lots actifs';
  static const String alertsSection = 'Alertes';
  static const String seeAll = 'Voir tout';

  // --- BOTTOM NAV ---
  static const String navDashboard = 'Accueil';
  static const String navFlocks = 'Elevage';
  static const String navAdd = 'Plus';
  static const String navFinances = 'Finances';
  static const String navProfile = 'Profil';

  // --- FLOCKS ---
  static const String flocks = 'Lots';
  static const String createFlock = 'Nouveau lot';
  static const String flockName = 'Nom du lot';
  static const String flockType = 'Type d\'elevage';
  static const String startDate = 'Date de demarrage';
  static const String initialFemales = 'Femelles au demarrage';
  static const String initialMales = 'Males au demarrage';
  static const String initialTotal = 'Effectif initial';
  static const String currentTotal = 'Effectif actuel';
  static const String statusActive = 'Actif';
  static const String statusCompleted = 'Termine';
  static const String statusArchived = 'Archive';
  static const String closeFlock = 'Cloturer le lot';
  static const String closeFlockConfirm =
      'Voulez-vous vraiment cloturer ce lot ?';

  // --- DAILY RECORDS ---
  static const String dailyRecord = 'Saisie du jour';
  static const String dailyRecordHistory = 'Historique saisies';
  static const String eggsLaid = 'Oeufs pondus';
  static const String eggsBroken = 'Oeufs casses';
  static const String eggsCollected = 'Oeufs collectes';
  static const String mortality = 'Mortalite';
  static const String mortalityCount = 'Nombre de morts';
  static const String mortalityCause = 'Cause';
  static const String feedConsumed = 'Aliment consomme (kg)';
  static const String waterConsumed = 'Eau consommee (L)';
  static const String avgWeight = 'Poids moyen (kg)';
  static const String sampleSize = 'Taille echantillon';
  static const String notes = 'Notes / Observations';
  static const String saveRecord = 'Enregistrer la saisie';

  // --- MORTALITY CAUSES ---
  static const String causeMaladie = 'Maladie';
  static const String causePredateur = 'Predateur';
  static const String causeAccident = 'Accident';
  static const String causeChaleur = 'Chaleur/Froid';
  static const String causeInconnue = 'Inconnue';
  static const String causeAutre = 'Autre';

  // --- INCUBATION ---
  static const String incubation = 'Incubation';
  static const String createBatch = 'Nouveau lot couveuse';
  static const String eggsLoaded = 'Oeufs charges';
  static const String loadDate = 'Date de chargement';
  static const String mirageJ7 = 'Mirage J7';
  static const String mirageJ14 = 'Mirage J14';
  static const String hatchDate = 'Eclosion prevue';
  static const String fertileEggs = 'Oeufs fertiles';
  static const String clearEggs = 'Oeufs clairs';
  static const String deadEmbryos = 'Embryons morts';
  static const String chicksHatched = 'Poussins eclos';
  static const String unhatchedEggs = 'Oeufs non eclos';
  static const String fertilityRate = 'Taux de fertilite';
  static const String hatchRate = 'Taux d\'eclosion';
  static const String globalRate = 'Taux global';
  static const String candling = 'Mirage';
  static const String hatchResult = 'Resultat eclosion';
  static const String daysRemaining = 'jours restants';

  // --- FINANCES ---
  static const String finances = 'Finances';
  static const String expenses = 'Depenses';
  static const String sales = 'Ventes';
  static const String debts = 'Creances';
  static const String financialReport = 'Rapport financier';
  static const String addExpense = 'Nouvelle depense';
  static const String addSale = 'Nouvelle vente';
  static const String totalExpenses = 'Total depenses';
  static const String totalSales = 'Total ventes';
  static const String netResult = 'Resultat net';
  static const String margin = 'Marge';
  static const String amount = 'Montant';
  static const String category = 'Categorie';
  static const String description = 'Description';
  static const String date = 'Date';
  static const String productType = 'Type de produit';
  static const String quantity = 'Quantite';
  static const String unitPrice = 'Prix unitaire';
  static const String totalAmount = 'Montant total';
  static const String client = 'Client';
  static const String paymentStatus = 'Statut paiement';
  static const String paymentMode = 'Mode de paiement';
  static const String paid = 'Paye';
  static const String pending = 'En attente';
  static const String partial = 'Partiel';
  static const String resume = 'Resume';

  // --- EXPENSE CATEGORIES ---
  static const String catAlimentation = 'Alimentation';
  static const String catSante = 'Sante';
  static const String catAchatAnimaux = 'Achat d\'animaux';
  static const String catEquipement = 'Equipement';
  static const String catMainOeuvre = 'Main d\'oeuvre';
  static const String catTransport = 'Transport';
  static const String catEnergie = 'Energie';
  static const String catAutre = 'Autre';

  // --- PAYMENT MODES ---
  static const String especes = 'Especes';
  static const String wave = 'Wave';
  static const String orangeMoney = 'Orange Money';
  static const String freeMoney = 'Free Money';
  static const String paymentAutre = 'Autre';

  // --- STOCKS ---
  static const String stocks = 'Stocks';
  static const String stockHistory = 'Historique mouvements';
  static const String currentStock = 'Stock actuel';
  static const String threshold = 'Seuil alerte';
  static const String adjustStock = 'Ajuster le stock';

  // --- CUSTOMERS ---
  static const String customers = 'Clients';
  static const String addCustomer = 'Nouveau client';
  static const String customerName = 'Nom du client';
  static const String phone = 'Telephone';
  static const String city = 'Ville';
  static const String customerType = 'Type';
  static const String typeParticulier = 'Particulier';
  static const String typeRevendeur = 'Revendeur';
  static const String typeEleveur = 'Eleveur';
  static const String purchaseHistory = 'Historique achats';
  static const String outstandingDebt = 'Solde du';

  // --- ORDERS ---
  static const String orders = 'Commandes';
  static const String addOrder = 'Nouvelle commande';
  static const String deliveryDate = 'Date de livraison';
  static const String orderStatus = 'Statut';
  static const String statusPending = 'En attente';
  static const String statusConfirmed = 'Confirmee';
  static const String statusDelivered = 'Livree';
  static const String statusCancelled = 'Annulee';

  // --- VACCINATION ---
  static const String vaccination = 'Vaccination';
  static const String vaccinationCalendar = 'Calendrier vaccinal';
  static const String protocols = 'Protocoles';
  static const String addProtocol = 'Nouveau protocole';
  static const String vaccineName = 'Nom du vaccin';
  static const String adminDay = 'Jour d\'administration';
  static const String adminMode = 'Mode d\'administration';
  static const String markDone = 'Marquer fait';

  // --- NOTIFICATIONS ---
  static const String notifications = 'Notifications';
  static const String noNotifications = 'Aucune notification';
  static const String markRead = 'Marquer comme lu';
  static const String markAllRead = 'Tout lire';

  // --- TEAM ---
  static const String team = 'Equipe';
  static const String members = 'Membres';
  static const String inviteMember = 'Inviter un membre';
  static const String owner = 'Proprietaire';
  static const String member = 'Membre';
  static const String removeMember = 'Retirer';
  static const String manageTeam = 'Gerer l\'equipe';
  static const String inviteCodeTitle = 'Code d\'invitation';
  static const String shareCode = 'Partager';
  static const String copyCode = 'Copier le code';

  // --- SETTINGS ---
  static const String settings = 'Parametres';
  static const String farmingSettings = 'Parametres elevage';
  static const String personalSettings = 'Parametres personnels';
  static const String notificationSettings = 'Notifications';
  static const String language = 'Langue';
  static const String offlineMode = 'Mode hors ligne';
  static const String syncManual = 'Synchronisation manuelle';
  static const String syncAuto = 'Synchronisation automatique';
  static const String productionTargets = 'Objectifs de production';
  static const String stockThresholds = 'Seuils de stock';
  static const String aboutApp = 'A propos';

  // --- REPORTS ---
  static const String reports = 'Rapports';
  static const String dailyReport = 'Rapport journalier';
  static const String weeklyReport = 'Rapport hebdomadaire';
  static const String monthlyReport = 'Rapport mensuel';
  static const String flockReport = 'Bilan de lot';
  static const String exportPdf = 'Exporter PDF';
  static const String exportCsv = 'Exporter CSV';
  static const String generate = 'Generer';
  static const String shareReport = 'Partager le rapport';

  // --- GENERAL ---
  static const String save = 'Enregistrer';
  static const String cancel = 'Annuler';
  static const String delete = 'Supprimer';
  static const String edit = 'Modifier';
  static const String confirm = 'Confirmer';
  static const String retry = 'Reessayer';
  static const String loading = 'Chargement...';
  static const String noData = 'Aucune donnee';
  static const String error = 'Erreur';
  static const String success = 'Succes';
  static const String search = 'Rechercher';
  static const String filter = 'Filtrer';
  static const String all = 'Tous';
  static const String today = 'Aujourd\'hui';
  static const String yesterday = 'Hier';
  static const String thisWeek = 'Cette semaine';
  static const String thisMonth = 'Ce mois';
  static const String photo = 'Photo';
  static const String addPhoto = 'Ajouter une photo';

  // --- SYNC ---
  static const String syncSynced = 'Synchronise';
  static const String syncPending = 'en attente';
  static const String syncError = 'Erreur de sync';
  static const String syncOffline = 'Hors ligne';

  // --- EMPTY STATES ---
  static const String emptyFlocks = 'Aucun lot pour le moment';
  static const String emptyFlocksDesc =
      'Creez votre premier lot pour commencer le suivi.';
  static const String emptyRecords = 'Aucune saisie';
  static const String emptyRecordsDesc =
      'Les saisies quotidiennes apparaitront ici.';
  static const String emptyFinances = 'Aucune transaction';
  static const String emptyFinancesDesc =
      'Vos depenses et ventes apparaitront ici.';
  static const String emptyCustomers = 'Aucun client';
  static const String emptyCustomersDesc =
      'Ajoutez vos clients pour suivre les ventes.';
  static const String emptyOrders = 'Aucune commande';
  static const String emptyOrdersDesc = 'Les commandes apparaitront ici.';
  static const String emptyAlerts = 'Tout va bien !';
  static const String emptyAlertsDesc =
      'Aucune alerte active pour le moment.';
  static const String emptyNotifications = 'Pas de notifications';
  static const String emptyNotificationsDesc =
      'Vous serez notifie des evenements importants.';
}
