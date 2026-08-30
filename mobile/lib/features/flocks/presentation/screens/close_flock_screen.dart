import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class CloseFlockScreen extends StatelessWidget {
  final String flockId;

  const CloseFlockScreen({super.key, required this.flockId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text(AppStrings.closeFlock)),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Bilan du lot',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppDimensions.space16),
            GGCard(
              child: Column(
                children: [
                  _BilanRow('Effectif initial', '200'),
                  _BilanRow('Effectif final', '196'),
                  _BilanRow('Mortalite totale', '4 (2%)'),
                  _BilanRow('Duree', '126 jours'),
                  _BilanRow('Total oeufs', '12 600'),
                  _BilanRow('Taux de ponte moyen', '71.4%'),
                  _BilanRow('Total depenses', '1 250 000 FCFA'),
                  _BilanRow('Total revenus', '2 100 000 FCFA'),
                  _BilanRow('Marge nette', '850 000 FCFA'),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space24),
            const Text(
              'Cette action est irreversible. Le lot sera marque comme termine.',
              style: TextStyle(fontSize: 13, color: AppColors.grey600),
            ),
            const SizedBox(height: AppDimensions.space16),
            GGButton.danger(
              label: 'Cloturer le lot',
              onPressed: () async {
                final confirmed = await context.showConfirmDialog(
                  title: AppStrings.closeFlock,
                  message: AppStrings.closeFlockConfirm,
                  confirmLabel: 'Cloturer',
                  isDanger: true,
                );
                if (confirmed == true && context.mounted) {
                  context.showSuccessSnackBar('Lot cloture.');
                  context.pop();
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _BilanRow extends StatelessWidget {
  final String label;
  final String value;

  const _BilanRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppDimensions.space6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.grey600)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
