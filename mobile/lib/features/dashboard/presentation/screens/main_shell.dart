import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/widgets/gg_bottom_nav_bar.dart';

class MainShell extends StatelessWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith(AppRoutes.dashboard)) return 0;
    if (location.startsWith(AppRoutes.flocks)) return 1;
    if (location.startsWith(AppRoutes.finances)) return 2;
    if (location.startsWith(AppRoutes.profile)) return 3;
    return 0;
  }

  void _onTabTap(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go(AppRoutes.dashboard);
      case 1:
        context.go(AppRoutes.flocks);
      case 2:
        context.go(AppRoutes.finances);
      case 3:
        context.go(AppRoutes.profile);
    }
  }

  void _onFabPressed(BuildContext context) {
    _showBottomSheet(
      context,
      title: 'Ajouter',
      items: [
        _SheetItem(
          icon: Icons.egg_outlined,
          label: 'Nouveau lot',
          bg: AppColors.primary.withValues(alpha: 0.10),
          color: AppColors.night,
          onTap: () {
            Navigator.pop(context);
            context.push(AppRoutes.createFlock);
          },
        ),
        _SheetItem(
          icon: Icons.payments_outlined,
          label: 'Nouvelle vente',
          bg: AppColors.primary.withValues(alpha: 0.10),
          color: AppColors.night,
          onTap: () {
            Navigator.pop(context);
            context.push(AppRoutes.createSale);
          },
        ),
        _SheetItem(
          icon: Icons.receipt_long_outlined,
          label: 'Nouvelle depense',
          bg: AppColors.night.withValues(alpha: 0.08),
          color: AppColors.night,
          onTap: () {
            Navigator.pop(context);
            context.push(AppRoutes.createExpense);
          },
        ),
        _SheetItem(
          icon: Icons.device_thermostat_outlined,
          label: 'Nouvelle couvee',
          bg: AppColors.night.withValues(alpha: 0.08),
          color: AppColors.night,
          onTap: () {
            Navigator.pop(context);
            context.push(AppRoutes.createBatch);
          },
        ),
      ],
    );
  }

  void _showBottomSheet(
    BuildContext context, {
    required String title,
    required List<_SheetItem> items,
  }) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: AppColors.night.withValues(alpha: 0.35),
      builder: (ctx) => _BottomSheetContent(title: title, items: items),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: child,
      bottomNavigationBar: GGBottomNavBar(
        currentIndex: _getCurrentIndex(context),
        onTap: (index) => _onTabTap(context, index),
        onFabPressed: () => _onFabPressed(context),
      ),
    );
  }
}

class _SheetItem {
  final IconData icon;
  final String label;
  final Color bg;
  final Color color;
  final VoidCallback onTap;

  const _SheetItem({
    required this.icon,
    required this.label,
    required this.bg,
    required this.color,
    required this.onTap,
  });
}

/// Bottom Sheet matching prototype:
/// Overlay rgba(29,29,27,0.35)
/// Sheet: fond #F7F4EE, radius 20px top, padding 16px
/// Handle: 36x4px, Title 16px w600
/// Items: 56px height, white card radius 16px, border rgba(0,0,0,0.06)
class _BottomSheetContent extends StatelessWidget {
  final String title;
  final List<_SheetItem> items;

  const _BottomSheetContent({
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.ivory,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle 36x4px
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.inputBorder,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Title
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.night,
                ),
              ),
              const SizedBox(height: 12),
              // Items
              ...items.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: GestureDetector(
                      onTap: item.onTap,
                      child: Container(
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: item.bg,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                item.icon,
                                size: 18,
                                color: item.color,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              item.label,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: item.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )),
            ],
          ),
        ),
      ),
    );
  }
}
