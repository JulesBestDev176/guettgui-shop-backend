import 'package:drift/drift.dart';

class DailyRecords extends Table {
  TextColumn get id => text()();
  TextColumn get flockId => text()();
  DateTimeColumn get date => dateTime()();
  IntColumn get eggsLaid => integer().nullable()();
  IntColumn get eggsBroken => integer().nullable()();
  IntColumn get eggsCollected => integer().nullable()();
  IntColumn get mortalityCount =>
      integer().withDefault(const Constant(0))();
  TextColumn get mortalityCause => text().nullable()();
  RealColumn get feedConsumedKg => real().nullable()();
  RealColumn get waterConsumedL => real().nullable()();
  RealColumn get avgWeightKg => real().nullable()();
  IntColumn get sampleSize => integer().nullable()();
  TextColumn get notes => text().nullable()();
  TextColumn get photoUrl => text().nullable()();
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
