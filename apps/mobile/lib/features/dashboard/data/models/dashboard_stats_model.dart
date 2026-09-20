import 'package:guettgui_mobile/features/dashboard/domain/entities/dashboard_stats.dart';

class DashboardStatsModel extends DashboardStats {
  const DashboardStatsModel({
    required super.eggsToday,
    required super.eggsDiff,
    required super.totalEffective,
    required super.monthRevenue,
    required super.activeAlerts,
    required super.totalRevenue,
    super.revenueTrend,
  });

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) {
    return DashboardStatsModel(
      eggsToday: json['eggsToday'] as int? ?? 0,
      eggsDiff: json['eggsDiff'] as int? ?? 0,
      totalEffective: json['totalEffective'] as int? ?? 0,
      monthRevenue: json['monthRevenue'] as num? ?? 0,
      activeAlerts: json['activeAlerts'] as int? ?? 0,
      totalRevenue: json['totalRevenue'] as num? ?? 0,
      revenueTrend: (json['revenueTrend'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'eggsToday': eggsToday,
      'eggsDiff': eggsDiff,
      'totalEffective': totalEffective,
      'monthRevenue': monthRevenue,
      'activeAlerts': activeAlerts,
      'totalRevenue': totalRevenue,
      'revenueTrend': revenueTrend,
    };
  }
}
