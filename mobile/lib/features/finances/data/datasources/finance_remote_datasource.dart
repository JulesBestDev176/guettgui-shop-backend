import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/finances/data/models/expense_model.dart';
import 'package:guettgui_mobile/features/finances/data/models/financial_summary_model.dart';
import 'package:guettgui_mobile/features/finances/data/models/sale_model.dart';

class FinanceRemoteDataSource {
  final Dio _dio;

  FinanceRemoteDataSource(this._dio);

  Future<List<ExpenseModel>> getExpenses(
    String teamId, {
    String? category,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (category != null) queryParams['category'] = category;
      if (dateFrom != null) {
        queryParams['dateFrom'] = dateFrom.toIso8601String().split('T').first;
      }
      if (dateTo != null) {
        queryParams['dateTo'] = dateTo.toIso8601String().split('T').first;
      }

      final response = await _dio.get(
        ApiEndpoints.expenses(teamId),
        queryParameters: queryParams,
      );
      return (response.data['data'] as List)
          .map((json) => ExpenseModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<ExpenseModel> createExpense(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.expenses(teamId),
        data: data,
      );
      return ExpenseModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<SaleModel>> getSales(
    String teamId, {
    String? productType,
    String? paymentStatus,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (productType != null) queryParams['productType'] = productType;
      if (paymentStatus != null) queryParams['paymentStatus'] = paymentStatus;
      if (dateFrom != null) {
        queryParams['dateFrom'] = dateFrom.toIso8601String().split('T').first;
      }
      if (dateTo != null) {
        queryParams['dateTo'] = dateTo.toIso8601String().split('T').first;
      }

      final response = await _dio.get(
        ApiEndpoints.sales(teamId),
        queryParameters: queryParams,
      );
      return (response.data['data'] as List)
          .map((json) => SaleModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<SaleModel> createSale(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.sales(teamId),
        data: data,
      );
      return SaleModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<void> createSalePayment(
    String teamId,
    String saleId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _dio.post(
        ApiEndpoints.salePayments(teamId, saleId),
        data: data,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<FinancialSummaryModel> getFinancialSummary(String teamId) async {
    try {
      final response = await _dio.get(ApiEndpoints.financeSummary(teamId));
      return FinancialSummaryModel.fromJson(
        response.data['data'] as Map<String, dynamic>,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
