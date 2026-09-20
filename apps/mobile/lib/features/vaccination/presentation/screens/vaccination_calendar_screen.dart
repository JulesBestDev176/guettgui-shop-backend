import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/vaccination/presentation/providers/vaccination_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';
import 'package:intl/intl.dart';

class VaccinationCalendarScreen extends ConsumerWidget {
  const VaccinationCalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.vaccinationCalendar),
        actions: [
          TextButton(
            onPressed: () => context.push(AppRoutes.vaccinationProtocols),
            child: const Text(AppStrings.protocols),
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
          : _VaccinationList(teamId: teamId),
    );
  }
}

class _VaccinationList extends ConsumerWidget {
  final String teamId;

  const _VaccinationList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final vaccinationsAsync = ref.watch(vaccinationListProvider(teamId));

    return vaccinationsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les vaccinations',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(vaccinationListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (vaccinations) {
        if (vaccinations.isEmpty) {
          return Center(
            child: Text(
              'Aucune vaccination programmee',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(vaccinationListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: vaccinations.length,
            itemBuilder: (context, index) {
              final v = vaccinations[index];
              final isDone = v.isDone;
              final dateStr =
                  DateFormat('d MMM', 'fr_FR').format(v.scheduledDate);

              return Padding(
                padding:
                    const EdgeInsets.only(bottom: AppDimensions.space8),
                child: GGCard(
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: isDone
                              ? AppColors.successLight
                              : AppColors.warningLight,
                          borderRadius: BorderRadius.circular(
                            AppDimensions.radiusSm,
                          ),
                        ),
                        child: Icon(
                          isDone ? Icons.check : Icons.schedule,
                          color: isDone
                              ? AppColors.success
                              : AppColors.warning,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              v.vaccineName,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              '${v.flockName ?? 'Lot'} - $dateStr',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grey500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      GGChip(
                        label: isDone ? 'Fait' : 'A faire',
                        type: isDone
                            ? GGChipType.active
                            : GGChipType.pending,
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
