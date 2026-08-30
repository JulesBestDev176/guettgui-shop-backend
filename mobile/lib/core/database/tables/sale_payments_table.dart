import 'package:drift/drift.dart';

class SalePayments extends Table {
  TextColumn get id => text()();
  TextColumn get saleId => text()();
  DateTimeColumn get date => dateTime()();
  IntColumn get amount => integer()();
  TextColumn get method => text()(); // CASH, WAVE, ORANGE_MONEY, etc.
  TextColumn get notes => text().nullable()();
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
