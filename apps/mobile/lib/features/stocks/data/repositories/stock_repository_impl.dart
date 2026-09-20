import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/errors/failures.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/stocks/data/datasources/stock_remote_datasource.dart';
import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';
import 'package:guettgui_mobile/features/stocks/domain/repositories/stock_repository.dart';

class StockRepositoryImpl implements StockRepository {
  final StockRemoteDataSource _remoteDataSource;
  final NetworkInfo _networkInfo;

  StockRepositoryImpl({
    required StockRemoteDataSource remoteDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<Stock>> getStocks(String teamId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getStocks(teamId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<List<StockMove>> getStockMoves(
    String teamId,
    String stockId,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getStockMoves(teamId, stockId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<void> adjustStock(
    String teamId,
    String stockId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      await _remoteDataSource.adjustStock(teamId, stockId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }
}
