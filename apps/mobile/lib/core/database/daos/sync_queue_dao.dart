import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/sync_queue_table.dart';

part 'sync_queue_dao.g.dart';

@DriftAccessor(tables: [SyncQueue])
class SyncQueueDao extends DatabaseAccessor<AppDatabase>
    with _$SyncQueueDaoMixin {
  SyncQueueDao(super.db);

  /// Get all pending sync entries, ordered by creation date (FIFO)
  Future<List<SyncQueueData>> getPending() {
    return (select(syncQueue)
          ..where((q) => q.status.equals('pending'))
          ..orderBy([(q) => OrderingTerm.asc(q.createdAt)]))
        .get();
  }

  /// Watch pending count
  Stream<int> watchPendingCount() {
    final countExp = syncQueue.id.count();
    final query = selectOnly(syncQueue)
      ..addColumns([countExp])
      ..where(syncQueue.status.equals('pending'));
    return query
        .map((row) => row.read(countExp) ?? 0)
        .watchSingle();
  }

  /// Get failed entries with retry count < max
  Future<List<SyncQueueData>> getRetryable({int maxRetries = 5}) {
    return (select(syncQueue)
          ..where((q) =>
              q.status.equals('failed') &
              q.retryCount.isSmallerThanValue(maxRetries))
          ..orderBy([(q) => OrderingTerm.asc(q.createdAt)]))
        .get();
  }

  /// Mark an entry as syncing
  Future<bool> markSyncing(String id) {
    return (update(syncQueue)..where((q) => q.id.equals(id)))
        .write(const SyncQueueCompanion(
          status: Value('syncing'),
        ))
        .then((rows) => rows > 0);
  }

  /// Mark an entry as synced
  Future<bool> markSynced(String id) {
    return (update(syncQueue)..where((q) => q.id.equals(id)))
        .write(const SyncQueueCompanion(
          status: Value('synced'),
        ))
        .then((rows) => rows > 0);
  }

  /// Mark an entry as failed with error message and increment retry count
  Future<bool> markFailed(String id, String? errorMsg) {
    return customUpdate(
      'UPDATE sync_queue SET status = ?, error_message = ?, retry_count = retry_count + 1 WHERE id = ?',
      variables: [
        Variable.withString('failed'),
        Variable.withString(errorMsg ?? ''),
        Variable.withString(id),
      ],
      updates: {syncQueue},
    ).then((rows) => rows > 0);
  }

  /// Delete old synced entries (cleanup)
  Future<int> deleteOldSynced({Duration olderThan = const Duration(days: 7)}) {
    final threshold = DateTime.now().subtract(olderThan);
    return (delete(syncQueue)
          ..where((q) =>
              q.status.equals('synced') &
              q.createdAt.isSmallerThanValue(threshold)))
        .go();
  }

  /// Insert a new entry into the sync queue
  Future<void> enqueue(SyncQueueCompanion entry) {
    return into(syncQueue).insert(entry, mode: InsertMode.insertOrReplace);
  }

  /// Get all entries (for debugging)
  Future<List<SyncQueueData>> getAll() {
    return (select(syncQueue)
          ..orderBy([(q) => OrderingTerm.desc(q.createdAt)]))
        .get();
  }
}
