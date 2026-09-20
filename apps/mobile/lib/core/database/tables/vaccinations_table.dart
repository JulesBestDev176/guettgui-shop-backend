import 'package:drift/drift.dart';

class Vaccinations extends Table {
  TextColumn get id => text()();
  TextColumn get flockId => text()();
  TextColumn get vaccineName => text()();
  DateTimeColumn get scheduledDate => dateTime()();
  DateTimeColumn get actualDate => dateTime().nullable()();
  TextColumn get route => text()(); // DRINKING_WATER, INJECTION, SPRAY, EYE_DROP, OTHER
  TextColumn get doseGiven => text().nullable()();
  BoolColumn get isDone =>
      boolean().withDefault(const Constant(false))();
  TextColumn get doneById => text().nullable()();
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
