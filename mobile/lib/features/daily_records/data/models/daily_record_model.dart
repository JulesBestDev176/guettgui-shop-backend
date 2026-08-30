import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';

class DailyRecordModel extends DailyRecord {
  const DailyRecordModel({
    required super.id,
    required super.flockId,
    required super.date,
    super.eggsLaid,
    super.eggsCollected,
    super.eggsBroken,
    super.mortalityCount,
    super.mortalityCause,
    super.feedConsumedKg,
    super.waterConsumedL,
    super.averageWeightG,
    super.notes,
    super.photoUrl,
    required super.recordedById,
    required super.createdAt,
  });

  factory DailyRecordModel.fromJson(Map<String, dynamic> json) {
    return DailyRecordModel(
      id: json['id'] as String,
      flockId: json['flockId'] as String,
      date: DateTime.parse(json['date'] as String),
      eggsLaid: json['eggsLaid'] as int?,
      eggsCollected: json['eggsCollected'] as int?,
      eggsBroken: json['eggsBroken'] as int?,
      mortalityCount: json['mortalityCount'] as int? ?? 0,
      mortalityCause: json['mortalityCause'] as String?,
      feedConsumedKg: (json['feedConsumedKg'] as num?)?.toDouble(),
      waterConsumedL: (json['waterConsumedL'] as num?)?.toDouble(),
      averageWeightG: (json['averageWeightG'] as num?)?.toDouble(),
      notes: json['notes'] as String?,
      photoUrl: json['photoUrl'] as String?,
      recordedById: json['recordedById'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'flockId': flockId,
      'date': date.toIso8601String(),
      'eggsLaid': eggsLaid,
      'eggsCollected': eggsCollected,
      'eggsBroken': eggsBroken,
      'mortalityCount': mortalityCount,
      'mortalityCause': mortalityCause,
      'feedConsumedKg': feedConsumedKg,
      'waterConsumedL': waterConsumedL,
      'averageWeightG': averageWeightG,
      'notes': notes,
      'photoUrl': photoUrl,
      'recordedById': recordedById,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
