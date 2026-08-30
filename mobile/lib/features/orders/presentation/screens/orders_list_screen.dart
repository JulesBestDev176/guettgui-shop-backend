import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';

class OrdersListScreen extends StatelessWidget {
  const OrdersListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.orders)),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        onPressed: () => context.push(AppRoutes.createOrder),
        child: const Icon(Icons.add),
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: 6,
          itemBuilder: (context, index) {
            final statuses = [
              GGChipType.pending,
              GGChipType.active,
              GGChipType.completed,
              GGChipType.alert,
            ];
            final statusLabels = [
              'En attente',
              'Confirmee',
              'Livree',
              'Annulee',
            ];
            final statusColors = [
              AppColors.warningLight,
              AppColors.primaryLight,
              AppColors.successLight,
              AppColors.errorLight,
            ];
            final statusIconColors = [
              AppColors.warning,
              AppColors.primary,
              AppColors.success,
              AppColors.error,
            ];
            final statusIdx = index % 4;

            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space8),
              child: GGCard(
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: statusColors[statusIdx],
                        borderRadius: BorderRadius.circular(
                          AppDimensions.radiusSm,
                        ),
                      ),
                      child: Icon(
                        Icons.shopping_bag,
                        color: statusIconColors[statusIdx],
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.space12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Commande #${index + 100}',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            'Client ${index + 1} - ${(index + 1) * 20} poussins',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.grey500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    GGChip(
                      label: statusLabels[statusIdx],
                      type: statuses[statusIdx],
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
