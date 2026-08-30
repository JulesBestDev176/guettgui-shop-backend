import 'package:dio/dio.dart';
import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/features/stocks/data/models/stock_model.dart';
import 'package:guettgui_mobile/features/stocks/data/models/stock_move_model.dart';

class StockRemoteDataSource {
  final Dio _dio;

  StockRemoteDataSource(this._dio);

  Future<List<StockModel>> getStocks(String teamId) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.stocksEndpoint(teamId),
      );
      return (response.data['data'] as List)
          .map((json) => StockModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<List<StockMoveModel>> getStockMoves(
    String teamId,
    String stockId,
  ) async {
    try {
      final response = await _dio.get(
        ApiEndpoints.stockMoves(teamId, stockId),
      );
      return (response.data['data'] as List)
          .map((json) =>
              StockMoveModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }

  Future<void> adjustStock(
    String teamId,
    String stockId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _dio.post(
        ApiEndpoints.adjustStock(teamId, stockId),
        data: data,
      );
    } on DioException catch (e) {
      throw ServerException.fromDioError(e);
    }
  }
}
