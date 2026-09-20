import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/stocks/presentation/providers/stock_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:intl/intl.dart';

class StockHistoryScreen extends ConsumerWidget {
  final String stockId;
  const StockHistoryScreen({super.key, required this.stockId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.stockHistory)),
      body: teamId == null
          ? const Center(child: CircularProgressIndicator())
          : _StockMovesList(teamId: teamId, stockId: stockId),
    );
  }
}

class _StockMovesList extends ConsumerWidget {
  final String teamId;
  final String stockId;

  const _StockMovesList({required this.teamId, required this.stockId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final movesAsync = ref.watch(
      stockMovesProvider((teamId: teamId, stockId: stockId)),
    );

    return movesAsync.when(
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
                stockMovesProvider((teamId: teamId, stockId: stockId)),
              ),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (moves) {
        if (moves.isEmpty) {
          return Center(
            child: Text(
              'Aucun mouvement enregistre',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return ListView.builder(
          padding: AppDimensions.screenPadding,
          itemCount: moves.length,
          itemBuilder: (context, index) {
            final move = moves[index];
            final isEntry = move.isEntry;
            final dateStr =
                DateFormat('d MMM yyyy', 'fr_FR').format(move.date);
            final qtyStr = move.quantity ==
                    move.quantity.roundToDouble()
                ? move.quantity.toStringAsFixed(0)
                : move.quantity.toStringAsFixed(1);

            return Padding(
              padding:
                  const EdgeInsets.only(bottom: AppDimensions.space8),
              child: GGCard(
                child: Row(
                  children: [
                    Icon(
                      isEntry
                          ? Icons.arrow_downward
                          : Icons.arrow_upward,
                      color: isEntry
                          ? AppColors.success
                          : AppColors.error,
                      size: 20,
                    ),
                    const SizedBox(width: AppDimensions.space12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            move.reason ??
                                (isEntry ? 'Entree' : 'Sortie'),
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            dateStr,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.grey500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${isEntry ? "+" : "-"}$qtyStr',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: isEntry
                            ? AppColors.success
                            : AppColors.error,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
