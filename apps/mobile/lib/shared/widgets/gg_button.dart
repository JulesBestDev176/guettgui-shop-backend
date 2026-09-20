import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

enum GGButtonStyle { primary, outlined, danger, accent }

/// Button: 48px height, radius 12px
class GGButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final GGButtonStyle style;
  final bool isLoading;
  final IconData? icon;
  final bool fullWidth;

  const GGButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.style = GGButtonStyle.primary,
    this.isLoading = false,
    this.icon,
    this.fullWidth = true,
  });

  const GGButton.outlined({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.fullWidth = true,
  }) : style = GGButtonStyle.outlined;

  const GGButton.danger({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.fullWidth = true,
  }) : style = GGButtonStyle.danger;

  const GGButton.accent({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.fullWidth = true,
  }) : style = GGButtonStyle.accent;

  @override
  Widget build(BuildContext context) {
    if (style == GGButtonStyle.outlined) {
      return SizedBox(
        width: fullWidth ? double.infinity : null,
        height: 48,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.primary, width: 1.5),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: _buildChild(AppColors.primary),
        ),
      );
    }

    final bgColor = switch (style) {
      GGButtonStyle.primary => AppColors.primary,
      GGButtonStyle.danger => AppColors.error,
      GGButtonStyle.accent => AppColors.secondary,
      GGButtonStyle.outlined => AppColors.primary,
    };

    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: 48,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          foregroundColor: AppColors.white,
          disabledBackgroundColor: bgColor.withValues(alpha: 0.4),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: _buildChild(AppColors.white),
      ),
    );
  }

  Widget _buildChild(Color color) {
    if (isLoading) {
      return SizedBox(
        width: 24,
        height: 24,
        child: CircularProgressIndicator(strokeWidth: 2.5, color: color),
      );
    }

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
          ),
        ],
      );
    }

    return Text(
      label,
      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
    );
  }
}
