import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class IncubationListScreen extends StatelessWidget {
  const IncubationListScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: 3,
          itemBuilder: (context, index) {
            final totalDays = 24;
            final currentDay = 7 + (index * 7);
            final daysRemaining = totalDays - currentDay;
            final eclosionDate = DateTime.now().add(
              Duration(days: daysRemaining),
            );
            final eggsCount = 350 - (index * 50);

            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space12),
              child: GGCard(
                onTap: () =>
                    context.push('/incubation/batch_$index/candling'),
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
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Lot Incubation #${index + 1}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Goliath - $eggsCount oeufs',
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
                        value: currentDay / totalDays,
                        backgroundColor: AppColors.grey200,
                        color: AppColors.primary,
                        minHeight: AppDimensions.progressBarHeight,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space8),

                    // Countdown + eclosion date
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '$daysRemaining jours restants',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.warning,
                          ),
                        ),
                        Text(
                          'Eclosion: ${eclosionDate.day.toString().padLeft(2, '0')}/${eclosionDate.month.toString().padLeft(2, '0')}',
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
      ),
    );
  }
}
