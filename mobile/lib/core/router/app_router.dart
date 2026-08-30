import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/features/auth/presentation/screens/onboarding_screen.dart';
import 'package:guettgui_mobile/features/auth/presentation/screens/phone_input_screen.dart';
import 'package:guettgui_mobile/features/auth/presentation/screens/splash_screen.dart';
import 'package:guettgui_mobile/features/auth/presentation/screens/team_setup_screen.dart';
import 'package:guettgui_mobile/features/customers/presentation/screens/create_customer_screen.dart';
import 'package:guettgui_mobile/features/customers/presentation/screens/customer_detail_screen.dart';
import 'package:guettgui_mobile/features/customers/presentation/screens/customers_list_screen.dart';
import 'package:guettgui_mobile/features/daily_records/presentation/screens/daily_record_history_screen.dart';
import 'package:guettgui_mobile/features/daily_records/presentation/screens/daily_record_screen.dart';
import 'package:guettgui_mobile/features/dashboard/presentation/screens/dashboard_screen.dart';
import 'package:guettgui_mobile/features/dashboard/presentation/screens/main_shell.dart';
import 'package:guettgui_mobile/features/finances/presentation/screens/create_expense_screen.dart';
import 'package:guettgui_mobile/features/finances/presentation/screens/create_sale_screen.dart';
import 'package:guettgui_mobile/features/finances/presentation/screens/financial_report_screen.dart';
import 'package:guettgui_mobile/features/finances/presentation/screens/finances_screen.dart';
import 'package:guettgui_mobile/features/flocks/presentation/screens/close_flock_screen.dart';
import 'package:guettgui_mobile/features/flocks/presentation/screens/create_flock_screen.dart';
import 'package:guettgui_mobile/features/flocks/presentation/screens/flock_detail_screen.dart';
import 'package:guettgui_mobile/features/flocks/presentation/screens/flocks_list_screen.dart';
import 'package:guettgui_mobile/features/incubation/presentation/screens/candling_screen.dart';
import 'package:guettgui_mobile/features/incubation/presentation/screens/create_batch_screen.dart';
import 'package:guettgui_mobile/features/incubation/presentation/screens/hatch_result_screen.dart';
import 'package:guettgui_mobile/features/incubation/presentation/screens/incubation_list_screen.dart';
import 'package:guettgui_mobile/features/notifications/presentation/screens/notifications_screen.dart';
import 'package:guettgui_mobile/features/orders/presentation/screens/create_order_screen.dart';
import 'package:guettgui_mobile/features/orders/presentation/screens/orders_list_screen.dart';
import 'package:guettgui_mobile/features/profile/presentation/screens/profile_screen.dart';
import 'package:guettgui_mobile/features/settings/presentation/screens/settings_screen.dart';
import 'package:guettgui_mobile/features/stocks/presentation/screens/stock_history_screen.dart';
import 'package:guettgui_mobile/features/stocks/presentation/screens/stocks_screen.dart';
import 'package:guettgui_mobile/features/team/presentation/screens/team_screen.dart';
import 'package:guettgui_mobile/features/reports/presentation/screens/reports_screen.dart';
import 'package:guettgui_mobile/features/vaccination/presentation/screens/create_protocol_screen.dart';
import 'package:guettgui_mobile/features/vaccination/presentation/screens/protocol_list_screen.dart';
import 'package:guettgui_mobile/features/vaccination/presentation/screens/vaccination_calendar_screen.dart';

abstract class AppRoutes {
  static const splash = '/';
  static const onboarding = '/onboarding';
  static const phone = '/auth/phone';
  static const teamSetup = '/auth/setup-team';
  static const dashboard = '/dashboard';
  static const flocks = '/flocks';
  static const flockDetail = '/flocks/:id';
  static const createFlock = '/flocks/create';
  static const closeFlock = '/flocks/:id/close';
  static const dailyRecord = '/daily-record/:flockId';
  static const dailyRecordHistory = '/daily-record-history/:flockId';
  static const incubation = '/incubation';
  static const createBatch = '/incubation/create';
  static const candling = '/incubation/:id/candling';
  static const hatchResult = '/incubation/:id/hatch';
  static const finances = '/finances';
  static const createExpense = '/finances/expenses/create';
  static const createSale = '/finances/sales/create';
  static const financialReport = '/finances/report';
  static const stocksRoute = '/stocks';
  static const stockHistory = '/stocks/:id/history';
  static const customersRoute = '/customers';
  static const customerDetail = '/customers/:id';
  static const createCustomer = '/customers/create';
  static const ordersRoute = '/orders';
  static const createOrder = '/orders/create';
  static const vaccination = '/vaccination';
  static const vaccinationProtocols = '/vaccination/protocols';
  static const createProtocol = '/vaccination/protocols/create';
  static const notifications = '/notifications';
  static const teamRoute = '/team';
  static const settingsRoute = '/settings';
  static const profile = '/profile';
  static const reports = '/reports';
}

// ---------------------------------------------------------------------------
// Transition helper : slide de droite a gauche
// ---------------------------------------------------------------------------

CustomTransitionPage<void> buildSlideTransition(
  Widget child,
  GoRouterState state,
) {
  return CustomTransitionPage(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(1.0, 0.0),
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
        )),
        child: child,
      );
    },
    transitionDuration: const Duration(milliseconds: 300),
  );
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  // PAS de guard auth — navigation libre
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.splash,
    routes: [
      // ===== AUTH FLOW =====
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.phone,
        pageBuilder: (context, state) => buildSlideTransition(
          const PhoneInputScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.teamSetup,
        pageBuilder: (context, state) => buildSlideTransition(
          const TeamSetupScreen(),
          state,
        ),
      ),

      // ===== SHELL : BOTTOM NAV =====
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.dashboard,
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DashboardScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.flocks,
            pageBuilder: (context, state) => const NoTransitionPage(
              child: FlocksListScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.finances,
            pageBuilder: (context, state) => const NoTransitionPage(
              child: FinancesScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.profile,
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfileScreen(),
            ),
          ),
        ],
      ),

      // ===== FLOCKS =====
      GoRoute(
        path: AppRoutes.flockDetail,
        pageBuilder: (context, state) => buildSlideTransition(
          FlockDetailScreen(flockId: state.pathParameters['id']!),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createFlock,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateFlockScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.closeFlock,
        pageBuilder: (context, state) => buildSlideTransition(
          CloseFlockScreen(flockId: state.pathParameters['id']!),
          state,
        ),
      ),

      // ===== DAILY RECORDS =====
      GoRoute(
        path: AppRoutes.dailyRecord,
        pageBuilder: (context, state) => buildSlideTransition(
          DailyRecordScreen(flockId: state.pathParameters['flockId']!),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.dailyRecordHistory,
        pageBuilder: (context, state) => buildSlideTransition(
          DailyRecordHistoryScreen(
            flockId: state.pathParameters['flockId']!,
          ),
          state,
        ),
      ),

      // ===== INCUBATION =====
      GoRoute(
        path: AppRoutes.incubation,
        pageBuilder: (context, state) => buildSlideTransition(
          const IncubationListScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createBatch,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateBatchScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.candling,
        pageBuilder: (context, state) => buildSlideTransition(
          CandlingScreen(batchId: state.pathParameters['id']!),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.hatchResult,
        pageBuilder: (context, state) => buildSlideTransition(
          HatchResultScreen(batchId: state.pathParameters['id']!),
          state,
        ),
      ),

      // ===== FINANCES (detail/create) =====
      GoRoute(
        path: AppRoutes.createExpense,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateExpenseScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createSale,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateSaleScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.financialReport,
        pageBuilder: (context, state) => buildSlideTransition(
          const FinancialReportScreen(),
          state,
        ),
      ),

      // ===== STOCKS =====
      GoRoute(
        path: AppRoutes.stocksRoute,
        pageBuilder: (context, state) => buildSlideTransition(
          const StocksScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.stockHistory,
        pageBuilder: (context, state) => buildSlideTransition(
          StockHistoryScreen(stockId: state.pathParameters['id']!),
          state,
        ),
      ),

      // ===== CUSTOMERS =====
      GoRoute(
        path: AppRoutes.customersRoute,
        pageBuilder: (context, state) => buildSlideTransition(
          const CustomersListScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.customerDetail,
        pageBuilder: (context, state) => buildSlideTransition(
          CustomerDetailScreen(customerId: state.pathParameters['id']!),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createCustomer,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateCustomerScreen(),
          state,
        ),
      ),

      // ===== ORDERS =====
      GoRoute(
        path: AppRoutes.ordersRoute,
        pageBuilder: (context, state) => buildSlideTransition(
          const OrdersListScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createOrder,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateOrderScreen(),
          state,
        ),
      ),

      // ===== VACCINATION =====
      GoRoute(
        path: AppRoutes.vaccination,
        pageBuilder: (context, state) => buildSlideTransition(
          const VaccinationCalendarScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.vaccinationProtocols,
        pageBuilder: (context, state) => buildSlideTransition(
          const ProtocolListScreen(),
          state,
        ),
      ),
      GoRoute(
        path: AppRoutes.createProtocol,
        pageBuilder: (context, state) => buildSlideTransition(
          const CreateProtocolScreen(),
          state,
        ),
      ),

      // ===== NOTIFICATIONS =====
      GoRoute(
        path: AppRoutes.notifications,
        pageBuilder: (context, state) => buildSlideTransition(
          const NotificationsScreen(),
          state,
        ),
      ),

      // ===== TEAM =====
      GoRoute(
        path: AppRoutes.teamRoute,
        pageBuilder: (context, state) => buildSlideTransition(
          const TeamScreen(),
          state,
        ),
      ),

      // ===== SETTINGS =====
      GoRoute(
        path: AppRoutes.settingsRoute,
        pageBuilder: (context, state) => buildSlideTransition(
          const SettingsScreen(),
          state,
        ),
      ),

      // ===== REPORTS =====
      GoRoute(
        path: AppRoutes.reports,
        pageBuilder: (context, state) => buildSlideTransition(
          const ReportsScreen(),
          state,
        ),
      ),
    ],
  );
});
