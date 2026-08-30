import 'package:guettgui_mobile/features/incubation/domain/entities/incubation_batch.dart';

abstract class IncubationRepository {
  Future<List<Map<String, dynamic>>> getIncubators(String teamId);
  Future<Map<String, dynamic>> createIncubator(
    String teamId,
    Map<String, dynamic> data,
  );
  Future<List<IncubationBatch>> getIncubationBatches(String teamId);
  Future<IncubationBatch> createBatch(
    String teamId,
    Map<String, dynamic> data,
  );
  Future<IncubationBatch> recordCandling1(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  );
  Future<IncubationBatch> recordCandling2(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  );
  Future<IncubationBatch> recordHatch(
    String teamId,
    String batchId,
    Map<String, dynamic> data,
  );
}
