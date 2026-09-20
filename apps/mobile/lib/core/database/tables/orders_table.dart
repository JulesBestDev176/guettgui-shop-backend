import 'package:drift/drift.dart';

class Orders extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get customerId => text()();
  TextColumn get flockId => text().nullable()();
  TextColumn get productType => text()(); // CHICKS, FERTILE_EGGS, etc.
  IntColumn get quantity => integer()();
  IntColumn get unitPrice => integer().nullable()();
  DateTimeColumn get requestedDate => dateTime()();
  TextColumn get status =>
      text().withDefault(const Constant('PENDING'))(); // PENDING, CONFIRMED, DELIVERED, CANCELLED
  TextColumn get notes => text().nullable()();
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
