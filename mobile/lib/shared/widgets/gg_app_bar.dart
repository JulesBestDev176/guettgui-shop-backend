import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// Dashboard app bar: 48px height, padding 0 16px
/// Row: [person 22px night] [gap 10px] [PROPRIETAIRE 11px w700 letter-spacing:1.4]
///      [spacer]
///      [warning icon 22px + badge orange "3"]
///      [notifications icon 22px + badge red "5"]
class GGAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String role;
  final int alertCount;
  final int notificationCount;
  final VoidCallback? onAlertTap;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;

  const GGAppBar({
    super.key,
    required this.role,
    this.alertCount = 0,
    this.notificationCount = 0,
    this.onAlertTap,
    this.onNotificationTap,
    this.onProfileTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        color: AppColors.ivory,
        child: Row(
          children: [
            GestureDetector(
              onTap: onProfileTap,
              behavior: HitTestBehavior.opaque,
              child: const Icon(
                Icons.person_outlined,
                color: AppColors.night,
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              role.toUpperCase(),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.4,
                color: AppColors.night,
              ),
            ),
            const Spacer(),
            // Warning badge
            _IconBadge(
              icon: Icons.warning_outlined,
              count: alertCount,
              badgeColor: AppColors.warning,
              onTap: onAlertTap,
            ),
            const SizedBox(width: 4),
            // Notification badge
            _IconBadge(
              icon: Icons.notifications_outlined,
              count: notificationCount,
              badgeColor: AppColors.error,
              onTap: onNotificationTap,
            ),
          ],
        ),
      ),
    );
  }
}

class _IconBadge extends StatelessWidget {
  final IconData icon;
  final int count;
  final Color badgeColor;
  final VoidCallback? onTap;

  const _IconBadge({
    required this.icon,
    required this.count,
    required this.badgeColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 36,
        height: 36,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Center(
              child: Icon(icon, color: AppColors.night, size: 22),
            ),
            if (count > 0)
              Positioned(
                top: 2,
                right: 0,
                child: Container(
                  constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(7),
                  ),
                  child: Center(
                    child: Text(
                      '$count',
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                        height: 1.2,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
