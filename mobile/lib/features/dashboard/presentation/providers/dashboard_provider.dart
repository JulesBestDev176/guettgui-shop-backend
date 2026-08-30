import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/features/dashboard/domain/entities/dashboard_stats.dart';

final dashboardStatsProvider = StateProvider<DashboardStats>((ref) {
  // Mock data for now; will connect to repository later
  return const DashboardStats(
    eggsToday: 142,
    eggsDiff: 5,
    totalEffective: 520,
    monthRevenue: 850000,
    activeAlerts: 3,
    totalRevenue: 2450000,
    revenueTrend: 12.5,
  );
});

final activeFlocksSummaryProvider =
    StateProvider<List<FlockSummary>>((ref) {
  return [
    const FlockSummary(
      id: '1',
      name: 'Goliath - Noyau 1',
      type: 'BREEDER',
      currentTotal: 200,
      eggsToday: 142,
      status: 'ACTIVE',
    ),
    const FlockSummary(
      id: '2',
      name: 'Chair - Lot 12',
      type: 'BROILER',
      currentTotal: 300,
      daysRemaining: 15,
      status: 'ACTIVE',
    ),
    const FlockSummary(
      id: '3',
      name: 'Pondeuses - Lot 3',
      type: 'LAYER',
      currentTotal: 150,
      eggsToday: 98,
      status: 'ACTIVE',
    ),
  ];
});

final activeAlertsProvider = StateProvider<List<AlertSummary>>((ref) {
  return [
    const AlertSummary(
      id: '1',
      type: 'LOW_STOCK',
      title: 'Stock aliment bas',
      message: 'Aliment pondeuse : 40 kg restants',
      priority: 'HIGH',
    ),
    const AlertSummary(
      id: '2',
      type: 'CANDLING_DUE',
      title: 'Mirage a faire demain',
      message: 'Lot Incubation #5 - J7',
      priority: 'HIGH',
    ),
    const AlertSummary(
      id: '3',
      type: 'MISSING_RECORD',
      title: 'Saisie manquante',
      message: 'Lot Chair #12 - Hier',
      priority: 'LOW',
    ),
  ];
});

class FlockSummary {
  final String id;
  final String name;
  final String type;
  final int currentTotal;
  final int? eggsToday;
  final int? daysRemaining;
  final String status;

  const FlockSummary({
    required this.id,
    required this.name,
    required this.type,
    required this.currentTotal,
    this.eggsToday,
    this.daysRemaining,
    required this.status,
  });
}

class AlertSummary {
  final String id;
  final String type;
  final String title;
  final String message;
  final String priority;

  const AlertSummary({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.priority,
  });
}
