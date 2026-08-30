import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_empty_state.dart';

class DailyRecordHistoryScreen extends StatelessWidget {
  final String flockId;

  const DailyRecordHistoryScreen({super.key, required this.flockId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.dailyRecordHistory)),
      body: ListView.builder(
        padding: AppDimensions.screenPadding,
        itemCount: 15,
        itemBuilder: (context, index) {
          final date = DateTime.now().subtract(Duration(days: index));
          return Padding(
            padding: const EdgeInsets.only(bottom: AppDimensions.space8),
            child: GGCard(
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
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
                          style: const TextStyle(fontSize: 9, color: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${140 + index} oeufs - ${index % 3 == 0 ? 1 : 0} mort${index % 3 == 0 ? "" : "s"}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          '${35 + (index * 0.5).toInt()} kg aliment',
                          style: const TextStyle(fontSize: 13, color: AppColors.grey600),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: AppColors.grey400),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
