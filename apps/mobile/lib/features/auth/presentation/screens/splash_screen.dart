import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/features/auth/presentation/providers/auth_provider.dart';

/// Splash: logo 200px + spinner vert
/// Verifie le token d'authentification et redirige en consequence.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    try {
      // Timeout 5s max
      await ref
          .read(authStateProvider.notifier)
          .checkAuth()
          .timeout(const Duration(seconds: 5));
    } catch (_) {
      // Timeout ou erreur -> on continue
    }

    if (!mounted) return;

    final authState = ref.read(authStateProvider);

    if (authState.isAuthenticated && authState.user != null) {
      final user = authState.user!;
      if (user.hasTeam) {
        context.go(AppRoutes.dashboard);
      } else if (user.hasProfile) {
        context.go(AppRoutes.teamSetup);
      } else {
        context.go(AppRoutes.onboarding);
      }
    } else {
      context.go(AppRoutes.onboarding);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(
              'assets/images/logo_full.png',
              width: 200,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.primary,
                backgroundColor: AppColors.primary.withValues(alpha: 0.2),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
