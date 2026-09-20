import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/features/auth/presentation/providers/auth_provider.dart';

/// Profile: avatar initiales + nom + menu items
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).user;
    final initials = _getInitials(user?.fullName ?? 'AD');

    final menuItems = [
      _MenuItem(Icons.group_outlined, 'Equipe', () => context.push(AppRoutes.teamRoute)),
      _MenuItem(Icons.assessment_outlined, 'Rapports', () => context.push(AppRoutes.reports)),
      _MenuItem(Icons.inventory_2_outlined, 'Stocks', () => context.push(AppRoutes.stocksRoute)),
      _MenuItem(Icons.people_outlined, 'Clients', () => context.push(AppRoutes.customersRoute)),
      _MenuItem(Icons.shopping_bag_outlined, 'Commandes', () => context.push(AppRoutes.ordersRoute)),
      _MenuItem(Icons.vaccines_outlined, 'Calendrier vaccinal', () => context.push(AppRoutes.vaccination)),
      _MenuItem(Icons.device_thermostat_outlined, 'Incubation', () => context.push(AppRoutes.incubation)),
      _MenuItem(Icons.settings_outlined, 'Parametres', () => context.push(AppRoutes.settingsRoute)),
    ];

    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px
            const SizedBox(
              height: 48,
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Profil',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.night,
                    ),
                  ),
                ),
              ),
            ),

            // Body
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
                child: Column(
                  children: [
                    // Profile card: avatar + name + phone
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        children: [
                          // Avatar 48dp circle primary alpha0.10 + initials
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.10),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                initials,
                                style: const TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  user?.fullName ?? '',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.night,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  user?.phone ?? '',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textMeta,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Menu items: glass style, 56px height
                    ...menuItems.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: GestureDetector(
                            onTap: item.onTap,
                            child: Container(
                              height: 56,
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: AppColors.glassBackground,
                                borderRadius: BorderRadius.circular(16),
                                border:
                                    Border.all(color: AppColors.glassBorder),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.glassShadow,
                                    blurRadius: 16,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  // Circle 32px primary alpha0.08 + icon 18px primary
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color: AppColors.primary
                                          .withValues(alpha: 0.08),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      item.icon,
                                      size: 18,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      item.label,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.night,
                                      ),
                                    ),
                                  ),
                                  Icon(
                                    Icons.chevron_right,
                                    size: 20,
                                    color: AppColors.night
                                        .withValues(alpha: 0.25),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        )),

                    const SizedBox(height: 16),

                    // Deconnexion button: red border, red icon+text
                    GestureDetector(
                      onTap: () {
                        // Show logout bottom sheet
                        _showLogoutSheet(context, ref);
                      },
                      child: Container(
                        height: 56,
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: AppColors.error.withValues(alpha: 0.18),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color:
                                    AppColors.error.withValues(alpha: 0.08),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.logout,
                                size: 18,
                                color: AppColors.error,
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Text(
                                'Deconnexion',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.error,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLogoutSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: AppColors.night.withValues(alpha: 0.35),
      builder: (ctx) => Container(
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
                const Text(
                  'Deconnexion',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.night,
                  ),
                ),
                const SizedBox(height: 12),
                // Confirm logout
                GestureDetector(
                  onTap: () {
                    Navigator.pop(ctx);
                    ref.read(authStateProvider.notifier).logout();
                    context.go(AppRoutes.onboarding);
                  },
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
                            color: AppColors.error.withValues(alpha: 0.10),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.logout,
                              size: 18, color: AppColors.error),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Confirmer la deconnexion',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.error,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                // Cancel
                GestureDetector(
                  onTap: () => Navigator.pop(ctx),
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
                            color: AppColors.night.withValues(alpha: 0.08),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close,
                              size: 18, color: AppColors.night),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Annuler',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.night,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return 'U';
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MenuItem(this.icon, this.label, this.onTap);
}
