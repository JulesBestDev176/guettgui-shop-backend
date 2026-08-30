import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/stocks_table.dart';

part 'stocks_dao.g.dart';

@DriftAccessor(tables: [Stocks])
class StocksDao extends DatabaseAccessor<AppDatabase> with _$StocksDaoMixin {
  StocksDao(super.db);

  /// Get all stocks for a team
  Future<List<Stock>> getByTeam(String teamId) {
    return (select(stocks)
          ..where((s) => s.teamId.equals(teamId))
          ..orderBy([(s) => OrderingTerm.asc(s.name)]))
        .get();
  }

  /// Watch all stocks for a team
  Stream<List<Stock>> watchByTeam(String teamId) {
    return (select(stocks)
          ..where((s) => s.teamId.equals(teamId))
          ..orderBy([(s) => OrderingTerm.asc(s.name)]))
        .watch();
  }

  /// Update stock quantity
  Future<bool> updateQty(String id, double newQty) {
    return (update(stocks)..where((s) => s.id.equals(id)))
        .write(StocksCompanion(
          currentQty: Value(newQty),
          localUpdatedAt: Value(DateTime.now()),
          syncStatus: const Value('pending'),
        ))
        .then((rows) => rows > 0);
  }

  /// Insert a stock
  Future<void> insertStock(StocksCompanion stock) {
    return into(stocks).insert(stock, mode: InsertMode.insertOrReplace);
  }

  /// Get stock by type for a team
  Future<Stock?> getByType(String teamId, String type) {
    return (select(stocks)
          ..where((s) => s.teamId.equals(teamId) & s.type.equals(type)))
        .getSingleOrNull();
  }
}
