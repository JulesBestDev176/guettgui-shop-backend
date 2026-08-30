import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateCustomerScreen extends StatefulWidget {
  const CreateCustomerScreen({super.key});

  @override
  State<CreateCustomerScreen> createState() => _CreateCustomerScreenState();
}

class _CreateCustomerScreenState extends State<CreateCustomerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();
  String? _type;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  bool get _isFormValid {
    return _firstNameController.text.trim().isNotEmpty &&
        _lastNameController.text.trim().isNotEmpty &&
        _phoneController.text.trim().isNotEmpty &&
        _type != null;
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    context.showSuccessSnackBar('Client ajoute.');
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      appBar: AppBar(title: const Text(AppStrings.addCustomer)),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GGTextField(
                label: AppStrings.firstName,
                hint: 'Ex: Amadou',
                controller: _firstNameController,
                prefixIcon: Icons.person,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Prenom requis';
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              GGTextField(
                label: AppStrings.lastName,
                hint: 'Ex: Diop',
                controller: _lastNameController,
                prefixIcon: Icons.person_outline,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Nom requis';
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              GGTextField(
                label: AppStrings.phone,
                hint: '+221 7X XXX XX XX',
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                prefixIcon: Icons.phone,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Telephone requis';
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              GGTextField(
                label: AppStrings.city,
                hint: 'Ex: Thies',
                controller: _cityController,
                prefixIcon: Icons.location_on,
              ),
              const SizedBox(height: AppDimensions.space16),

              DropdownButtonFormField<String>(
                value: _type,
                decoration: const InputDecoration(
                  labelText: AppStrings.customerType,
                  prefixIcon: Icon(Icons.category),
                ),
                validator: (v) => v == null ? 'Selectionnez un type' : null,
                items: const [
                  DropdownMenuItem(
                    value: 'PARTICULIER',
                    child: Text(AppStrings.typeParticulier),
                  ),
                  DropdownMenuItem(
                    value: 'REVENDEUR',
                    child: Text(AppStrings.typeRevendeur),
                  ),
                  DropdownMenuItem(
                    value: 'ELEVEUR',
                    child: Text(AppStrings.typeEleveur),
                  ),
                ],
                onChanged: (v) => setState(() => _type = v),
              ),
              const SizedBox(height: AppDimensions.space32),

              GGButton(
                label: AppStrings.save,
                onPressed: _isFormValid ? _submit : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
