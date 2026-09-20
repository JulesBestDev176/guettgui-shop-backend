import 'package:drift/drift.dart';

class IncubationBatches extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get incubatorId => text()();
  TextColumn get sourceFlockId => text()();
  TextColumn get status =>
      text().withDefault(const Constant('LOADING'))(); // LOADING, INCUBATING, CANDLING_1, CANDLING_2, HATCHING, COMPLETED, CANCELLED
  DateTimeColumn get loadDate => dateTime()();
  DateTimeColumn get candling1Date => dateTime().nullable()();
  DateTimeColumn get candling2Date => dateTime().nullable()();
  DateTimeColumn get expectedHatchDate => dateTime().nullable()();
  DateTimeColumn get actualHatchDate => dateTime().nullable()();
  IntColumn get eggsLoaded => integer()();
  IntColumn get eggsFertile => integer().nullable()();
  IntColumn get eggsClear => integer().nullable()();
  IntColumn get eggsDeadJ7 => integer().nullable()();
  IntColumn get eggsAliveJ14 => integer().nullable()();
  IntColumn get eggsDeadJ14 => integer().nullable()();
  IntColumn get chicksHatched => integer().nullable()();
  IntColumn get eggsUnhatched => integer().nullable()();
  RealColumn get fertilityRate => real().nullable()();
  RealColumn get hatchRate => real().nullable()();
  RealColumn get overallRate => real().nullable()();

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
