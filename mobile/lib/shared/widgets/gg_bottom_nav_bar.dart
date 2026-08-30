import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// Bottom nav: 64px height, fond #F7F4EE, border-top rgba(29,29,27,0.06)
/// 5 items flex: [Accueil] [Elevage] [FAB 48dp] [Finances] [Profil]
/// FAB: 48px circle #2EA831, shadow rgba(46,168,49,0.25), icon add 22px blanc
class GGBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final VoidCallback onFabPressed;

  const GGBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.onFabPressed,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Container(
      height: 64 + bottomPadding,
      decoration: BoxDecoration(
        color: AppColors.ivory,
        border: Border(
          top: BorderSide(color: AppColors.navBorder),
        ),
      ),
      child: Padding(
        padding: EdgeInsets.only(bottom: bottomPadding, left: 6, right: 6),
        child: Row(
          children: [
            // Tab 0: Accueil
            _NavTab(
              icon: Icons.home_outlined,
              label: 'Accueil',
              isActive: currentIndex == 0,
              onTap: () => onTap(0),
            ),
            // Tab 1: Elevage
            _NavTab(
              icon: Icons.egg_outlined,
              label: 'Elevage',
              isActive: currentIndex == 1,
              onTap: () => onTap(1),
            ),
            // FAB center
            Expanded(
              child: Center(
                child: GestureDetector(
                  onTap: onFabPressed,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.25),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 22),
                  ),
                ),
              ),
            ),
            // Tab 2: Finances
            _NavTab(
              icon: Icons.account_balance_wallet_outlined,
              label: 'Finances',
              isActive: currentIndex == 2,
              onTap: () => onTap(2),
            ),
            // Tab 3: Profil
            _NavTab(
              icon: Icons.person_outlined,
              label: 'Profil',
              isActive: currentIndex == 3,
              onTap: () => onTap(3),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavTab extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavTab({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isActive ? AppColors.primary : AppColors.navInactive;

    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: color,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
