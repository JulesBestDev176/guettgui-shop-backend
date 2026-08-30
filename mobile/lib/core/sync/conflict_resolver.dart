import 'package:flutter/foundation.dart';

/// Represents a local change
class LocalChange {
  final String entityId;
  final String entity;
  final Map<String, dynamic> data;
  final DateTime updatedAt;

  const LocalChange({
    required this.entityId,
    required this.entity,
    required this.data,
    required this.updatedAt,
  });
}

/// Represents a server change
class ServerChange {
  final String entityId;
  final String entity;
  final Map<String, dynamic> data;
  final DateTime updatedAt;

  const ServerChange({
    required this.entityId,
    required this.entity,
    required this.data,
    required this.updatedAt,
  });
}

/// The action to take after resolving a conflict
enum SyncAction {
  /// Keep local version, push it to the server
  pushLocal,

  /// Accept server version, overwrite local
  acceptServer,
}

/// The result of conflict resolution
class SyncResolution {
  final dynamic winner;
  final dynamic loser;
  final SyncAction action;
  final String auditMessage;

  const SyncResolution({
    required this.winner,
    required this.loser,
    required this.action,
    required this.auditMessage,
  });
}

/// Resolves conflicts between local and server changes using
/// a Last-Write-Wins strategy based on localUpdatedAt / updatedAt
class ConflictResolver {
  /// Resolve a conflict between a local change and a server change.
  /// The modification with the most recent timestamp wins.
  SyncResolution resolve(LocalChange local, ServerChange server) {
    if (local.updatedAt.isAfter(server.updatedAt)) {
      debugPrint(
        '[ConflictResolver] Local wins for ${local.entity}/${local.entityId} '
        '(local: ${local.updatedAt}, server: ${server.updatedAt})',
      );
      return SyncResolution(
        winner: local,
        loser: server,
        action: SyncAction.pushLocal,
        auditMessage:
            'Conflit resolu : modification locale conservee pour ${local.entity}/${local.entityId}',
      );
    } else {
      debugPrint(
        '[ConflictResolver] Server wins for ${server.entity}/${server.entityId} '
        '(local: ${local.updatedAt}, server: ${server.updatedAt})',
      );
      return SyncResolution(
        winner: server,
        loser: local,
        action: SyncAction.acceptServer,
        auditMessage:
            'Conflit resolu : modification serveur conservee pour ${server.entity}/${server.entityId}',
      );
    }
  }
}
