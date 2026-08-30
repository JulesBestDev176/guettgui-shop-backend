import 'package:drift/drift.dart';

class StockMoves extends Table {
  TextColumn get id => text()();
  TextColumn get stockId => text()();
  TextColumn get type => text()(); // IN_PURCHASE, IN_PRODUCTION, OUT_CONSUMPTION, etc.
  RealColumn get quantity => real()();
  DateTimeColumn get date => dateTime()();
  TextColumn get description => text().nullable()();
  TextColumn get expenseId => text().nullable()();
  TextColumn get recordedById => text()();

  // --- Sync fields ---
  TextColumn get syncStatus =>
      text().withDefault(const Constant('pending'))();
  DateTimeColumn get syncedAt => dateTime().nullable()();
  DateTimeColumn get localCreatedAt =>
      dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get localUpdatedAt =>
      dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}
