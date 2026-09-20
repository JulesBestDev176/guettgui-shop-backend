import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/daily_records/data/models/daily_record_model.dart';

class DailyRecordRemoteDataSource {
  final Dio _dio;

  DailyRecordRemoteDataSource(this._dio);

  Future<List<DailyRecordModel>> getDailyRecords(
    String teamId, {
    String? flockId,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (flockId != null) queryParams['flockId'] = flockId;
      if (dateFrom != null) {
        queryParams['dateFrom'] = dateFrom.toIso8601String().split('T').first;
      }
      if (dateTo != null) {
        queryParams['dateTo'] = dateTo.toIso8601String().split('T').first;
      }

      final response = await _dio.get(
        ApiEndpoints.dailyRecords(teamId),
        queryParameters: queryParams,
      );
      return (response.data['data'] as List)
          .map((json) =>
              DailyRecordModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<DailyRecordModel> createDailyRecord(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.dailyRecords(teamId),
        data: data,
      );
      return DailyRecordModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<DailyRecordModel> updateDailyRecord(
    String teamId,
    String recordId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.dailyRecordById(teamId, recordId),
        data: data,
      );
      return DailyRecordModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<DailyRecordModel>> getFlockDailyRecords(
    String teamId,
    String flockId,
  ) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.flockDailyRecords(teamId, flockId),
      );
      return (response.data['data'] as List)
          .map((json) =>
              DailyRecordModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
