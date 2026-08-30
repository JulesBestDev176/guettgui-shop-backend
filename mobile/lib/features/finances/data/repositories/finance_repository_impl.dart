import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/errors/failures.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/finances/data/datasources/finance_remote_datasource.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/features/finances/domain/repositories/finance_repository.dart';

class FinanceRepositoryImpl implements FinanceRepository {
  final FinanceRemoteDataSource _remoteDataSource;
  final NetworkInfo _networkInfo;

  FinanceRepositoryImpl({
    required FinanceRemoteDataSource remoteDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<Expense>> getExpenses(
    String teamId, {
    String? category,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getExpenses(
        teamId,
        category: category,
        dateFrom: dateFrom,
        dateTo: dateTo,
      );
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Expense> createExpense(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createExpense(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<List<Sale>> getSales(
    String teamId, {
    String? productType,
    String? paymentStatus,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getSales(
        teamId,
        productType: productType,
        paymentStatus: paymentStatus,
        dateFrom: dateFrom,
        dateTo: dateTo,
      );
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Sale> createSale(String teamId, Map<String, dynamic> data) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createSale(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<void> createSalePayment(
    String teamId,
    String saleId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      await _remoteDataSource.createSalePayment(teamId, saleId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<FinancialSummary> getFinancialSummary(String teamId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getFinancialSummary(teamId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }
}
