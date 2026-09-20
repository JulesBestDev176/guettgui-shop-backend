import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// Glass card montant pleine largeur.
/// Icon circle 28px night + trending_up green + label + amount 24px w700 + "XOF" suffix
class GGAmountCard extends StatelessWidget {
  final String label;
  final String amountText;
  final IconData icon;
  final bool showTrend;
  final String? trendText;
  final VoidCallback? onTap;

  const GGAmountCard({
    super.key,
    required this.label,
    required this.amountText,
    this.icon = Icons.payments_outlined,
    this.showTrend = true,
    this.trendText,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
            width: double.infinity,
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
                // Icon + trend row
                Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: AppColors.night.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, size: 16, color: AppColors.night),
                    ),
                    const Spacer(),
                    if (showTrend)
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.trending_up,
                            size: 16,
                            color: AppColors.primary,
                          ),
                          if (trendText != null) ...[
                            const SizedBox(width: 3),
                            Text(
                              trendText!,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ],
                      ),
                  ],
                ),
                const SizedBox(height: 10),
                // Label
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textMeta,
                  ),
                ),
                const SizedBox(height: 2),
                // Amount + XOF
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Flexible(
                      child: Text(
                        amountText,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppColors.night,
                          fontFeatures: [FontFeature.tabularFigures()],
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'XOF',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textDisabled,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
    );
  }
}
