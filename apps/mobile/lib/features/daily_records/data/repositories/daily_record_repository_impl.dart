import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/errors/failures.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/daily_records/data/datasources/daily_record_remote_datasource.dart';
import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';
import 'package:guettgui_mobile/features/daily_records/domain/repositories/daily_record_repository.dart';

class DailyRecordRepositoryImpl implements DailyRecordRepository {
  final DailyRecordRemoteDataSource _remoteDataSource;
  final NetworkInfo _networkInfo;

  DailyRecordRepositoryImpl({
    required DailyRecordRemoteDataSource remoteDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<DailyRecord>> getDailyRecords(
    String teamId, {
    String? flockId,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getDailyRecords(
        teamId,
        flockId: flockId,
        dateFrom: dateFrom,
        dateTo: dateTo,
      );
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<DailyRecord> createDailyRecord(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createDailyRecord(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<DailyRecord> updateDailyRecord(
    String teamId,
    String recordId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.updateDailyRecord(
        teamId,
        recordId,
        data,
      );
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<List<DailyRecord>> getFlockDailyRecords(
    String teamId,
    String flockId,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getFlockDailyRecords(teamId, flockId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }
}
