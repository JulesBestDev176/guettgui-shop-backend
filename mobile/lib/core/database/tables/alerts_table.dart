import 'package:drift/drift.dart';

class Alerts extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get type => text()(); // LOW_STOCK, CANDLING_DUE, HATCH_DUE, etc.
  TextColumn get priority => text()(); // LOW, MEDIUM, HIGH
  TextColumn get title => text()();
  TextColumn get message => text()();
  BoolColumn get isRead => boolean().withDefault(const Constant(false))();
  BoolColumn get isDismissed =>
      boolean().withDefault(const Constant(false))();
  TextColumn get referenceId => text().nullable()();

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
