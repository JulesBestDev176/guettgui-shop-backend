import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateProtocolScreen extends StatefulWidget {
  const CreateProtocolScreen({super.key});
  @override
  State<CreateProtocolScreen> createState() => _CreateProtocolScreenState();
}

class _CreateProtocolScreenState extends State<CreateProtocolScreen> {
  final _nameController = TextEditingController();
  final _dayController = TextEditingController();
  String? _flockType;
  String? _adminMode;

  @override
  void dispose() { _nameController.dispose(); _dayController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text(AppStrings.addProtocol)),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(children: [
          GGTextField(label: AppStrings.vaccineName, controller: _nameController, prefixIcon: Icons.medical_services),
          const SizedBox(height: AppDimensions.space16),
          DropdownButtonFormField<String>(value: _flockType, decoration: const InputDecoration(labelText: AppStrings.flockType, prefixIcon: Icon(Icons.pets)),
            items: const [
              DropdownMenuItem(value: 'BREEDER', child: Text(AppStrings.breederType)),
              DropdownMenuItem(value: 'LAYER', child: Text(AppStrings.layerType)),
              DropdownMenuItem(value: 'BROILER', child: Text(AppStrings.broilerType)),
              DropdownMenuItem(value: 'QUAIL', child: Text(AppStrings.quailType)),
            ], onChanged: (v) => setState(() => _flockType = v)),
          const SizedBox(height: AppDimensions.space16),
          GGTextField(label: AppStrings.adminDay, hint: 'Ex: 7', controller: _dayController, keyboardType: TextInputType.number, prefixIcon: Icons.calendar_today),
          const SizedBox(height: AppDimensions.space16),
          DropdownButtonFormField<String>(value: _adminMode, decoration: const InputDecoration(labelText: AppStrings.adminMode, prefixIcon: Icon(Icons.water_drop)),
            items: const [
              DropdownMenuItem(value: 'EAU', child: Text('Eau de boisson')),
              DropdownMenuItem(value: 'INJECTION', child: Text('Injection')),
              DropdownMenuItem(value: 'SPRAY', child: Text('Spray')),
              DropdownMenuItem(value: 'COLLYRE', child: Text('Collyre')),
            ], onChanged: (v) => setState(() => _adminMode = v)),
          const SizedBox(height: AppDimensions.space32),
          GGButton(label: AppStrings.save, onPressed: () { context.showSuccessSnackBar('Protocole cree.'); context.pop(); }),
        ]),
      ),
    );
  }
}
