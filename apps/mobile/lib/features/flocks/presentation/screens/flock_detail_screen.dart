import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/daily_records/presentation/providers/daily_record_provider.dart';
import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';
import 'package:guettgui_mobile/features/flocks/presentation/providers/flock_provider.dart';

/// Flock detail: card resume 2x2 stats + actions grid 3x1 + derniere saisie
class FlockDetailScreen extends ConsumerWidget {
  final String flockId;

  const FlockDetailScreen({super.key, required this.flockId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    if (teamId == null) {
      return Scaffold(
        backgroundColor: AppColors.ivory,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final flockAsync = ref.watch(
      flockDetailProvider((teamId: teamId, flockId: flockId)),
    );
    final recordsAsync = ref.watch(
      flockDailyRecordsProvider((teamId: teamId, flockId: flockId)),
    );

    return flockAsync.when(
      loading: () => Scaffold(
        backgroundColor: AppColors.ivory,
        body: const Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => Scaffold(
        backgroundColor: AppColors.ivory,
        body: SafeArea(
          child: Column(
            children: [
              _buildAppBar(context, 'Lot'),
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Impossible de charger le lot',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textMeta,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () => ref.invalidate(
                          flockDetailProvider(
                            (teamId: teamId, flockId: flockId),
                          ),
                        ),
                        child: const Text('Reessayer'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      data: (flock) {
        final lastRecord = recordsAsync.valueOrNull?.isNotEmpty == true
            ? recordsAsync.valueOrNull!.first
            : null;

        return Scaffold(
          backgroundColor: AppColors.ivory,
          body: SafeArea(
            child: Column(
              children: [
                _buildAppBar(context, flock.name),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Stats card
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.cardBorder),
                          ),
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 28,
                                    height: 28,
                                    decoration: BoxDecoration(
                                      color: AppColors.primary
                                          .withValues(alpha: 0.10),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.egg_outlined,
                                      size: 16,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    '${flock.currentTotal} sujets \u00b7 ${flock.typeLabel}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.night,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 14),
                              Row(
                                children: [
                                  Expanded(
                                    child: _StatItem(
                                      label: 'Effectif',
                                      value: '${flock.currentTotal}',
                                      color: AppColors.night,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _StatItem(
                                      label: 'Mortalite',
                                      value:
                                          '${flock.mortalityRate.toStringAsFixed(1)} %',
                                      color: AppColors.error,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: _StatItem(
                                      label: 'Age',
                                      value: '${flock.ageInWeeks} sem.',
                                      color: AppColors.night,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _StatItem(
                                      label: 'Initial',
                                      value: '${flock.initialTotal}',
                                      color: AppColors.night,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Actions header
                        const Text(
                          'Actions',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.night,
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Actions grid 3x1
                        Row(
                          children: [
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.edit_note_outlined,
                                label: 'Saisie du jour',
                                iconColor: AppColors.primary,
                                onTap: () =>
                                    context.push('/daily-record/$flockId'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.assessment_outlined,
                                label: 'Historique',
                                iconColor: AppColors.night,
                                onTap: () => context
                                    .push('/daily-record-history/$flockId'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.device_thermostat_outlined,
                                label: 'Incubation',
                                iconColor: AppColors.night,
                                onTap: () =>
                                    context.push(AppRoutes.incubation),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Derniere saisie
                        const Text(
                          'Derniere saisie',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.night,
                          ),
                        ),
                        const SizedBox(height: 12),
                        if (lastRecord != null)
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.white,
                              borderRadius: BorderRadius.circular(16),
                              border:
                                  Border.all(color: AppColors.cardBorder),
                            ),
                            child: Column(
                              children: [
                                _LastRecordRow(
                                  label: 'Oeufs collectes',
                                  value: '${lastRecord.eggsCollected ?? 0}',
                                ),
                                const SizedBox(height: 8),
                                _LastRecordRow(
                                  label: 'Mortalite',
                                  value: '${lastRecord.mortalityCount}',
                                ),
                                const SizedBox(height: 8),
                                _LastRecordRow(
                                  label: 'Aliment',
                                  value: '${lastRecord.feedConsumedKg ?? 0} kg',
                                ),
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    'Enregistre le ${_formatDate(lastRecord.date)}',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppColors.textMeta,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )
                        else
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.white,
                              borderRadius: BorderRadius.circular(16),
                              border:
                                  Border.all(color: AppColors.cardBorder),
                            ),
                            child: Center(
                              child: Text(
                                'Aucune saisie enregistree',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: AppColors.textMeta,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAppBar(BuildContext context, String title) {
    return SizedBox(
      height: 48,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            GestureDetector(
              onTap: () => context.pop(),
              child: const Icon(
                Icons.arrow_back,
                size: 22,
                color: AppColors.night,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.night,
              ),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () {},
              child: const Icon(
                Icons.more_vert,
                size: 22,
                color: AppColors.night,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final d = date.day.toString().padLeft(2, '0');
    final m = date.month.toString().padLeft(2, '0');
    return '$d/$m/${date.year}';
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 11, color: AppColors.textMeta),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: color,
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
      ],
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color iconColor;
  final VoidCallback? onTap;

  const _ActionCard({
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
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
    );
  }
}

class _LastRecordRow extends StatelessWidget {
  final String label;
  final String value;

  const _LastRecordRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.night,
          ),
        ),
      ],
    );
  }
}
