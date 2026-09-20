import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';

class FlockModel extends Flock {
  const FlockModel({
    required super.id,
    required super.name,
    required super.type,
    super.breed,
    required super.startDate,
    super.endDate,
    required super.initialFemales,
    required super.initialMales,
    required super.initialTotal,
    required super.currentTotal,
    required super.status,
    required super.teamId,
    required super.createdAt,
  });

  factory FlockModel.fromJson(Map<String, dynamic> json) {
    return FlockModel(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      breed: json['breed'] as String?,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] != null
          ? DateTime.parse(json['endDate'] as String)
          : null,
      initialFemales: json['initialFemales'] as int? ?? 0,
      initialMales: json['initialMales'] as int? ?? 0,
      initialTotal: json['initialTotal'] as int? ?? 0,
      currentTotal: json['currentTotal'] as int? ?? 0,
      status: json['status'] as String? ?? 'ACTIVE',
      teamId: json['teamId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'breed': breed,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'initialFemales': initialFemales,
      'initialMales': initialMales,
      'initialTotal': initialTotal,
      'currentTotal': currentTotal,
      'status': status,
      'teamId': teamId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
