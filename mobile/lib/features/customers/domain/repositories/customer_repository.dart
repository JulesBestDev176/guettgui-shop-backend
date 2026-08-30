import 'package:guettgui_mobile/features/customers/domain/entities/customer.dart';

abstract class CustomerRepository {
  Future<List<Customer>> getCustomers(String teamId);
  Future<Customer> getCustomerById(String teamId, String customerId);
  Future<Customer> createCustomer(String teamId, Map<String, dynamic> data);
  Future<Customer> updateCustomer(
    String teamId,
    String customerId,
    Map<String, dynamic> data,
  );
}
