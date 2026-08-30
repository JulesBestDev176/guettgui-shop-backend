import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/auth/data/models/user_model.dart';

class AuthRemoteDataSource {
  final Dio _dio;

  AuthRemoteDataSource(this._dio);

  Future<void> sendOtp(String phone) async {
    try {
      await _dio.post(
        ApiEndpoints.sendOtp,
        data: {'phone': phone},
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String code) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.verifyOtp,
        data: {'phone': phone, 'code': code},
      );
      return response.data['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<UserModel> updateProfile({
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.userMe,
        data: {'firstName': firstName, 'lastName': lastName},
      );
      return UserModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> createTeam({
    required String name,
    required String location,
  }) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.teams,
        data: {'name': name, 'location': location},
      );
      return response.data['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> joinTeam(String inviteCode) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.joinTeam,
        data: {'inviteCode': inviteCode},
      );
      return response.data['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<UserModel> getCurrentUser() async {
    try {
      final response = await _dio.get(ApiEndpoints.userMe);
      return UserModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<void> logout(String refreshToken) async {
    try {
      await _dio.post(
        ApiEndpoints.logout,
        data: {'refreshToken': refreshToken},
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
