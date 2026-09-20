import 'package:drift/drift.dart';

class TeamMembers extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get teamId => text()();
  TextColumn get role => text().withDefault(const Constant('MEMBER'))();
  DateTimeColumn get joinedAt =>
      dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get removedAt => dateTime().nullable()();

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
