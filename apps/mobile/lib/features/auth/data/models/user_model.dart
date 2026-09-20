import 'package:guettgui_mobile/features/auth/domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.phone,
    super.firstName,
    super.lastName,
    super.avatarUrl,
    super.teamId,
    super.teamName,
    super.role,
    required super.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      phone: json['phone'] as String,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      teamId: json['teamId'] as String?,
      teamName: json['teamName'] as String?,
      role: json['role'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'firstName': firstName,
      'lastName': lastName,
      'avatarUrl': avatarUrl,
      'teamId': teamId,
      'teamName': teamName,
      'role': role,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
