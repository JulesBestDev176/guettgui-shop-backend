import 'package:drift/drift.dart';

class SyncQueue extends Table {
  TextColumn get id => text()();
  TextColumn get entity => text()(); // "DailyRecord", "Sale", etc.
  TextColumn get entityId => text()();
  TextColumn get action => text()(); // "CREATE", "UPDATE", "DELETE"
  TextColumn get payload => text()(); // JSON
  DateTimeColumn get createdAt => dateTime()();
  IntColumn get retryCount =>
      integer().withDefault(const Constant(0))();
  TextColumn get status =>
      text().withDefault(const Constant('pending'))(); // pending, syncing, failed, synced
  TextColumn get errorMessage => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
