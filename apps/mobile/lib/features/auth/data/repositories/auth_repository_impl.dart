import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:guettgui_mobile/features/auth/data/models/user_model.dart';
import 'package:guettgui_mobile/features/auth/domain/entities/user.dart';
import 'package:guettgui_mobile/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;
  final SecureStorageService _storage;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remote,
    required SecureStorageService storage,
  })  : _remote = remote,
        _storage = storage;

  @override
  Future<void> sendOtp(String phone) async {
    await _remote.sendOtp(phone);
  }

  @override
  Future<AuthResult> verifyOtp(String phone, String code) async {
    final data = await _remote.verifyOtp(phone, code);
    final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;
    final isNewUser = data['isNewUser'] as bool;

    await _storage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    await _storage.saveUserId(user.id);

    if (user.teamId != null) {
      await _storage.saveTeamId(user.teamId!);
    }

    return AuthResult(
      user: user,
      isNewUser: isNewUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
  }

  @override
  Future<void> updateProfile({
    required String firstName,
    required String lastName,
  }) async {
    await _remote.updateProfile(
      firstName: firstName,
      lastName: lastName,
    );
  }

  @override
  Future<void> createTeam({
    required String name,
    required String location,
  }) async {
    final data = await _remote.createTeam(name: name, location: location);
    final teamId = data['id'] as String;
    await _storage.saveTeamId(teamId);
  }

  @override
  Future<void> joinTeam(String inviteCode) async {
    final data = await _remote.joinTeam(inviteCode);
    final teamId = data['teamId'] as String;
    await _storage.saveTeamId(teamId);
  }

  @override
  Future<User?> getCurrentUser() async {
    final token = await _storage.getAccessToken();
    if (token == null) return null;
    try {
      final user = await _remote.getCurrentUser();
      return user;
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> logout() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken != null) {
      try {
        await _remote.logout(refreshToken);
      } catch (_) {
        // Ignore server errors during logout
      }
    }
    await _storage.clearAll();
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await _storage.getAccessToken();
    return token != null;
  }
}
