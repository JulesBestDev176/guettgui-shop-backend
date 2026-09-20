import 'package:guettgui_mobile/features/incubation/domain/entities/incubation_batch.dart';

class IncubationBatchModel extends IncubationBatch {
  const IncubationBatchModel({
    required super.id,
    required super.incubatorId,
    super.incubatorName,
    required super.eggsLoaded,
    required super.loadDate,
    required super.expectedHatchDate,
    super.candling1Fertile,
    super.candling1Infertile,
    super.candling1Date,
    super.candling2Alive,
    super.candling2Dead,
    super.candling2Date,
    super.hatchedCount,
    super.hatchedAlive,
    super.hatchedDead,
    super.hatchDate,
    required super.status,
    required super.teamId,
    required super.createdAt,
  });

  factory IncubationBatchModel.fromJson(Map<String, dynamic> json) {
    return IncubationBatchModel(
      id: json['id'] as String,
      incubatorId: json['incubatorId'] as String,
      incubatorName: json['incubatorName'] as String? ??
          (json['incubator'] is Map
              ? (json['incubator'] as Map)['name'] as String?
              : null),
      eggsLoaded: json['eggsLoaded'] as int,
      loadDate: DateTime.parse(json['loadDate'] as String),
      expectedHatchDate: DateTime.parse(json['expectedHatchDate'] as String),
      candling1Fertile: json['candling1Fertile'] as int?,
      candling1Infertile: json['candling1Infertile'] as int?,
      candling1Date: json['candling1Date'] != null
          ? DateTime.parse(json['candling1Date'] as String)
          : null,
      candling2Alive: json['candling2Alive'] as int?,
      candling2Dead: json['candling2Dead'] as int?,
      candling2Date: json['candling2Date'] != null
          ? DateTime.parse(json['candling2Date'] as String)
          : null,
      hatchedCount: json['hatchedCount'] as int?,
      hatchedAlive: json['hatchedAlive'] as int?,
      hatchedDead: json['hatchedDead'] as int?,
      hatchDate: json['hatchDate'] != null
          ? DateTime.parse(json['hatchDate'] as String)
          : null,
      status: json['status'] as String? ?? 'INCUBATING',
      teamId: json['teamId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'incubatorId': incubatorId,
      'eggsLoaded': eggsLoaded,
      'loadDate': loadDate.toIso8601String(),
      'expectedHatchDate': expectedHatchDate.toIso8601String(),
      'candling1Fertile': candling1Fertile,
      'candling1Infertile': candling1Infertile,
      'candling1Date': candling1Date?.toIso8601String(),
      'candling2Alive': candling2Alive,
      'candling2Dead': candling2Dead,
      'candling2Date': candling2Date?.toIso8601String(),
      'hatchedCount': hatchedCount,
      'hatchedAlive': hatchedAlive,
      'hatchedDead': hatchedDead,
      'hatchDate': hatchDate?.toIso8601String(),
      'status': status,
      'teamId': teamId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
