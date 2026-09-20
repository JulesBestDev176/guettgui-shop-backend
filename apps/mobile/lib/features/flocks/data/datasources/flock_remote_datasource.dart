import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/flocks/data/models/flock_model.dart';

class FlockRemoteDataSource {
  final Dio _dio;

  FlockRemoteDataSource(this._dio);

  Future<List<FlockModel>> getFlocks(
    String teamId, {
    String? status,
    String? type,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (status != null) queryParams['status'] = status;
      if (type != null) queryParams['type'] = type;

      final response = await _dio.get(
        ApiEndpoints.flocks(teamId),
        queryParameters: queryParams,
      );
      return (response.data['data'] as List)
          .map((json) => FlockModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<FlockModel> getFlockById(String teamId, String flockId) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.flockById(teamId, flockId),
      );
      return FlockModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<FlockModel> createFlock(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.flocks(teamId),
        data: data,
      );
      return FlockModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<FlockModel> updateFlock(
    String teamId,
    String flockId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.flockById(teamId, flockId),
        data: data,
      );
      return FlockModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<FlockModel> closeFlock(
    String teamId,
    String flockId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.closeFlock(teamId, flockId),
        data: data,
      );
      return FlockModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<void> deleteFlock(String teamId, String flockId) async {
    try {
      await _dio.delete(ApiEndpoints.flockById(teamId, flockId));
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
