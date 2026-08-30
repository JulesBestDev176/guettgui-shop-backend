import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';

abstract class DailyRecordRepository {
  Future<List<DailyRecord>> getDailyRecords(
    String teamId, {
    String? flockId,
    DateTime? dateFrom,
    DateTime? dateTo,
  });
  Future<DailyRecord> createDailyRecord(
    String teamId,
    Map<String, dynamic> data,
  );
  Future<DailyRecord> updateDailyRecord(
    String teamId,
    String recordId,
    Map<String, dynamic> data,
  );
  Future<List<DailyRecord>> getFlockDailyRecords(
    String teamId,
    String flockId,
  );
}
