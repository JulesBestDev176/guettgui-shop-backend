import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/dashboard/domain/entities/dashboard_stats.dart';
import 'package:guettgui_mobile/features/dashboard/presentation/providers/dashboard_data_provider.dart';
// --- Dashboard Stats Provider (from API) ---
final dashboardStatsProvider =
    FutureProvider.autoDispose<DashboardStats>((ref) async {
  final teamIdAsync = ref.watch(currentTeamIdProvider);
  final teamId = teamIdAsync.valueOrNull;
  if (teamId == null) return const DashboardStats();

  try {
    final repo = ref.watch(dashboardRepositoryProvider);
    return await repo.getDashboardStats(teamId);
  } catch (e) {
    debugPrint('[DashboardProvider] Erreur stats: $e');
    return const DashboardStats();
  }
});

// --- Active Flocks Summary Provider (from API) ---
final activeFlocksSummaryProvider =
    FutureProvider.autoDispose<List<FlockSummary>>((ref) async {
  final teamIdAsync = ref.watch(currentTeamIdProvider);
  final teamId = teamIdAsync.valueOrNull;
  if (teamId == null) return [];

  try {
    final datasource = ref.watch(dashboardRemoteDataSourceProvider);
    final rawFlocks = await datasource.getActiveFlocks(teamId);
    return rawFlocks.map((json) => FlockSummary.fromJson(json)).toList();
  } catch (e) {
    debugPrint('[DashboardProvider] Erreur flocks actifs: $e');
    return [];
  }
});

// --- Active Alerts Provider (from API) ---
final activeAlertsProvider =
    FutureProvider.autoDispose<List<AlertSummary>>((ref) async {
  final teamIdAsync = ref.watch(currentTeamIdProvider);
  final teamId = teamIdAsync.valueOrNull;
  if (teamId == null) return [];

  try {
    final datasource = ref.watch(dashboardRemoteDataSourceProvider);
    final rawAlerts = await datasource.getActiveAlerts(teamId);
    return rawAlerts
        .where((json) => json['isDismissed'] != true)
        .map((json) => AlertSummary.fromJson(json))
        .toList();
  } catch (e) {
    debugPrint('[DashboardProvider] Erreur alertes: $e');
    return [];
  }
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

  factory FlockSummary.fromJson(Map<String, dynamic> json) {
    return FlockSummary(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      type: json['type'] as String? ?? '',
      currentTotal: json['currentTotal'] as int? ?? 0,
      eggsToday: json['eggsToday'] as int?,
      daysRemaining: json['daysRemaining'] as int?,
      status: json['status'] as String? ?? 'ACTIVE',
    );
  }
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

  factory AlertSummary.fromJson(Map<String, dynamic> json) {
    return AlertSummary(
      id: json['id'] as String? ?? '',
      type: json['type'] as String? ?? '',
      title: json['title'] as String? ?? '',
      message: json['message'] as String? ?? '',
      priority: json['priority'] as String? ?? 'LOW',
    );
  }
}
