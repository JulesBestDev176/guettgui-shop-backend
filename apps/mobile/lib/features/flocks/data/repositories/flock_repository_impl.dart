import 'package:guettgui_mobile/core/errors/exceptions.dart';
import 'package:guettgui_mobile/core/errors/failures.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/flocks/data/datasources/flock_remote_datasource.dart';
import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';
import 'package:guettgui_mobile/features/flocks/domain/repositories/flock_repository.dart';

class FlockRepositoryImpl implements FlockRepository {
  final FlockRemoteDataSource _remoteDataSource;
  final NetworkInfo _networkInfo;

  FlockRepositoryImpl({
    required FlockRemoteDataSource remoteDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<Flock>> getFlocks(
    String teamId, {
    String? status,
    String? type,
  }) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getFlocks(
        teamId,
        status: status,
        type: type,
      );
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Flock> getFlockById(String teamId, String flockId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.getFlockById(teamId, flockId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Flock> createFlock(String teamId, Map<String, dynamic> data) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.createFlock(teamId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Flock> updateFlock(
    String teamId,
    String flockId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.updateFlock(teamId, flockId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<Flock> closeFlock(
    String teamId,
    String flockId,
    Map<String, dynamic> data,
  ) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      return await _remoteDataSource.closeFlock(teamId, flockId, data);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<void> deleteFlock(String teamId, String flockId) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }
    try {
      await _remoteDataSource.deleteFlock(teamId, flockId);
    } on ServerException catch (e) {
      throw ServerFailure(e.message, statusCode: e.statusCode);
    }
  }
}
