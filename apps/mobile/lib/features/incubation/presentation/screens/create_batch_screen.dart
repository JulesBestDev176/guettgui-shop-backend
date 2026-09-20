import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateBatchScreen extends StatefulWidget {
  const CreateBatchScreen({super.key});

  @override
  State<CreateBatchScreen> createState() => _CreateBatchScreenState();
}

class _CreateBatchScreenState extends State<CreateBatchScreen> {
  final _formKey = GlobalKey<FormState>();
  final _eggsController = TextEditingController();
  DateTime _loadDate = DateTime.now();

  @override
  void dispose() {
    _eggsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text(AppStrings.createBatch)),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GGTextField(
                label: AppStrings.eggsLoaded,
                hint: 'Ex: 350',
                controller: _eggsController,
                keyboardType: TextInputType.number,
                prefixIcon: Icons.egg,
              ),
              const SizedBox(height: AppDimensions.space16),
              GGTextField(
                label: AppStrings.loadDate,
                controller: TextEditingController(
                  text: '${_loadDate.day}/${_loadDate.month}/${_loadDate.year}',
                ),
                prefixIcon: Icons.calendar_today,
                enabled: false,
              ),
              const SizedBox(height: AppDimensions.space24),
              const Text('Dates calculees:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: AppDimensions.space12),
              _DateInfo('Mirage J7', DateTime.now().add(const Duration(days: 7))),
              _DateInfo('Mirage J14', DateTime.now().add(const Duration(days: 14))),
              _DateInfo('Eclosion J24', DateTime.now().add(const Duration(days: 24))),
              const SizedBox(height: AppDimensions.space32),
              GGButton(
                label: AppStrings.save,
                onPressed: () {
                  context.showSuccessSnackBar('Lot couveuse cree.');
                  context.pop();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DateInfo extends StatelessWidget {
  final String label;
  final DateTime date;

  const _DateInfo(this.label, this.date);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDimensions.space8),
      child: Row(
        children: [
          const Icon(Icons.event, size: 16, color: AppColors.grey500),
          const SizedBox(width: AppDimensions.space8),
          Text(label, style: const TextStyle(color: AppColors.grey600)),
          const Spacer(),
          Text('${date.day}/${date.month}/${date.year}', style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
