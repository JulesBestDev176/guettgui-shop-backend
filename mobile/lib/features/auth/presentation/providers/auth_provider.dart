import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:guettgui_mobile/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:guettgui_mobile/features/auth/domain/entities/user.dart';
import 'package:guettgui_mobile/features/auth/domain/repositories/auth_repository.dart';

// --- Repository Provider ---
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    remote: AuthRemoteDataSource(ref.watch(dioProvider)),
    storage: ref.watch(secureStorageProvider),
  );
});

// --- Auth State ---
class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

final authStateProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  /// Passer a false pour utiliser le vrai backend au lieu des donnees mock.
  bool _useMockData = true;

  static final _mockUser = User(
    id: 'mock-user',
    phone: '+221771234567',
    firstName: 'Amadou',
    lastName: 'Diallo',
    teamId: 'mock-team-001',
    teamName: 'FERME NDIAYE BI',
    role: 'OWNER',
    createdAt: DateTime.now(),
  );

  AuthNotifier(this._repository)
      : super(AuthState(
          user: User(
            id: 'mock-user',
            phone: '+221771234567',
            firstName: 'Amadou',
            lastName: 'Diallo',
            teamId: 'mock-team-001',
            teamName: 'FERME NDIAYE BI',
            role: 'OWNER',
            createdAt: DateTime.now(),
          ),
          isAuthenticated: true,
        ));

  /// Active ou desactive le mode mock.
  void setUseMockData(bool value) {
    _useMockData = value;
    if (_useMockData) {
      state = AuthState(user: _mockUser, isAuthenticated: true);
    } else {
      state = const AuthState();
    }
  }

  bool get useMockData => _useMockData;

  Future<void> checkAuth() async {
    if (_useMockData) {
      state = AuthState(user: _mockUser, isAuthenticated: true);
      return;
    }
    state = state.copyWith(isLoading: true);
    try {
      final isAuthenticated = await _repository.isAuthenticated();
      if (isAuthenticated) {
        final user = await _repository.getCurrentUser();
        state = AuthState(
          user: user,
          isAuthenticated: user != null,
        );
      } else {
        state = const AuthState();
      }
    } catch (_) {
      state = const AuthState();
    }
  }

  Future<void> sendOtp(String phone) async {
    if (_useMockData) {
      state = state.copyWith(isLoading: false);
      return;
    }
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.sendOtp(phone);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> verifyOtp(String phone, String code) async {
    if (_useMockData) {
      state = AuthState(user: _mockUser, isAuthenticated: true);
      return false;
    }
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _repository.verifyOtp(phone, code);
      state = AuthState(
        user: result.user,
        isAuthenticated: true,
      );
      return result.isNewUser;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<void> updateProfile({
    required String firstName,
    required String lastName,
  }) async {
    if (_useMockData) {
      state = state.copyWith(
        isLoading: false,
        user: _mockUser.copyWith(firstName: firstName, lastName: lastName),
      );
      return;
    }
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.updateProfile(
        firstName: firstName,
        lastName: lastName,
      );
      state = state.copyWith(
        isLoading: false,
        user: state.user?.copyWith(
          firstName: firstName,
          lastName: lastName,
        ),
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createTeam({
    required String name,
    required String location,
  }) async {
    if (_useMockData) {
      state = state.copyWith(isLoading: false);
      return;
    }
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.createTeam(name: name, location: location);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> joinTeam(String inviteCode) async {
    if (_useMockData) {
      state = state.copyWith(isLoading: false);
      return;
    }
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.joinTeam(inviteCode);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> logout() async {
    if (_useMockData) {
      state = const AuthState();
      return;
    }
    await _repository.logout();
    state = const AuthState();
  }

  void setUser(User user) {
    state = AuthState(user: user, isAuthenticated: true);
  }
}

// --- OTP Timer ---
final otpTimerProvider =
    StateNotifierProvider.autoDispose<OtpTimerNotifier, int>((ref) {
  return OtpTimerNotifier();
});

class OtpTimerNotifier extends StateNotifier<int> {
  Timer? _timer;

  OtpTimerNotifier() : super(300) {
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state > 0) {
        state = state - 1;
      } else {
        timer.cancel();
      }
    });
  }

  void reset() {
    _timer?.cancel();
    state = 300;
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
