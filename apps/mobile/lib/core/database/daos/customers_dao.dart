import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/customers_table.dart';

part 'customers_dao.g.dart';

@DriftAccessor(tables: [Customers])
class CustomersDao extends DatabaseAccessor<AppDatabase>
    with _$CustomersDaoMixin {
  CustomersDao(super.db);

  /// Get all customers for a team
  Future<List<Customer>> getByTeam(String teamId) {
    return (select(customers)
          ..where((c) => c.teamId.equals(teamId))
          ..orderBy([(c) => OrderingTerm.asc(c.firstName)]))
        .get();
  }

  /// Watch all customers for a team
  Stream<List<Customer>> watchByTeam(String teamId) {
    return (select(customers)
          ..where((c) => c.teamId.equals(teamId))
          ..orderBy([(c) => OrderingTerm.asc(c.firstName)]))
        .watch();
  }

  /// Get a customer by ID
  Future<Customer?> getById(String id) {
    return (select(customers)..where((c) => c.id.equals(id)))
        .getSingleOrNull();
  }

  /// Watch a customer by ID
  Stream<Customer?> watchById(String id) {
    return (select(customers)..where((c) => c.id.equals(id)))
        .watchSingleOrNull();
  }

  /// Insert a customer
  Future<void> insertCustomer(CustomersCompanion customer) {
    return into(customers)
        .insert(customer, mode: InsertMode.insertOrReplace);
  }

  /// Update a customer
  Future<bool> updateCustomer(String id, CustomersCompanion customer) {
    return (update(customers)..where((c) => c.id.equals(id)))
        .write(customer)
        .then((rows) => rows > 0);
  }

  /// Search customers by name
  Future<List<Customer>> searchByName(String teamId, String query) {
    return (select(customers)
          ..where((c) =>
              c.teamId.equals(teamId) &
              (c.firstName.like('%$query%') |
                  c.lastName.like('%$query%')))
          ..orderBy([(c) => OrderingTerm.asc(c.firstName)]))
        .get();
  }
}
