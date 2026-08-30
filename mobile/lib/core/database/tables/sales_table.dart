import 'package:drift/drift.dart';

class Sales extends Table {
  TextColumn get id => text()();
  TextColumn get teamId => text()();
  TextColumn get flockId => text().nullable()();
  TextColumn get customerId => text().nullable()();
  TextColumn get orderId => text().nullable()();
  DateTimeColumn get date => dateTime()();
  TextColumn get productType => text()(); // CHICKS, FERTILE_EGGS, CONSUMPTION_EGGS, etc.
  IntColumn get quantity => integer()();
  IntColumn get unitPrice => integer()();
  IntColumn get totalAmount => integer()();
  TextColumn get paymentStatus =>
      text().withDefault(const Constant('PAID'))(); // PAID, PENDING, PARTIAL
  IntColumn get amountPaid => integer().withDefault(const Constant(0))();
  TextColumn get paymentMethod => text().nullable()(); // CASH, WAVE, ORANGE_MONEY, etc.
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
