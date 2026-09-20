import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/orders/domain/entities/order.dart';
import 'package:guettgui_mobile/features/orders/presentation/providers/order_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';

class OrdersListScreen extends ConsumerWidget {
  const OrdersListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.orders)),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        onPressed: () => context.push(AppRoutes.createOrder),
        child: const Icon(Icons.add),
      ),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _OrdersList(teamId: teamId),
    );
  }
}

class _OrdersList extends ConsumerWidget {
  final String teamId;

  const _OrdersList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(orderListProvider(teamId));

    return ordersAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les commandes',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(orderListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (orders) {
        if (orders.isEmpty) {
          return Center(
            child: Text(
              'Aucune commande enregistree',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(orderListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];
              final chipType = _chipType(order.status);
              final chipColor = _statusColor(order.status);
              final chipBg = _statusBg(order.status);

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
                          color: chipBg,
                          borderRadius: BorderRadius.circular(
                            AppDimensions.radiusSm,
                          ),
                        ),
                        child: Icon(
                          Icons.shopping_bag,
                          color: chipColor,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              order.customerName ??
                                  'Commande #${order.id.substring(0, 6)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              '${order.productType} - ${order.quantity} unites',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grey500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      GGChip(
                        label: order.statusLabel,
                        type: chipType,
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

  GGChipType _chipType(String status) => switch (status) {
        'PENDING' => GGChipType.pending,
        'CONFIRMED' => GGChipType.active,
        'DELIVERED' => GGChipType.completed,
        'CANCELLED' => GGChipType.alert,
        _ => GGChipType.pending,
      };

  Color _statusColor(String status) => switch (status) {
        'PENDING' => AppColors.warning,
        'CONFIRMED' => AppColors.primary,
        'DELIVERED' => AppColors.success,
        'CANCELLED' => AppColors.error,
        _ => AppColors.warning,
      };

  Color _statusBg(String status) => switch (status) {
        'PENDING' => AppColors.warningLight,
        'CONFIRMED' => AppColors.primaryLight,
        'DELIVERED' => AppColors.successLight,
        'CANCELLED' => AppColors.errorLight,
        _ => AppColors.warningLight,
      };
}
