import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/incubation/presentation/providers/incubation_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class IncubationListScreen extends ConsumerWidget {
  const IncubationListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.incubation),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push(AppRoutes.createBatch),
          ),
        ],
      ),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _IncubationList(teamId: teamId),
    );
  }
}

class _IncubationList extends ConsumerWidget {
  final String teamId;

  const _IncubationList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final batchesAsync = ref.watch(incubationBatchListProvider(teamId));

    return batchesAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les lots d\'incubation',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(incubationBatchListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (batches) {
        if (batches.isEmpty) {
          return Center(
            child: Text(
              'Aucun lot d\'incubation',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(incubationBatchListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: batches.length,
            itemBuilder: (context, index) {
              final batch = batches[index];
              final totalDays = batch.expectedHatchDate
                  .difference(batch.loadDate)
                  .inDays;
              final currentDay = batch.daysSinceLoad;
              final daysRemaining =
                  batch.expectedHatchDate.difference(DateTime.now()).inDays;
              final progress =
                  totalDays > 0 ? (currentDay / totalDays).clamp(0.0, 1.0) : 0.0;

              return Padding(
                padding:
                    const EdgeInsets.only(bottom: AppDimensions.space12),
                child: GGCard(
                  onTap: () =>
                      context.push('/incubation/${batch.id}/candling'),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: AppColors.warningLight,
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusSm,
                              ),
                            ),
                            child: const Icon(
                              Icons.egg_alt,
                              color: AppColors.warning,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: AppDimensions.space12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Text(
                                  batch.incubatorName ??
                                      'Lot #${batch.id.substring(0, 6)}',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  '${batch.eggsLoaded} oeufs',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: AppColors.grey600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.warningLight,
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusFull,
                              ),
                            ),
                            child: Text(
                              'J$currentDay/$totalDays',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.warning,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.space12),

                      // Progress bar
                      ClipRRect(
                        borderRadius: BorderRadius.circular(
                          AppDimensions.radiusFull,
                        ),
                        child: LinearProgressIndicator(
                          value: progress,
                          backgroundColor: AppColors.grey200,
                          color: AppColors.primary,
                          minHeight: AppDimensions.progressBarHeight,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space8),

                      // Countdown + eclosion date
                      Row(
                        mainAxisAlignment:
                            MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            daysRemaining > 0
                                ? '$daysRemaining jours restants'
                                : 'Eclosion imminente',
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.warning,
                            ),
                          ),
                          Text(
                            'Eclosion: ${batch.expectedHatchDate.day.toString().padLeft(2, '0')}/${batch.expectedHatchDate.month.toString().padLeft(2, '0')}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.grey500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
