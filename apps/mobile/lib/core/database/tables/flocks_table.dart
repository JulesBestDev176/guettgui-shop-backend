import 'package:drift/drift.dart';

class Flocks extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get name => text()();
  TextColumn get type => text()(); // BREEDER, LAYER, BROILER, QUAIL
  TextColumn get breed => text().nullable()();
  TextColumn get status =>
      text().withDefault(const Constant('ACTIVE'))(); // ACTIVE, COMPLETED, ARCHIVED
  DateTimeColumn get startDate => dateTime()();
  DateTimeColumn get endDate => dateTime().nullable()();
  IntColumn get initialMales => integer().withDefault(const Constant(0))();
  IntColumn get initialFemales =>
      integer().withDefault(const Constant(0))();
  IntColumn get initialTotal => integer().withDefault(const Constant(0))();
  IntColumn get currentMales => integer().withDefault(const Constant(0))();
  IntColumn get currentFemales =>
      integer().withDefault(const Constant(0))();
  IntColumn get currentTotal => integer().withDefault(const Constant(0))();
  RealColumn get targetLayingRate => real().nullable()();
  IntColumn get broilerDurationDays => integer().nullable()();
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
