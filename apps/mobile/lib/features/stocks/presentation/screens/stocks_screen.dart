import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/stocks/presentation/providers/stock_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';

class StocksScreen extends ConsumerWidget {
  const StocksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.stocks)),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _StocksList(teamId: teamId),
    );
  }
}

class _StocksList extends ConsumerWidget {
  final String teamId;

  const _StocksList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stocksAsync = ref.watch(stockListProvider(teamId));

    return stocksAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les stocks',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.invalidate(stockListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (stocks) {
        if (stocks.isEmpty) {
          return Center(
            child: Text(
              'Aucun stock enregistre',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(stockListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: stocks.length,
            itemBuilder: (context, index) {
              final stock = stocks[index];
              final percent = stock.fillPercentage;

              return Padding(
                padding: const EdgeInsets.only(bottom: AppDimensions.space8),
                child: GGCard(
                  onTap: () =>
                      context.push('/stocks/${stock.id}/history'),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              stock.itemName,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          if (stock.isLow)
                            const GGChip(
                              label: 'Faible',
                              type: GGChipType.alert,
                            ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.space8),
                      Text(
                        'Stock: ${stock.quantity.toStringAsFixed(stock.quantity == stock.quantity.roundToDouble() ? 0 : 1)} ${stock.unit}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (stock.minThreshold != null) ...[
                        const SizedBox(height: AppDimensions.space4),
                        Text(
                          'Seuil alerte: ${stock.minThreshold!.toStringAsFixed(stock.minThreshold! == stock.minThreshold!.roundToDouble() ? 0 : 1)} ${stock.unit}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.grey500,
                          ),
                        ),
                      ],
                      const SizedBox(height: AppDimensions.space8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(
                          AppDimensions.radiusFull,
                        ),
                        child: LinearProgressIndicator(
                          value: percent,
                          backgroundColor: AppColors.grey200,
                          color:
                              stock.isLow ? AppColors.error : AppColors.primary,
                          minHeight: 6,
                        ),
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
