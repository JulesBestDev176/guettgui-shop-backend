import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CandlingScreen extends StatefulWidget {
  final String batchId;
  const CandlingScreen({super.key, required this.batchId});

  @override
  State<CandlingScreen> createState() => _CandlingScreenState();
}

class _CandlingScreenState extends State<CandlingScreen> {
  final _fertileController = TextEditingController();
  final _clearController = TextEditingController();
  final _deadController = TextEditingController();

  @override
  void dispose() {
    _fertileController.dispose();
    _clearController.dispose();
    _deadController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text(AppStrings.candling)),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Mirage J7', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
            const SizedBox(height: AppDimensions.space8),
            const Text('Lot Incubation #1 - 350 oeufs charges', style: TextStyle(color: AppColors.grey600)),
            const SizedBox(height: AppDimensions.space24),
            GGTextField(
              label: AppStrings.fertileEggs,
              controller: _fertileController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.check_circle_outline,
            ),
            const SizedBox(height: AppDimensions.space16),
            GGTextField(
              label: AppStrings.clearEggs,
              controller: _clearController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.cancel_outlined,
            ),
            const SizedBox(height: AppDimensions.space16),
            GGTextField(
              label: AppStrings.deadEmbryos,
              controller: _deadController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.warning_amber,
            ),
            const SizedBox(height: AppDimensions.space32),
            GGButton(
              label: AppStrings.save,
              onPressed: () {
                context.showSuccessSnackBar('Mirage enregistre.');
                context.pop();
              },
            ),
          ],
        ),
      ),
    );
  }
}
