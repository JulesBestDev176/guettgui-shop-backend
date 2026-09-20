import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/sales_table.dart';

part 'sales_dao.g.dart';

@DriftAccessor(tables: [Sales])
class SalesDao extends DatabaseAccessor<AppDatabase> with _$SalesDaoMixin {
  SalesDao(super.db);

  /// Get all sales for a team
  Future<List<Sale>> getByTeam(String teamId) {
    return (select(sales)
          ..where((s) => s.teamId.equals(teamId))
          ..orderBy([(s) => OrderingTerm.desc(s.date)]))
        .get();
  }

  /// Watch all sales for a team
  Stream<List<Sale>> watchByTeam(String teamId) {
    return (select(sales)
          ..where((s) => s.teamId.equals(teamId))
          ..orderBy([(s) => OrderingTerm.desc(s.date)]))
        .watch();
  }

  /// Get sales by customer
  Future<List<Sale>> getByCustomer(String customerId) {
    return (select(sales)
          ..where((s) => s.customerId.equals(customerId))
          ..orderBy([(s) => OrderingTerm.desc(s.date)]))
        .get();
  }

  /// Get sales with pending payments
  Future<List<Sale>> getPendingSales(String teamId) {
    return (select(sales)
          ..where((s) =>
              s.teamId.equals(teamId) &
              s.paymentStatus.isIn(['PENDING', 'PARTIAL']))
          ..orderBy([(s) => OrderingTerm.desc(s.date)]))
        .get();
  }

  /// Insert a sale
  Future<void> insertSale(SalesCompanion sale) {
    return into(sales).insert(sale, mode: InsertMode.insertOrReplace);
  }

  /// Update a sale
  Future<bool> updateSale(String id, SalesCompanion sale) {
    return (update(sales)..where((s) => s.id.equals(id)))
        .write(sale)
        .then((rows) => rows > 0);
  }
}
