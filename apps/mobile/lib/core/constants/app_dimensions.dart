import 'package:flutter/material.dart';

class AppDimensions {
  AppDimensions._();

  // --- SPACING (grille 4px, base 8px) ---
  static const double space2 = 2.0;
  static const double space4 = 4.0;
  static const double space6 = 6.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;
  static const double space40 = 40.0;
  static const double space48 = 48.0;
  static const double space64 = 64.0;

  // --- BORDER RADIUS ---
  static const double radiusXs = 4.0;
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusFull = 100.0;

  // --- ICON SIZES ---
  static const double iconSm = 16.0;
  static const double iconMd = 20.0;
  static const double iconLg = 24.0;
  static const double iconXl = 32.0;
  static const double iconXxl = 48.0;

  // --- TOUCH TARGETS ---
  static const double touchMin = 48.0;

  // --- COMPONENTS ---
  static const double buttonHeight = 52.0;
  static const double buttonHeightSm = 40.0;
  static const double inputHeight = 56.0;
  static const double avatarSm = 36.0;
  static const double avatarMd = 48.0;
  static const double avatarLg = 64.0;
  static const double avatarXl = 96.0;
  static const double bottomNavHeight = 72.0;
  static const double appBarHeight = 56.0;
  static const double cardElevation = 2.0;

  // --- FARM-SPECIFIC ---
  static const double flockCardHeight = 140.0;
  static const double dailyEntryCardHeight = 120.0;
  static const double incubationCardHeight = 160.0;
  static const double statCardHeight = 100.0;
  static const double stockCardHeight = 80.0;
  static const double walletCardHeight = 120.0;
  static const double alertCardHeight = 72.0;
  static const double timelineNodeSize = 32.0;
  static const double timelineLineWidth = 2.0;
  static const double progressBarHeight = 8.0;
  static const double quickActionSize = 64.0;
  static const double counterInputSize = 56.0;

  // --- SCREEN PADDING ---
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(
    horizontal: 16.0,
    vertical: 16.0,
  );
  static const EdgeInsets screenPaddingH = EdgeInsets.symmetric(
    horizontal: 16.0,
  );
}
