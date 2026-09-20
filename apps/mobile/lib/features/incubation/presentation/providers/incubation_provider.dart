import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/incubation/data/datasources/incubation_remote_datasource.dart';
import 'package:guettgui_mobile/features/incubation/data/repositories/incubation_repository_impl.dart';
import 'package:guettgui_mobile/features/incubation/domain/entities/incubation_batch.dart';
import 'package:guettgui_mobile/features/incubation/domain/repositories/incubation_repository.dart';

// --- DataSource Provider ---
final incubationRemoteDataSourceProvider =
    Provider<IncubationRemoteDataSource>((ref) {
  return IncubationRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final incubationRepositoryProvider = Provider<IncubationRepository>((ref) {
  return IncubationRepositoryImpl(
    remoteDataSource: ref.watch(incubationRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Incubators List Provider ---
final incubatorsProvider =
    FutureProvider.family<List<Map<String, dynamic>>, String>(
        (ref, teamId) async {
  final repo = ref.watch(incubationRepositoryProvider);
  return repo.getIncubators(teamId);
});

// --- Incubation Batches Provider ---
final incubationBatchListProvider =
    FutureProvider.family<List<IncubationBatch>, String>(
        (ref, teamId) async {
  final repo = ref.watch(incubationRepositoryProvider);
  return repo.getIncubationBatches(teamId);
});

// --- Incubation Notifier ---
class IncubationNotifier
    extends StateNotifier<AsyncValue<List<IncubationBatch>>> {
  final IncubationRepository _repository;
  final String _teamId;

  IncubationNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadBatches();
  }

  Future<void> loadBatches() async {
    state = const AsyncValue.loading();
    try {
      final batches = await _repository.getIncubationBatches(_teamId);
      state = AsyncValue.data(batches);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createBatch(Map<String, dynamic> data) async {
    try {
      await _repository.createBatch(_teamId, data);
      await loadBatches();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> recordCandling1(
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.recordCandling1(_teamId, batchId, data);
      await loadBatches();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> recordCandling2(
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.recordCandling2(_teamId, batchId, data);
      await loadBatches();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> recordHatch(
    String batchId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.recordHatch(_teamId, batchId, data);
      await loadBatches();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final incubationNotifierProvider = StateNotifierProvider.family<
    IncubationNotifier, AsyncValue<List<IncubationBatch>>, String>(
  (ref, teamId) {
    return IncubationNotifier(
      ref.watch(incubationRepositoryProvider),
      teamId,
    );
  },
);
