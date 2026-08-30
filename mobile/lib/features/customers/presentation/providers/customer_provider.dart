import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/network_info.dart';
import 'package:guettgui_mobile/features/customers/data/datasources/customer_remote_datasource.dart';
import 'package:guettgui_mobile/features/customers/data/repositories/customer_repository_impl.dart';
import 'package:guettgui_mobile/features/customers/domain/entities/customer.dart';
import 'package:guettgui_mobile/features/customers/domain/repositories/customer_repository.dart';

// --- DataSource Provider ---
final customerRemoteDataSourceProvider =
    Provider<CustomerRemoteDataSource>((ref) {
  return CustomerRemoteDataSource(ref.watch(dioProvider));
});

// --- Repository Provider ---
final customerRepositoryProvider = Provider<CustomerRepository>((ref) {
  return CustomerRepositoryImpl(
    remoteDataSource: ref.watch(customerRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// --- Customer List Provider ---
final customerListProvider =
    FutureProvider.family<List<Customer>, String>((ref, teamId) async {
  final repo = ref.watch(customerRepositoryProvider);
  return repo.getCustomers(teamId);
});

// --- Customer Detail Provider ---
final customerDetailProvider = FutureProvider.family<Customer,
    ({String teamId, String customerId})>((ref, params) async {
  final repo = ref.watch(customerRepositoryProvider);
  return repo.getCustomerById(params.teamId, params.customerId);
});

// --- Customer Notifier ---
class CustomerNotifier extends StateNotifier<AsyncValue<List<Customer>>> {
  final CustomerRepository _repository;
  final String _teamId;

  CustomerNotifier(this._repository, this._teamId)
      : super(const AsyncValue.loading()) {
    loadCustomers();
  }

  Future<void> loadCustomers() async {
    state = const AsyncValue.loading();
    try {
      final customers = await _repository.getCustomers(_teamId);
      state = AsyncValue.data(customers);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> createCustomer(Map<String, dynamic> data) async {
    try {
      await _repository.createCustomer(_teamId, data);
      await loadCustomers();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateCustomer(
    String customerId,
    Map<String, dynamic> data,
  ) async {
    try {
      await _repository.updateCustomer(_teamId, customerId, data);
      await loadCustomers();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final customerNotifierProvider = StateNotifierProvider.family<
    CustomerNotifier, AsyncValue<List<Customer>>, String>(
  (ref, teamId) {
    return CustomerNotifier(ref.watch(customerRepositoryProvider), teamId);
  },
);
