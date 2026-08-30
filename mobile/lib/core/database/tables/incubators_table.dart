import 'package:drift/drift.dart';

class Incubators extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get name => text()();
  IntColumn get capacity => integer()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();

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
