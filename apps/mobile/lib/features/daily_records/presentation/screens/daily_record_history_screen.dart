import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/daily_records/presentation/providers/daily_record_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class DailyRecordHistoryScreen extends ConsumerWidget {
  final String flockId;

  const DailyRecordHistoryScreen({super.key, required this.flockId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.dailyRecordHistory)),
      body: teamId == null
          ? const Center(child: CircularProgressIndicator())
          : _RecordsList(teamId: teamId, flockId: flockId),
    );
  }
}

class _RecordsList extends ConsumerWidget {
  final String teamId;
  final String flockId;

  const _RecordsList({required this.teamId, required this.flockId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final recordsAsync = ref.watch(
      flockDailyRecordsProvider((teamId: teamId, flockId: flockId)),
    );

    return recordsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger l\'historique',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.invalidate(
                flockDailyRecordsProvider(
                  (teamId: teamId, flockId: flockId),
                ),
              ),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (records) {
        if (records.isEmpty) {
          return Center(
            child: Text(
              'Aucune saisie enregistree',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(
              flockDailyRecordsProvider(
                (teamId: teamId, flockId: flockId),
              ),
            );
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: records.length,
            itemBuilder: (context, index) {
              final record = records[index];
              final date = record.date;

              return Padding(
                padding:
                    const EdgeInsets.only(bottom: AppDimensions.space8),
                child: GGCard(
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(
                            AppDimensions.radiusSm,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '${date.day}',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                            Text(
                              '${date.month}/${date.year.toString().substring(2)}',
                              style: const TextStyle(
                                fontSize: 9,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${record.eggsCollected ?? 0} oeufs - ${record.mortalityCount} mort${record.mortalityCount <= 1 ? "" : "s"}',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              '${record.feedConsumedKg ?? 0} kg aliment',
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.grey600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right,
                          color: AppColors.grey400),
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
