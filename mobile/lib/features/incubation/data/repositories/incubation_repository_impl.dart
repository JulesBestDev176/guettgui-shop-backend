import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/errors/failures.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/incubation/data/datasources/incubation_remote_datasource.dart';
import 'package:guettgui_mobile/features/incubation/domain/entities/incubation_batch.dart';
import 'package:guettgui_mobile/features/incubation/domain/repositories/incubation_repository.dart';

class IncubationRepositoryImpl implements IncubationRepository {
  final IncubationRemoteDataSource _remoteDataSource;
  final NetworkInfo _networkInfo;

  IncubationRepositoryImpl({
    required IncubationRemoteDataSource remoteDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<Map<String, dynamic>>> getIncubators(String teamId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getIncubators(teamId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Map<String, dynamic>> createIncubator(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createIncubator(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<List<IncubationBatch>> getIncubationBatches(String teamId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getIncubationBatches(teamId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<IncubationBatch> createBatch(
    String teamId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createBatch(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<IncubationBatch> recordCandling1(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.recordCandling1(teamId, batchId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<IncubationBatch> recordCandling2(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.recordCandling2(teamId, batchId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<IncubationBatch> recordHatch(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.recordHatch(teamId, batchId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }
}
