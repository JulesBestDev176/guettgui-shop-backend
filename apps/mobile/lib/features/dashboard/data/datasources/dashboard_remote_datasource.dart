import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/dashboard/data/models/dashboard_stats_model.dart';

class DashboardRemoteDataSource {
  final Dio _dio;

  DashboardRemoteDataSource(this._dio);

  Future<DashboardStatsModel> getDashboardStats(String teamId) async {
    try {
      final response = await _dio.get(ApiEndpoints.financeSummary(teamId));
      return DashboardStatsModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getActiveFlocks(String teamId) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.flocks(teamId),
        queryParameters: {'status': 'ACTIVE'},
      );
      return (response.data['data'] as List)
          .map((e) => e as Map<String, dynamic>)
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<Map<String, dynamic>>> getActiveAlerts(String teamId) async {
    try {
      final response = await _dio.get(ApiEndpoints.alerts(teamId));
      return (response.data['data'] as List)
          .map((e) => e as Map<String, dynamic>)
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
