import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/flocks/data/datasources/flock_remote_datasource.dart';
import 'package:guettgui_mobile/features/flocks/data/repositories/flock_repository_impl.dart';
import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';
import 'package:guettgui_mobile/features/flocks/domain/repositories/flock_repository.dart';

// --- DataSource Provider ---
final flockRemoteDataSourceProvider =
    Provider<FlockRemoteDataSource>((ref) {
  return FlockRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final flockRepositoryProvider = Provider<FlockRepository>((ref) {
  return FlockRepositoryImpl(
    remoteDataSource: ref.watch(flockRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Flock List Provider ---
final flockListProvider =
    FutureProvider.family<List<Flock>, String>((ref, teamId) async {
  final repo = ref.watch(flockRepositoryProvider);
  return repo.getFlocks(teamId);
});

// --- Active Flocks Provider ---
final activeFlockListProvider =
    FutureProvider.family<List<Flock>, String>((ref, teamId) async {
  final repo = ref.watch(flockRepositoryProvider);
  return repo.getFlocks(teamId, status: 'ACTIVE');
});

// --- Flock Detail Provider ---
final flockDetailProvider =
    FutureProvider.family<Flock, ({String teamId, String flockId})>(
        (ref, params) async {
  final repo = ref.watch(flockRepositoryProvider);
  return repo.getFlockById(params.teamId, params.flockId);
});

// --- Flock Notifier for CRUD operations ---
class FlockListNotifier extends StateNotifier<AsyncValue<List<Flock>>> {
  final FlockRepository _repository;
  final String _teamId;

  FlockListNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadFlocks();
  }

  Future<void> loadFlocks() async {
    state = const AsyncValue.loading();
    try {
      final flocks = await _repository.getFlocks(_teamId);
      state = AsyncValue.data(flocks);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createFlock(Map<String, dynamic> data) async {
    try {
      await _repository.createFlock(_teamId, data);
      await loadFlocks();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateFlock(String flockId, Map<String, dynamic> data) async {
    try {
      await _repository.updateFlock(_teamId, flockId, data);
      await loadFlocks();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> closeFlock(String flockId, Map<String, dynamic> data) async {
    try {
      await _repository.closeFlock(_teamId, flockId, data);
      await loadFlocks();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> deleteFlock(String flockId) async {
    try {
      await _repository.deleteFlock(_teamId, flockId);
      await loadFlocks();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final flockListNotifierProvider = StateNotifierProvider.family<
    FlockListNotifier, AsyncValue<List<Flock>>, String>((ref, teamId) {
  return FlockListNotifier(ref.watch(flockRepositoryProvider), teamId);
});
