class AuthTokensModel {
  final String accessToken;
  final String refreshToken;
  final bool isNewUser;

  const AuthTokensModel({
    required this.accessToken,
    required this.refreshToken,
    required this.isNewUser,
  });

  factory AuthTokensModel.fromJson(Map<String, dynamic> json) {
    return AuthTokensModel(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      isNewUser: json['isNewUser'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'isNewUser': isNewUser,
    };
  }
}
