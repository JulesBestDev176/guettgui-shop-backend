import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_amount_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_app_bar.dart';
import 'package:guettgui_mobile/shared/widgets/gg_member_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_stat_card.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).user;

    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // App bar 48px
            GGAppBar(
              role: user?.isOwner == true ? 'Proprietaire' : 'Membre',
              alertCount: 3,
              notificationCount: 5,
              onAlertTap: () => context.push(AppRoutes.notifications),
              onNotificationTap: () => context.push(AppRoutes.notifications),
              onProfileTap: () => context.go(AppRoutes.profile),
            ),

            // Body: ListView padding 16 16 16 110
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
                children: [
                  // Date 11px alpha0.45
                  Text(
                    '30 aout 2026',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textMeta,
                    ),
                  ),
                  const SizedBox(height: 4),
                  // Greeting 24px w600
                  Text(
                    'Bonjour, ${user?.displayName ?? 'Amadou'}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: AppColors.night,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // MemberCard COMPACT
                  GGMemberCard(
                    farmName: user?.teamName ?? 'FERME NDIAYE BI',
                    userName: user?.fullName ?? 'Amadou Diallo',
                    role: user?.isOwner == true
                        ? 'Proprietaire'
                        : 'Membre',
                  ),
                  const SizedBox(height: 16),

                  // 2 KPI glass cards in Row, gap 12px, 100px height
                  Row(
                    children: [
                      Expanded(
                        child: GGStatCard(
                          label: 'Ponte du jour',
                          value: '142',
                          icon: Icons.egg_outlined,
                          iconBackgroundColor:
                              AppColors.warning.withValues(alpha: 0.10),
                          iconColor: AppColors.warning,
                          suffix: 'oeufs',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GGStatCard(
                          label: 'Effectif total',
                          value: '520',
                          icon: Icons.pets_outlined,
                          iconBackgroundColor:
                              AppColors.primary.withValues(alpha: 0.10),
                          iconColor: AppColors.primary,
                          suffix: 'sujets',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Amount card full width
                  GGAmountCard(
                    label: 'Total revenus (2026)',
                    amountText: '2 450 000',
                    icon: Icons.payments_outlined,
                    trendText: '+12%',
                  ),
                  const SizedBox(height: 24),

                  // Section header "Lots actifs" + "Voir tout"
                  Row(
                    children: [
                      const Text(
                        'Lots actifs',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.night,
                        ),
                      ),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => context.go(AppRoutes.flocks),
                        child: const Text(
                          'Voir tout',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Horizontal scroll flock mini cards 160x100, gap 12
                  SizedBox(
                    height: 100,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      clipBehavior: Clip.none,
                      itemCount: _mockFlocks.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final f = _mockFlocks[index];
                        return _FlockMiniCard(
                          name: f.name,
                          sub: f.sub,
                          key_: f.key_,
                          keyColor: f.keyColor,
                          dotColor: f.dotColor,
                          onTap: () => context.push('/flocks/${index + 1}'),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Section header "Raccourcis"
                  const Text(
                    'Raccourcis',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.night,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Grid 3 columns: Incubation / Vaccins / Stocks
                  Row(
                    children: [
                      Expanded(
                        child: _ShortcutCard(
                          icon: Icons.device_thermostat_outlined,
                          label: 'Incubation',
                          iconColor: AppColors.primary,
                          onTap: () => context.push(AppRoutes.incubation),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ShortcutCard(
                          icon: Icons.vaccines_outlined,
                          label: 'Vaccins',
                          iconColor: AppColors.night,
                          onTap: () => context.push(AppRoutes.vaccination),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _ShortcutCard(
                          icon: Icons.inventory_2_outlined,
                          label: 'Stocks',
                          iconColor: AppColors.night,
                          onTap: () => context.push(AppRoutes.stocksRoute),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Mock flock data for dashboard
class _MockFlock {
  final String name;
  final String sub;
  final String key_;
  final Color keyColor;
  final Color dotColor;

  const _MockFlock({
    required this.name,
    required this.sub,
    required this.key_,
    required this.keyColor,
    required this.dotColor,
  });
}

const _mockFlocks = [
  _MockFlock(
    name: 'Pondeuses A1',
    sub: '200 sujets',
    key_: '142 oeufs/j',
    keyColor: AppColors.primary,
    dotColor: AppColors.warning,
  ),
  _MockFlock(
    name: 'Chair B2',
    sub: '180 sujets',
    key_: 'J-15',
    keyColor: AppColors.warning,
    dotColor: AppColors.info,
  ),
  _MockFlock(
    name: 'Repro C1',
    sub: '90 sujets',
    key_: '68 oeufs/j',
    keyColor: AppColors.primary,
    dotColor: AppColors.primary,
  ),
];

/// Flock mini card: 160x100px, radius 16px, glass style
class _FlockMiniCard extends StatelessWidget {
  final String name;
  final String sub;
  final String key_;
  final Color keyColor;
  final Color dotColor;
  final VoidCallback? onTap;

  const _FlockMiniCard({
    required this.name,
    required this.sub,
    required this.key_,
    required this.keyColor,
    required this.dotColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        height: 100,
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
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: dotColor,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    name,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.night,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              sub,
              style: TextStyle(fontSize: 11, color: AppColors.textMeta),
            ),
            const Spacer(),
            Text(
              key_,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: keyColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Shortcut glass card: 80px height, radius 16px
class _ShortcutCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color iconColor;
  final VoidCallback? onTap;

  const _ShortcutCard({
    required this.icon,
    required this.label,
    required this.iconColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80,
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
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 22, color: iconColor),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: AppColors.night.withValues(alpha: 0.75),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
