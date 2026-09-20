import 'package:drift/drift.dart';

class Stocks extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get type => text()(); // LAYER_FEED, BROILER_FEED, MILLET, etc.
  TextColumn get name => text()();
  RealColumn get currentQty => real()();
  TextColumn get unit => text()(); // kg, dose, unite, oeuf
  RealColumn get alertThreshold => real()();

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
