import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class StockHistoryScreen extends StatelessWidget {
  final String stockId;
  const StockHistoryScreen({super.key, required this.stockId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.stockHistory)),
      body: ListView.builder(
        padding: AppDimensions.screenPadding,
        itemCount: 15,
        itemBuilder: (context, index) {
          final isEntry = index % 3 != 0;
          return Padding(
            padding: const EdgeInsets.only(bottom: AppDimensions.space8),
            child: GGCard(child: Row(children: [
              Icon(isEntry ? Icons.arrow_downward : Icons.arrow_upward, color: isEntry ? AppColors.success : AppColors.error, size: 20),
              const SizedBox(width: AppDimensions.space12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(isEntry ? 'Entree (achat)' : 'Sortie (consommation)', style: const TextStyle(fontWeight: FontWeight.w600)),
                Text('Il y a ${index + 1} jours', style: const TextStyle(fontSize: 12, color: AppColors.grey500)),
              ])),
              Text('${isEntry ? "+" : "-"}${(index + 1) * 10} kg', style: TextStyle(fontWeight: FontWeight.w700, color: isEntry ? AppColors.success : AppColors.error)),
            ])),
          );
        },
      ),
    );
  }
}
