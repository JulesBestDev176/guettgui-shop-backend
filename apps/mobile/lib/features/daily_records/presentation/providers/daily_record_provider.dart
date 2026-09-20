import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/daily_records/data/datasources/daily_record_remote_datasource.dart';
import 'package:guettgui_mobile/features/daily_records/data/repositories/daily_record_repository_impl.dart';
import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';
import 'package:guettgui_mobile/features/daily_records/domain/repositories/daily_record_repository.dart';

// --- DataSource Provider ---
final dailyRecordRemoteDataSourceProvider =
    Provider<DailyRecordRemoteDataSource>((ref) {
  return DailyRecordRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final dailyRecordRepositoryProvider = Provider<DailyRecordRepository>((ref) {
  return DailyRecordRepositoryImpl(
    remoteDataSource: ref.watch(dailyRecordRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Daily Records List Provider ---
final dailyRecordListProvider = FutureProvider.family<List<DailyRecord>,
    ({String teamId, String? flockId})>((ref, params) async {
  final repo = ref.watch(dailyRecordRepositoryProvider);
  return repo.getDailyRecords(params.teamId, flockId: params.flockId);
});

// --- Flock Daily Records Provider ---
final flockDailyRecordsProvider = FutureProvider.family<List<DailyRecord>,
    ({String teamId, String flockId})>((ref, params) async {
  final repo = ref.watch(dailyRecordRepositoryProvider);
  return repo.getFlockDailyRecords(params.teamId, params.flockId);
});

// --- Daily Record Notifier ---
class DailyRecordNotifier
    extends StateNotifier<AsyncValue<List<DailyRecord>>> {
  final DailyRecordRepository _repository;
  final String _teamId;

  DailyRecordNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadRecords();
  }

  Future<void> loadRecords({String? flockId}) async {
    state = const AsyncValue.loading();
    try {
      final records = await _repository.getDailyRecords(
        _teamId,
        flockId: flockId,
      );
      state = AsyncValue.data(records);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createRecord(Map<String, dynamic> data) async {
    try {
      await _repository.createDailyRecord(_teamId, data);
      await loadRecords();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateRecord(
    String recordId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.updateDailyRecord(_teamId, recordId, data);
      await loadRecords();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final dailyRecordNotifierProvider = StateNotifierProvider.family<
    DailyRecordNotifier, AsyncValue<List<DailyRecord>>, String>(
  (ref, teamId) {
    return DailyRecordNotifier(
      ref.watch(dailyRecordRepositoryProvider),
      teamId,
    );
  },
);
