import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class HatchResultScreen extends StatefulWidget {
  final String batchId;
  const HatchResultScreen({super.key, required this.batchId});

  @override
  State<HatchResultScreen> createState() => _HatchResultScreenState();
}

class _HatchResultScreenState extends State<HatchResultScreen> {
  final _chicksController = TextEditingController();
  final _unhatchedController = TextEditingController();

  @override
  void dispose() {
    _chicksController.dispose();
    _unhatchedController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text(AppStrings.hatchResult)),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Resultat d\'eclosion', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
            const SizedBox(height: AppDimensions.space24),
            GGTextField(
              label: AppStrings.chicksHatched,
              controller: _chicksController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.check_circle,
            ),
            const SizedBox(height: AppDimensions.space16),
            GGTextField(
              label: AppStrings.unhatchedEggs,
              controller: _unhatchedController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.cancel,
            ),
            const SizedBox(height: AppDimensions.space32),
            GGButton(
              label: AppStrings.save,
              onPressed: () {
                context.showSuccessSnackBar('Eclosion enregistree.');
                context.pop();
              },
            ),
          ],
        ),
      ),
    );
  }
}
