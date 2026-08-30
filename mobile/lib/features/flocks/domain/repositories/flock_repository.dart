import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';

abstract class FlockRepository {
  Future<List<Flock>> getFlocks(String teamId, {String? status, String? type});
  Future<Flock> getFlockById(String teamId, String flockId);
  Future<Flock> createFlock(String teamId, Map<String, dynamic> data);
  Future<Flock> updateFlock(String teamId, String flockId, Map<String, dynamic> data);
  Future<Flock> closeFlock(String teamId, String flockId, Map<String, dynamic> data);
  Future<void> deleteFlock(String teamId, String flockId);
}
