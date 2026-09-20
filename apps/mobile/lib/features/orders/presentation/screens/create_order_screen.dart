import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateOrderScreen extends StatefulWidget {
  const CreateOrderScreen({super.key});

  @override
  State<CreateOrderScreen> createState() => _CreateOrderScreenState();
}

class _CreateOrderScreenState extends State<CreateOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _qtyController = TextEditingController();
  String? _client;
  String? _product;
  DateTime _deliveryDate = DateTime.now().add(const Duration(days: 7));

  @override
  void dispose() {
    _qtyController.dispose();
    super.dispose();
  }

  bool get _isFormValid {
    return _client != null &&
        _product != null &&
        _qtyController.text.trim().isNotEmpty;
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _deliveryDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) setState(() => _deliveryDate = picked);
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    context.showSuccessSnackBar('Commande creee.');
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      appBar: AppBar(title: const Text(AppStrings.addOrder)),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Client
              DropdownButtonFormField<String>(
                value: _client,
                decoration: const InputDecoration(
                  labelText: AppStrings.client,
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (v) =>
                    v == null ? 'Selectionnez un client' : null,
                items: List.generate(
                  5,
                  (i) => DropdownMenuItem(
                    value: 'c_$i',
                    child: Text('Client ${i + 1}'),
                  ),
                ),
                onChanged: (v) => setState(() => _client = v),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Produit
              DropdownButtonFormField<String>(
                value: _product,
                decoration: const InputDecoration(
                  labelText: AppStrings.productType,
                  prefixIcon: Icon(Icons.category),
                ),
                validator: (v) =>
                    v == null ? 'Selectionnez un produit' : null,
                items: const [
                  DropdownMenuItem(
                    value: 'CHICKS',
                    child: Text('Poussins'),
                  ),
                  DropdownMenuItem(
                    value: 'EGGS',
                    child: Text('Oeufs'),
                  ),
                  DropdownMenuItem(
                    value: 'CHICKEN',
                    child: Text('Poulets'),
                  ),
                ],
                onChanged: (v) => setState(() => _product = v),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Quantite
              GGTextField(
                label: AppStrings.quantity,
                controller: _qtyController,
                keyboardType: TextInputType.number,
                prefixIcon: Icons.numbers,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Quantite requise';
                  if (int.tryParse(v.trim()) == null) {
                    return 'Quantite invalide';
                  }
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Date livraison
              GestureDetector(
                onTap: _selectDate,
                child: AbsorbPointer(
                  child: GGTextField(
                    label: AppStrings.deliveryDate,
                    controller: TextEditingController(
                      text:
                          '${_deliveryDate.day.toString().padLeft(2, '0')}/${_deliveryDate.month.toString().padLeft(2, '0')}/${_deliveryDate.year}',
                    ),
                    prefixIcon: Icons.calendar_today,
                  ),
                ),
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
