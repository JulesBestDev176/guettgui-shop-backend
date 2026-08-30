import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/customers/data/models/customer_model.dart';

class CustomerRemoteDataSource {
  final Dio _dio;

  CustomerRemoteDataSource(this._dio);

  Future<List<CustomerModel>> getCustomers(String teamId) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.customersEndpoint(teamId),
      );
      return (response.data['data'] as List)
          .map((json) =>
              CustomerModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<CustomerModel> getCustomerById(
    String teamId,
    String customerId,
  ) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.customerById(teamId, customerId),
      );
      return CustomerModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<CustomerModel> createCustomer(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.customersEndpoint(teamId),
        data: data,
      );
      return CustomerModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<CustomerModel> updateCustomer(
    String teamId,
    String customerId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.patch(
        ApiEndpoints.customerById(teamId, customerId),
        data: data,
      );
      return CustomerModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
