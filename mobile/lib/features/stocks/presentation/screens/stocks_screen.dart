import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_chip.dart';

class StocksScreen extends StatelessWidget {
  const StocksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final stocks = [
      _StockItem('Aliment pondeuse', '120 kg', 120, 50, 'kg'),
      _StockItem('Aliment croissance', '35 kg', 35, 50, 'kg'),
      _StockItem('Mil', '80 kg', 80, 100, 'kg'),
      _StockItem('Oeufs disponibles', '450', 450, 500, 'oeufs'),
      _StockItem('Vaccins Newcastle', '200 doses', 200, 100, 'doses'),
      _StockItem('Tablettes vides', '8', 8, 20, 'unites'),
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.stocks)),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: stocks.length,
          itemBuilder: (context, index) {
            final stock = stocks[index];
            final percent = (stock.current / stock.alertThreshold).clamp(0.0, 1.0);
            final isLow = stock.current < stock.alertThreshold;

            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space8),
              child: GGCard(
                onTap: () => context.push('/stocks/stock_$index/history'),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            stock.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        if (isLow)
                          const GGChip(
                            label: 'Faible',
                            type: GGChipType.alert,
                          ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.space8),
                    Text(
                      'Stock: ${stock.quantity}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space4),
                    Text(
                      'Seuil alerte: ${stock.alertThreshold} ${stock.unit}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.grey500,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(
                        AppDimensions.radiusFull,
                      ),
                      child: LinearProgressIndicator(
                        value: percent,
                        backgroundColor: AppColors.grey200,
                        color: isLow ? AppColors.error : AppColors.primary,
                        minHeight: 6,
                      ),
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

class _StockItem {
  final String name;
  final String quantity;
  final int current;
  final int alertThreshold;
  final String unit;

  const _StockItem(
    this.name,
    this.quantity,
    this.current,
    this.alertThreshold,
    this.unit,
  );
}
