import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/daily_records_table.dart';

part 'daily_records_dao.g.dart';

@DriftAccessor(tables: [DailyRecords])
class DailyRecordsDao extends DatabaseAccessor<AppDatabase>
    with _$DailyRecordsDaoMixin {
  DailyRecordsDao(super.db);

  /// Get a record by flock ID and date
  Future<DailyRecord?> getByFlockAndDate(String flockId, DateTime date) {
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    return (select(dailyRecords)
          ..where((r) =>
              r.flockId.equals(flockId) &
              r.date.isBiggerOrEqualValue(startOfDay) &
              r.date.isSmallerThanValue(endOfDay)))
        .getSingleOrNull();
  }

  /// Get all records for a flock
  Future<List<DailyRecord>> getByFlock(String flockId) {
    return (select(dailyRecords)
          ..where((r) => r.flockId.equals(flockId))
          ..orderBy([(r) => OrderingTerm.desc(r.date)]))
        .get();
  }

  /// Watch all records for a flock
  Stream<List<DailyRecord>> watchByFlock(String flockId) {
    return (select(dailyRecords)
          ..where((r) => r.flockId.equals(flockId))
          ..orderBy([(r) => OrderingTerm.desc(r.date)]))
        .watch();
  }

  /// Get records for a flock within a date range
  Future<List<DailyRecord>> getByFlockAndDateRange(
    String flockId,
    DateTime from,
    DateTime to,
  ) {
    return (select(dailyRecords)
          ..where((r) =>
              r.flockId.equals(flockId) &
              r.date.isBiggerOrEqualValue(from) &
              r.date.isSmallerOrEqualValue(to))
          ..orderBy([(r) => OrderingTerm.desc(r.date)]))
        .get();
  }

  /// Insert a record
  Future<void> insertRecord(DailyRecordsCompanion record) {
    return into(dailyRecords)
        .insert(record, mode: InsertMode.insertOrReplace);
  }

  /// Update a record
  Future<bool> updateRecord(String id, DailyRecordsCompanion record) {
    return (update(dailyRecords)..where((r) => r.id.equals(id)))
        .write(record)
        .then((rows) => rows > 0);
  }
}
