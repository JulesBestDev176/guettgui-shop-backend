import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/flocks_table.dart';

part 'flocks_dao.g.dart';

@DriftAccessor(tables: [Flocks])
class FlocksDao extends DatabaseAccessor<AppDatabase> with _$FlocksDaoMixin {
  FlocksDao(super.db);

  /// Get all active flocks for a team
  Future<List<Flock>> getActiveFlocks(String teamId) {
    return (select(flocks)
          ..where((f) => f.teamId.equals(teamId) & f.status.equals('ACTIVE'))
          ..orderBy([(f) => OrderingTerm.desc(f.localCreatedAt)]))
        .get();
  }

  /// Watch active flocks for a team (stream)
  Stream<List<Flock>> watchActiveFlocks(String teamId) {
    return (select(flocks)
          ..where((f) => f.teamId.equals(teamId) & f.status.equals('ACTIVE'))
          ..orderBy([(f) => OrderingTerm.desc(f.localCreatedAt)]))
        .watch();
  }

  /// Get all flocks for a team (any status)
  Future<List<Flock>> getAllFlocks(String teamId) {
    return (select(flocks)
          ..where((f) => f.teamId.equals(teamId))
          ..orderBy([(f) => OrderingTerm.desc(f.localCreatedAt)]))
        .get();
  }

  /// Watch all flocks for a team
  Stream<List<Flock>> watchAllFlocks(String teamId) {
    return (select(flocks)
          ..where((f) => f.teamId.equals(teamId))
          ..orderBy([(f) => OrderingTerm.desc(f.localCreatedAt)]))
        .watch();
  }

  /// Get a flock by ID
  Future<Flock?> getById(String id) {
    return (select(flocks)..where((f) => f.id.equals(id))).getSingleOrNull();
  }

  /// Watch a flock by ID
  Stream<Flock?> watchById(String id) {
    return (select(flocks)..where((f) => f.id.equals(id)))
        .watchSingleOrNull();
  }

  /// Insert a new flock
  Future<void> insertFlock(FlocksCompanion flock) {
    return into(flocks).insert(flock, mode: InsertMode.insertOrReplace);
  }

  /// Update a flock
  Future<bool> updateFlock(String id, FlocksCompanion flock) {
    return (update(flocks)..where((f) => f.id.equals(id))).write(flock).then(
        (rows) => rows > 0);
  }

  /// Delete a flock
  Future<int> deleteFlock(String id) {
    return (delete(flocks)..where((f) => f.id.equals(id))).go();
  }

  /// Get flocks by status
  Future<List<Flock>> getByStatus(String teamId, String status) {
    return (select(flocks)
          ..where(
              (f) => f.teamId.equals(teamId) & f.status.equals(status))
          ..orderBy([(f) => OrderingTerm.desc(f.localCreatedAt)]))
        .get();
  }
}
