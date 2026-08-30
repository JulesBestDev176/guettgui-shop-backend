import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/finances/data/datasources/finance_remote_datasource.dart';
import 'package:guettgui_mobile/features/finances/data/repositories/finance_repository_impl.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/features/finances/domain/repositories/finance_repository.dart';

// --- DataSource Provider ---
final financeRemoteDataSourceProvider =
    Provider<FinanceRemoteDataSource>((ref) {
  return FinanceRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final financeRepositoryProvider = Provider<FinanceRepository>((ref) {
  return FinanceRepositoryImpl(
    remoteDataSource: ref.watch(financeRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Expenses Provider ---
final expenseListProvider =
    FutureProvider.family<List<Expense>, String>((ref, teamId) async {
  final repo = ref.watch(financeRepositoryProvider);
  return repo.getExpenses(teamId);
});

// --- Sales Provider ---
final saleListProvider =
    FutureProvider.family<List<Sale>, String>((ref, teamId) async {
  final repo = ref.watch(financeRepositoryProvider);
  return repo.getSales(teamId);
});

// --- Financial Summary Provider ---
final financialSummaryProvider =
    FutureProvider.family<FinancialSummary, String>((ref, teamId) async {
  final repo = ref.watch(financeRepositoryProvider);
  return repo.getFinancialSummary(teamId);
});

// --- Finance Notifier ---
class FinanceNotifier extends StateNotifier<AsyncValue<FinancialSummary>> {
  final FinanceRepository _repository;
  final String _teamId;

  FinanceNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadSummary();
  }

  Future<void> loadSummary() async {
    state = const AsyncValue.loading();
    try {
      final summary = await _repository.getFinancialSummary(_teamId);
      state = AsyncValue.data(summary);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createExpense(Map<String, dynamic> data) async {
    try {
      await _repository.createExpense(_teamId, data);
      await loadSummary();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createSale(Map<String, dynamic> data) async {
    try {
      await _repository.createSale(_teamId, data);
      await loadSummary();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createSalePayment(
    String saleId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.createSalePayment(_teamId, saleId, data);
      await loadSummary();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final financeNotifierProvider = StateNotifierProvider.family<FinanceNotifier,
    AsyncValue<FinancialSummary>, String>(
  (ref, teamId) {
    return FinanceNotifier(ref.watch(financeRepositoryProvider), teamId);
  },
);
