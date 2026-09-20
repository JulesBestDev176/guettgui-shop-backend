class User {
  final String id;
  final String phone;
  final String? firstName;
  final String? lastName;
  final String? avatarUrl;
  final String? teamId;
  final String? teamName;
  final String? role;
  final DateTime createdAt;

  const User({
    required this.id,
    required this.phone,
    this.firstName,
    this.lastName,
    this.avatarUrl,
    this.teamId,
    this.teamName,
    this.role,
    required this.createdAt,
  });

  String get fullName {
    if (firstName == null && lastName == null) return '';
    return '${firstName ?? ''} ${lastName ?? ''}'.trim();
  }

  String get displayName {
    if (firstName != null) return firstName!;
    return phone;
  }

  bool get isOwner => role == 'OWNER';
  bool get hasTeam => teamId != null;
  bool get hasProfile => firstName != null && lastName != null;

  User copyWith({
    String? id,
    String? phone,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    String? teamId,
    String? teamName,
    String? role,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      phone: phone ?? this.phone,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      teamId: teamId ?? this.teamId,
      teamName: teamName ?? this.teamName,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
