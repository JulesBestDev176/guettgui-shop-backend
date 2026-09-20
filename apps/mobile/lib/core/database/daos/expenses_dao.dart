import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/expenses_table.dart';

part 'expenses_dao.g.dart';

@DriftAccessor(tables: [Expenses])
class ExpensesDao extends DatabaseAccessor<AppDatabase>
    with _$ExpensesDaoMixin {
  ExpensesDao(super.db);

  /// Get all expenses for a team
  Future<List<Expense>> getByTeam(String teamId) {
    return (select(expenses)
          ..where((e) => e.teamId.equals(teamId))
          ..orderBy([(e) => OrderingTerm.desc(e.date)]))
        .get();
  }

  /// Watch all expenses for a team
  Stream<List<Expense>> watchByTeam(String teamId) {
    return (select(expenses)
          ..where((e) => e.teamId.equals(teamId))
          ..orderBy([(e) => OrderingTerm.desc(e.date)]))
        .watch();
  }

  /// Get expenses by category
  Future<List<Expense>> getByCategory(String teamId, String category) {
    return (select(expenses)
          ..where((e) =>
              e.teamId.equals(teamId) & e.category.equals(category))
          ..orderBy([(e) => OrderingTerm.desc(e.date)]))
        .get();
  }

  /// Get expenses in a date range
  Future<List<Expense>> getByDateRange(
    String teamId,
    DateTime from,
    DateTime to,
  ) {
    return (select(expenses)
          ..where((e) =>
              e.teamId.equals(teamId) &
              e.date.isBiggerOrEqualValue(from) &
              e.date.isSmallerOrEqualValue(to))
          ..orderBy([(e) => OrderingTerm.desc(e.date)]))
        .get();
  }

  /// Insert an expense
  Future<void> insertExpense(ExpensesCompanion expense) {
    return into(expenses).insert(expense, mode: InsertMode.insertOrReplace);
  }

  /// Update an expense
  Future<bool> updateExpense(String id, ExpensesCompanion expense) {
    return (update(expenses)..where((e) => e.id.equals(id)))
        .write(expense)
        .then((rows) => rows > 0);
  }
}
