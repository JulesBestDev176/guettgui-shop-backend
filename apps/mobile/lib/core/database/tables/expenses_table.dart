import 'package:drift/drift.dart';

class Expenses extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get flockId => text().nullable()();
  DateTimeColumn get date => dateTime()();
  TextColumn get category => text()(); // FEED, HEALTH, ANIMAL_PURCHASE, EQUIPMENT, LABOR, TRANSPORT, ENERGY, OTHER
  TextColumn get subCategory => text().nullable()();
  TextColumn get description => text()();
  IntColumn get amount => integer()(); // Montant en FCFA
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
