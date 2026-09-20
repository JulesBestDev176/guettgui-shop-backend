import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Represents the current synchronization status
enum SyncStatus {
  /// All data is synchronized with the server
  synced,

  /// There are pending changes waiting to be synced
  pending,

  /// A sync error occurred
  error,

  /// Device is offline, sync is paused
  offline,
}

/// State that holds sync status and optional pending count
class SyncState {
  final SyncStatus status;
  final int pendingCount;
  final String? lastError;

  const SyncState({
    this.status = SyncStatus.offline,
    this.pendingCount = 0,
    this.lastError,
  });

  SyncState copyWith({
    SyncStatus? status,
    int? pendingCount,
    String? lastError,
  }) {
    return SyncState(
      status: status ?? this.status,
      pendingCount: pendingCount ?? this.pendingCount,
      lastError: lastError ?? this.lastError,
    );
  }
}

/// Notifier that manages the sync state
class SyncStatusNotifier extends StateNotifier<SyncState> {
  SyncStatusNotifier() : super(const SyncState());

  void setSynced() {
    state = state.copyWith(
      status: SyncStatus.synced,
      pendingCount: 0,
      lastError: null,
    );
  }

  void setPending(int count) {
    state = state.copyWith(
      status: SyncStatus.pending,
      pendingCount: count,
    );
  }

  void setError(String message) {
    state = state.copyWith(
      status: SyncStatus.error,
      lastError: message,
    );
  }

  void setOffline() {
    state = state.copyWith(status: SyncStatus.offline);
  }

  void updatePendingCount(int count) {
    if (count == 0 && state.status == SyncStatus.pending) {
      setSynced();
    } else if (count > 0) {
      setPending(count);
    }
  }
}

/// Provider for the sync status notifier
final syncStatusProvider =
    StateNotifierProvider<SyncStatusNotifier, SyncState>((ref) {
  return SyncStatusNotifier();
});
