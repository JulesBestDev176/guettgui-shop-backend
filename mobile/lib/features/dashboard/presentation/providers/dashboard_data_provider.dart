import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/dashboard/data/datasources/dashboard_remote_datasource.dart';
import 'package:guettgui_mobile/features/dashboard/data/repositories/dashboard_repository_impl.dart';
import 'package:guettgui_mobile/features/dashboard/domain/entities/dashboard_stats.dart';
import 'package:guettgui_mobile/features/dashboard/domain/repositories/dashboard_repository.dart';

// --- DataSource Provider ---
final dashboardRemoteDataSourceProvider =
    Provider<DashboardRemoteDataSource>((ref) {
  return DashboardRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepositoryImpl(
    remoteDataSource: ref.watch(dashboardRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Data Provider ---
final dashboardDataProvider =
    FutureProvider.family<DashboardStats, String>((ref, teamId) async {
  final repo = ref.watch(dashboardRepositoryProvider);
  return repo.getDashboardStats(teamId);
});
