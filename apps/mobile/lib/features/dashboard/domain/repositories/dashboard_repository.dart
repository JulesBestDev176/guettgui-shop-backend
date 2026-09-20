import 'package:guettgui_mobile/features/dashboard/domain/entities/dashboard_stats.dart';

abstract class DashboardRepository {
  Future<DashboardStats> getDashboardStats(String teamId);
}
