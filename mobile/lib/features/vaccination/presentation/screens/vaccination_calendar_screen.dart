import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';

class VaccinationCalendarScreen extends StatelessWidget {
  const VaccinationCalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: 8,
          itemBuilder: (context, index) {
            final vaccines = [
              'Newcastle',
              'Gumboro',
              'Newcastle rappel',
              'Gumboro rappel',
            ];
            final lots = [
              'Pondeuses #3',
              'Goliath - Noyau 1',
              'Chair - Lot 12',
            ];
            final isDone = index < 3;

            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space8),
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
                        color: isDone ? AppColors.success : AppColors.warning,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.space12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            vaccines[index % vaccines.length],
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            'J${(index + 1) * 7} - ${lots[index % lots.length]}',
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
                      type: isDone ? GGChipType.active : GGChipType.pending,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
