import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/incubation/data/models/incubation_batch_model.dart';

class IncubationRemoteDataSource {
  final Dio _dio;

  IncubationRemoteDataSource(this._dio);

  Future<List<Map<String, dynamic>>> getIncubators(String teamId) async {
    try {
      final response = await _dio.get(ApiEndpoints.incubators(teamId));
      return (response.data['data'] as List)
          .map((e) => e as Map<String, dynamic>)
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> createIncubator(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.incubators(teamId),
        data: data,
      );
      return response.data['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<IncubationBatchModel>> getIncubationBatches(
    String teamId,
  ) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.incubationBatches(teamId),
      );
      return (response.data['data'] as List)
          .map((json) =>
              IncubationBatchModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<IncubationBatchModel> createBatch(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.incubationBatches(teamId),
        data: data,
      );
      return IncubationBatchModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<IncubationBatchModel> recordCandling1(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.candling1(teamId, batchId),
        data: data,
      );
      return IncubationBatchModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<IncubationBatchModel> recordCandling2(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.candling2(teamId, batchId),
        data: data,
      );
      return IncubationBatchModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<IncubationBatchModel> recordHatch(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.hatchResult(teamId, batchId),
        data: data,
      );
      return IncubationBatchModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
