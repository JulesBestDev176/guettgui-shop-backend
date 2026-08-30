import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';

enum GGChipType {
  active,
  completed,
  incubating,
  growing,
  alert,
  paused,
  pending,
  paid,
  partial,
}

class GGChip extends StatelessWidget {
  final String label;
  final GGChipType type;

  const GGChip({
    super.key,
    required this.label,
    required this.type,
  });

  @override
  Widget build(BuildContext context) {
    final (bgColor, textColor) = _getColors();

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.space12,
        vertical: AppDimensions.space4,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: textColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: AppDimensions.space6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  (Color, Color) _getColors() {
    return switch (type) {
      GGChipType.active => (AppColors.flockActiveLight, AppColors.flockActive),
      GGChipType.completed => (
          AppColors.flockCompletedLight,
          AppColors.flockCompleted,
        ),
      GGChipType.incubating => (
          AppColors.flockIncubatingLight,
          AppColors.flockIncubating,
        ),
      GGChipType.growing => (
          AppColors.flockGrowingLight,
          AppColors.flockGrowing,
        ),
      GGChipType.alert => (AppColors.flockAlertLight, AppColors.flockAlert),
      GGChipType.paused => (
          AppColors.flockPausedLight,
          AppColors.flockPaused,
        ),
      GGChipType.pending => (AppColors.warningLight, AppColors.warning),
      GGChipType.paid => (AppColors.successLight, AppColors.success),
      GGChipType.partial => (AppColors.infoLight, AppColors.info),
    };
  }
}
