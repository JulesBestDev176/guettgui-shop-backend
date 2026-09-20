import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../database/app_database.dart';
import 'conflict_resolver.dart';
import 'sync_status.dart';

/// SyncEngine manages the push/pull synchronization cycle.
///
/// For now, this is a mock implementation that logs operations
/// without making actual network calls (backend not connected).
class SyncEngine {
  final AppDatabase _db;
  final SyncStatusNotifier _statusNotifier;
  final ConflictResolver _conflictResolver;

  Timer? _periodicTimer;
  bool _isSyncing = false;

  SyncEngine({
    required AppDatabase db,
    required SyncStatusNotifier statusNotifier,
    ConflictResolver? conflictResolver,
  })  : _db = db,
        _statusNotifier = statusNotifier,
        _conflictResolver = conflictResolver ?? ConflictResolver();

  /// Start periodic sync (every 5 minutes)
  void startPeriodicSync() {
    _periodicTimer?.cancel();
    _periodicTimer = Timer.periodic(
      const Duration(minutes: 5),
      (_) => sync(),
    );
    debugPrint('[SyncEngine] Periodic sync started (every 5 minutes)');
  }

  /// Stop periodic sync
  void stopPeriodicSync() {
    _periodicTimer?.cancel();
    _periodicTimer = null;
    debugPrint('[SyncEngine] Periodic sync stopped');
  }

  /// Execute a full sync cycle (push + pull)
  Future<void> sync() async {
    if (_isSyncing) {
      debugPrint('[SyncEngine] Sync already in progress, skipping');
      return;
    }

    _isSyncing = true;
    debugPrint('[SyncEngine] Starting sync cycle...');

    try {
      await _push();
      await _pull();
      await _updateStatus();
      debugPrint('[SyncEngine] Sync cycle completed');
    } catch (e) {
      debugPrint('[SyncEngine] Sync cycle failed: $e');
      _statusNotifier.setError(e.toString());
    } finally {
      _isSyncing = false;
    }
  }

  /// Push local changes to server.
  /// Mock implementation: reads pending queue entries and logs them.
  Future<void> _push() async {
    final pending = await _db.syncQueueDao.getPending();

    if (pending.isEmpty) {
      debugPrint('[SyncEngine] Push: no pending changes');
      return;
    }

    debugPrint('[SyncEngine] Push: ${pending.length} pending entries');

    for (final entry in pending) {
      debugPrint(
        '[SyncEngine] Push [MOCK]: ${entry.action} ${entry.entity}/${entry.entityId}',
      );

      // Mark as syncing
      await _db.syncQueueDao.markSyncing(entry.id);

      // Mock: simulate successful sync
      // In production, this would POST to /sync/push
      await _db.syncQueueDao.markSynced(entry.id);

      debugPrint(
        '[SyncEngine] Push [MOCK]: ${entry.entity}/${entry.entityId} marked as synced',
      );
    }
  }

  /// Pull changes from server.
  /// Mock implementation: logs that pull was attempted.
  Future<void> _pull() async {
    // Mock: In production, this would GET /sync/pull?since={lastSyncTimestamp}
    debugPrint('[SyncEngine] Pull [MOCK]: checking for server changes...');
    debugPrint('[SyncEngine] Pull [MOCK]: no server changes (mock mode)');
  }

  /// Update the sync status based on current queue state
  Future<void> _updateStatus() async {
    final pending = await _db.syncQueueDao.getPending();
    final retryable = await _db.syncQueueDao.getRetryable();

    final totalPending = pending.length + retryable.length;

    if (totalPending == 0) {
      _statusNotifier.setSynced();
    } else {
      _statusNotifier.setPending(totalPending);
    }
  }

  /// Clean up old synced entries
  Future<void> cleanup() async {
    final deleted = await _db.syncQueueDao.deleteOldSynced();
    if (deleted > 0) {
      debugPrint('[SyncEngine] Cleanup: removed $deleted old synced entries');
    }
  }

  /// Resolve a conflict between local and server data.
  /// Exposed for use by the pull logic when server data conflicts.
  SyncResolution resolveConflict(LocalChange local, ServerChange server) {
    return _conflictResolver.resolve(local, server);
  }

  /// Dispose resources
  void dispose() {
    stopPeriodicSync();
  }
}

/// Provider for the SyncEngine
final syncEngineProvider = Provider<SyncEngine>((ref) {
  final db = ref.watch(appDatabaseProvider);
  final statusNotifier = ref.watch(syncStatusProvider.notifier);

  final engine = SyncEngine(
    db: db,
    statusNotifier: statusNotifier,
  );

  ref.onDispose(() => engine.dispose());

  return engine;
});

/// Provider for the AppDatabase
final appDatabaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(() => db.close());
  return db;
});
