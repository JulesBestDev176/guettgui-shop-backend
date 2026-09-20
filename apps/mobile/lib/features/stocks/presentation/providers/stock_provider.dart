import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/stocks/data/datasources/stock_remote_datasource.dart';
import 'package:guettgui_mobile/features/stocks/data/repositories/stock_repository_impl.dart';
import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';
import 'package:guettgui_mobile/features/stocks/domain/repositories/stock_repository.dart';

// --- DataSource Provider ---
final stockRemoteDataSourceProvider = Provider<StockRemoteDataSource>((ref) {
  return StockRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final stockRepositoryProvider = Provider<StockRepository>((ref) {
  return StockRepositoryImpl(
    remoteDataSource: ref.watch(stockRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Stocks List Provider ---
final stockListProvider =
    FutureProvider.family<List<Stock>, String>((ref, teamId) async {
  final repo = ref.watch(stockRepositoryProvider);
  return repo.getStocks(teamId);
});

// --- Stock Moves Provider ---
final stockMovesProvider = FutureProvider.family<List<StockMove>,
    ({String teamId, String stockId})>((ref, params) async {
  final repo = ref.watch(stockRepositoryProvider);
  return repo.getStockMoves(params.teamId, params.stockId);
});

// --- Stock Notifier ---
class StockNotifier extends StateNotifier<AsyncValue<List<Stock>>> {
  final StockRepository _repository;
  final String _teamId;

  StockNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadStocks();
  }

  Future<void> loadStocks() async {
    state = const AsyncValue.loading();
    try {
      final stocks = await _repository.getStocks(_teamId);
      state = AsyncValue.data(stocks);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> adjustStock(
    String stockId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.adjustStock(_teamId, stockId, data);
      await loadStocks();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final stockNotifierProvider = StateNotifierProvider.family<StockNotifier,
    AsyncValue<List<Stock>>, String>(
  (ref, teamId) {
    return StockNotifier(ref.watch(stockRepositoryProvider), teamId);
  },
);
