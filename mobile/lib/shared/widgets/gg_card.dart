import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// GlassCard — carte avec fond blanc semi-transparent, ombre tres legere.
/// PAS de BackdropFilter (crash sur Chrome web).
class GGGlassCard extends StatelessWidget {
  const GGGlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(14),
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final BorderRadius borderRadius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: padding,
        decoration: BoxDecoration(
          color: AppColors.glassBackground,
          borderRadius: borderRadius,
          border: Border.all(color: AppColors.glassBorder),
          boxShadow: [
            BoxShadow(
              color: AppColors.glassShadow,
              blurRadius: 16,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: child,
      ),
    );
  }
}

/// Compat wrapper — old GGCard API delegates to GGGlassCard.
class GGCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final bool isActive;
  final Color? backgroundColor;
  final double? borderRadius;

  const GGCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.isActive = false,
    this.backgroundColor,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final br = BorderRadius.circular(borderRadius ?? 16);

    if (isActive) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          padding: padding ?? const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: backgroundColor ?? AppColors.glassBackground,
            borderRadius: br,
            border: Border.all(color: AppColors.primary, width: 2),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.10),
                blurRadius: 16,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: child,
        ),
      );
    }

    return GGGlassCard(
      padding: padding ?? const EdgeInsets.all(14),
      borderRadius: br,
      onTap: onTap,
      child: child,
    );
  }
}
