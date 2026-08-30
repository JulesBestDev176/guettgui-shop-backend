import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // --- PRIMARY (Vert logo Guett Gui) ---
  static const Color primary = Color(0xFF2EA831);
  static const Color primaryDark = Color(0xFF1E7A21);
  static const Color primaryLight = Color(0xFFE6F5E7);
  static const Color primaryContainer = Color(0xFF9ADB9C);
  static const Color onPrimary = Color(0xFFFFFFFF);

  // --- NIGHT ---
  static const Color night = Color(0xFF1D1D1B);
  static const Color secondary = Color(0xFF1D1D1B);
  static const Color secondaryLight = Color(0xFF3A3A38);

  // --- GOLD ---
  static const Color gold = Color(0xFFC8960C);

  // --- IVORY ---
  static const Color ivory = Color(0xFFF7F4EE);

  // --- SEMANTIC ---
  static const Color success = Color(0xFF2EA831);
  static const Color successLight = Color(0xFFE6F5E7);
  static const Color error = Color(0xFFD32F2F);
  static const Color errorLight = Color(0xFFFFEBEE);
  static const Color warning = Color(0xFFF57F17);
  static const Color warningLight = Color(0xFFFFF8E1);
  static const Color info = Color(0xFF0277BD);
  static const Color infoLight = Color(0xFFE1F5FE);

  // --- GRADIENT TEAL (Member card) ---
  static const Color tealDark = Color(0xFF1A3C40);
  static const Color tealMedium = Color(0xFF1B6A44);

  // --- NEUTRAL ---
  static const Color black = Color(0xFF1D1D1B);
  static const Color grey900 = Color(0xFF212121);
  static const Color grey700 = Color(0xFF424242);
  static const Color grey600 = Color(0xFF616161);
  static const Color grey500 = Color(0xFF757575);
  static const Color grey400 = Color(0xFF9E9E9E);
  static const Color grey300 = Color(0xFFBDBDBD);
  static const Color grey200 = Color(0xFFEEEEEE);
  static const Color grey100 = Color(0xFFF5F5F5);
  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color white = Color(0xFFFFFFFF);

  // --- SURFACE ---
  static const Color background = Color(0xFFF7F4EE);
  static const Color surface = Color(0xFFF7F4EE);
  static const Color divider = Color(0xFFE0E0E0);

  // --- PROTOTYPE SPECIFIC COLORS ---
  /// Text secondaire: rgba(29,29,27,0.55)
  static Color get textSecondary => night.withValues(alpha: 0.55);

  /// Text hint: rgba(29,29,27,0.20)
  static Color get textHint => night.withValues(alpha: 0.20);

  /// Text meta: rgba(29,29,27,0.45)
  static Color get textMeta => night.withValues(alpha: 0.45);

  /// Text desactive: rgba(29,29,27,0.38)
  static Color get textDisabled => night.withValues(alpha: 0.38);

  /// Card border: rgba(0,0,0,0.06)
  static Color get cardBorder => Colors.black.withValues(alpha: 0.06);

  /// Input border: rgba(29,29,27,0.12)
  static Color get inputBorder => night.withValues(alpha: 0.12);

  /// Glass card background: rgba(255,255,255,0.72)
  static Color get glassBackground => Colors.white.withValues(alpha: 0.72);

  /// Glass card border: rgba(255,255,255,0.6)
  static Color get glassBorder => Colors.white.withValues(alpha: 0.6);

  /// Glass card shadow: rgba(29,29,27,0.03) blur 16
  static Color get glassShadow => night.withValues(alpha: 0.03);

  /// Nav inactive: rgba(29,29,27,0.35)
  static Color get navInactive => night.withValues(alpha: 0.35);

  /// Bottom nav border: rgba(29,29,27,0.06)
  static Color get navBorder => night.withValues(alpha: 0.06);

  // --- FLOCK STATUS CHIPS ---
  static const Color flockActive = Color(0xFF2EA831);
  static const Color flockActiveLight = Color(0xFFE6F5E7);
  static const Color flockIncubating = Color(0xFFF57F17);
  static const Color flockIncubatingLight = Color(0xFFFFF8E1);
  static const Color flockGrowing = Color(0xFF0277BD);
  static const Color flockGrowingLight = Color(0xFFE1F5FE);
  static const Color flockCompleted = Color(0xFF9E9E9E);
  static const Color flockCompletedLight = Color(0xFFF5F5F5);
  static const Color flockAlert = Color(0xFFD32F2F);
  static const Color flockAlertLight = Color(0xFFFFEBEE);
  static const Color flockPaused = Color(0xFF8D6E63);
  static const Color flockPausedLight = Color(0xFFEFEBE9);

  // --- ROLE CHIPS ---
  static const Color roleOwner = Color(0xFF1E7A21);
  static const Color roleMember = Color(0xFF0277BD);

  // --- POULTRY TYPE COLORS ---
  static const Color typeGoliath = Color(0xFFC62828);
  static const Color typeLayers = Color(0xFFF9A825);
  static const Color typeBroilers = Color(0xFFEF6C00);
  static const Color typeQuails = Color(0xFF6A1B9A);

  // --- GRADIENT (Member card) ---
  static const LinearGradient memberCardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF1A3C40),
      Color(0xFF1B6A44),
      Color(0xFF2EA831),
    ],
    stops: [0.0, 0.55, 1.0],
  );

  static const LinearGradient headerGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [
      Color(0xFF1A3C40),
      Color(0xFF2A5C5A),
    ],
  );

  // --- SYNC STATUS ---
  static const Color syncSynced = Color(0xFF2EA831);
  static const Color syncPending = Color(0xFFF57F17);
  static const Color syncError = Color(0xFFD32F2F);
  static const Color syncOffline = Color(0xFF9E9E9E);
}
