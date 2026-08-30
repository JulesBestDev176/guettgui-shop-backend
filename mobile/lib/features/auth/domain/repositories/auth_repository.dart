import 'package:guettgui_mobile/features/auth/domain/entities/user.dart';

abstract class AuthRepository {
  Future<void> sendOtp(String phone);
  Future<AuthResult> verifyOtp(String phone, String code);
  Future<void> updateProfile({
    required String firstName,
    required String lastName,
  });
  Future<void> createTeam({
    required String name,
    required String location,
  });
  Future<void> joinTeam(String inviteCode);
  Future<User?> getCurrentUser();
  Future<void> logout();
  Future<bool> isAuthenticated();
}

class AuthResult {
  final User user;
  final bool isNewUser;
  final String accessToken;
  final String refreshToken;

  const AuthResult({
    required this.user,
    required this.isNewUser,
    required this.accessToken,
    required this.refreshToken,
  });
}
