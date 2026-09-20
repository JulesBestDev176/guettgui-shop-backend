import 'package:drift/drift.dart';

class VaccinationProtocols extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get name => text()();
  TextColumn get flockType => text()(); // BREEDER, LAYER, BROILER, QUAIL
  IntColumn get dayOfAdmin => integer()();
  TextColumn get route => text()(); // DRINKING_WATER, INJECTION, SPRAY, EYE_DROP, OTHER
  TextColumn get notes => text().nullable()();

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
