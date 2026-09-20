import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';

enum SyncStatus { synced, pending, error, offline }

class GGSyncIndicator extends StatelessWidget {
  final SyncStatus status;
  final int pendingCount;

  const GGSyncIndicator({
    super.key,
    required this.status,
    this.pendingCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    final (color, label) = _getStatusInfo();

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: AppDimensions.space6),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: color,
          ),
        ),
      ],
    );
  }

  (Color, String) _getStatusInfo() {
    return switch (status) {
      SyncStatus.synced => (
          AppColors.syncSynced,
          AppStrings.syncSynced,
        ),
      SyncStatus.pending => (
          AppColors.syncPending,
          '$pendingCount ${AppStrings.syncPending}',
        ),
      SyncStatus.error => (
          AppColors.syncError,
          AppStrings.syncError,
        ),
      SyncStatus.offline => (
          AppColors.syncOffline,
          AppStrings.syncOffline,
        ),
    };
  }
}
