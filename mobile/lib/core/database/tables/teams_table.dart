import 'package:drift/drift.dart';

class Teams extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get location => text().nullable()();
  TextColumn get logoUrl => text().nullable()();
  TextColumn get currency => text().withDefault(const Constant('XOF'))();
  TextColumn get inviteCode => text()();
  RealColumn get targetLayingRate =>
      real().withDefault(const Constant(70.0))();
  RealColumn get targetFertility =>
      real().withDefault(const Constant(85.0))();
  RealColumn get targetHatchRate =>
      real().withDefault(const Constant(82.0))();

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
