class ApiEndpoints {
  ApiEndpoints._();

  // Production
  static const String baseUrl = 'https://api.guettgui.com/v1';
  // Dev Android emulateur : 'http://10.0.2.2:3002/v1'
  // Dev web/iOS : 'http://localhost:3002/v1'

  // --- AUTH ---
  static const String sendOtp = '/auth/send-otp';
  static const String verifyOtp = '/auth/verify-otp';
  static const String refreshToken = '/auth/refresh';
  static const String logout = '/auth/logout';

  // --- USERS ---
  static const String userMe = '/users/me';

  // --- TEAMS ---
  static const String teams = '/teams';
  static String teamById(String id) => '/teams/$id';
  static const String joinTeam = '/teams/join';
  static String teamMembers(String teamId) => '/teams/$teamId/members';
  static String removeMember(String teamId, String memberId) =>
      '/teams/$teamId/members/$memberId';
  static String regenerateInvite(String teamId) =>
      '/teams/$teamId/regenerate-invite';

  // --- FLOCKS ---
  static String flocks(String teamId) => '/teams/$teamId/flocks';
  static String flockById(String teamId, String id) =>
      '/teams/$teamId/flocks/$id';
  static String closeFlock(String teamId, String id) =>
      '/teams/$teamId/flocks/$id/close';

  // --- DAILY RECORDS ---
  static String dailyRecords(String teamId) =>
      '/teams/$teamId/daily-records';
  static String dailyRecordById(String teamId, String id) =>
      '/teams/$teamId/daily-records/$id';
  static String flockDailyRecords(String teamId, String flockId) =>
      '/teams/$teamId/flocks/$flockId/daily-records';

  // --- INCUBATION ---
  static String incubators(String teamId) => '/teams/$teamId/incubators';
  static String incubationBatches(String teamId) =>
      '/teams/$teamId/incubation-batches';
  static String incubationBatchById(String teamId, String id) =>
      '/teams/$teamId/incubation-batches/$id';
  static String candling1(String teamId, String id) =>
      '/teams/$teamId/incubation-batches/$id/candling-1';
  static String candling2(String teamId, String id) =>
      '/teams/$teamId/incubation-batches/$id/candling-2';
  static String hatchResult(String teamId, String id) =>
      '/teams/$teamId/incubation-batches/$id/hatch';

  // --- FINANCES ---
  static String expenses(String teamId) => '/teams/$teamId/expenses';
  static String expenseById(String teamId, String id) =>
      '/teams/$teamId/expenses/$id';
  static String sales(String teamId) => '/teams/$teamId/sales';
  static String saleById(String teamId, String id) =>
      '/teams/$teamId/sales/$id';
  static String salePayments(String teamId, String saleId) =>
      '/teams/$teamId/sales/$saleId/payments';
  static String financeSummary(String teamId) =>
      '/teams/$teamId/finances/summary';

  // --- STOCKS ---
  static String stocksEndpoint(String teamId) => '/teams/$teamId/stocks';
  static String stockMoves(String teamId, String stockId) =>
      '/teams/$teamId/stocks/$stockId/moves';
  static String adjustStock(String teamId, String stockId) =>
      '/teams/$teamId/stocks/$stockId/adjust';

  // --- CUSTOMERS ---
  static String customersEndpoint(String teamId) =>
      '/teams/$teamId/customers';
  static String customerById(String teamId, String id) =>
      '/teams/$teamId/customers/$id';

  // --- ORDERS ---
  static String ordersEndpoint(String teamId) => '/teams/$teamId/orders';
  static String orderStatus(String teamId, String id) =>
      '/teams/$teamId/orders/$id/status';

  // --- ALERTS ---
  static String alerts(String teamId) => '/teams/$teamId/alerts';
  static String alertRead(String teamId, String id) =>
      '/teams/$teamId/alerts/$id/read';
  static String alertDismiss(String teamId, String id) =>
      '/teams/$teamId/alerts/$id/dismiss';

  // --- VACCINATION ---
  static String vaccinationProtocols(String teamId) =>
      '/teams/$teamId/vaccination-protocols';
  static String vaccinations(String teamId) =>
      '/teams/$teamId/vaccinations';
  static String vaccinationDone(String teamId, String id) =>
      '/teams/$teamId/vaccinations/$id/done';

  // --- REPORTS ---
  static String reportDaily(String teamId) =>
      '/teams/$teamId/reports/daily';
  static String reportWeekly(String teamId) =>
      '/teams/$teamId/reports/weekly';
  static String reportMonthly(String teamId) =>
      '/teams/$teamId/reports/monthly';
  static String reportFlock(String teamId, String flockId) =>
      '/teams/$teamId/reports/flock/$flockId';

  // --- SYNC ---
  static const String syncPush = '/sync/push';
  static const String syncPull = '/sync/pull';

  // --- UPLOAD ---
  static const String upload = '/upload';
}
