import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

/// Splash: logo 200px + spinner vert
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future<void>.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) context.go(AppRoutes.onboarding);
    });
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
