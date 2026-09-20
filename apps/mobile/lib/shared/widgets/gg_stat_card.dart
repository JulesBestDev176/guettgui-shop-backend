import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

class GGStatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color iconBackgroundColor;
  final Color? iconColor;
  final String? suffix;
  final String? trend;
  final bool? trendPositive;
  final VoidCallback? onTap;

  const GGStatCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    this.iconBackgroundColor = const Color(0xFFE6F5E7),
    this.iconColor,
    this.suffix,
    this.trend,
    this.trendPositive,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveIconColor = iconColor ?? AppColors.primary;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 100),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.glassBackground,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.glassBorder),
          boxShadow: [
            BoxShadow(
              color: AppColors.glassShadow,
              blurRadius: 16,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: iconBackgroundColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 16, color: effectiveIconColor),
            ),
            const Spacer(),
            Text(
              label,
              style: TextStyle(fontSize: 11, color: AppColors.textMeta),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Flexible(
                  child: Text(
                    value,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.night,
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (suffix != null) ...[
                  const SizedBox(width: 4),
                  Text(
                    suffix!,
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textDisabled,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
