import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateSaleScreen extends StatefulWidget {
  const CreateSaleScreen({super.key});

  @override
  State<CreateSaleScreen> createState() => _CreateSaleScreenState();
}

class _CreateSaleScreenState extends State<CreateSaleScreen> {
  final _formKey = GlobalKey<FormState>();
  final _qtyController = TextEditingController();
  final _priceController = TextEditingController();
  final _clientController = TextEditingController();
  String? _productType;
  String? _paymentMode;
  DateTime _date = DateTime.now();

  @override
  void dispose() {
    _qtyController.dispose();
    _priceController.dispose();
    _clientController.dispose();
    super.dispose();
  }

  int get _total {
    final qty = int.tryParse(_qtyController.text.trim()) ?? 0;
    final price = int.tryParse(_priceController.text.trim()) ?? 0;
    return qty * price;
  }

  bool get _isFormValid {
    return _productType != null &&
        _qtyController.text.trim().isNotEmpty &&
        _priceController.text.trim().isNotEmpty &&
        _paymentMode != null;
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(2024),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _date = picked);
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    context.showSuccessSnackBar('Vente enregistree.');
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      appBar: AppBar(title: const Text(AppStrings.addSale)),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Date
              GestureDetector(
                onTap: _selectDate,
                child: AbsorbPointer(
                  child: GGTextField(
                    label: AppStrings.date,
                    controller: TextEditingController(
                      text:
                          '${_date.day.toString().padLeft(2, '0')}/${_date.month.toString().padLeft(2, '0')}/${_date.year}',
                    ),
                    prefixIcon: Icons.calendar_today,
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Type produit
              DropdownButtonFormField<String>(
                value: _productType,
                decoration: const InputDecoration(
                  labelText: AppStrings.productType,
                  prefixIcon: Icon(Icons.category),
                ),
                validator: (v) =>
                    v == null ? 'Selectionnez un type de produit' : null,
                items: const [
                  DropdownMenuItem(
                    value: 'CHICKS',
                    child: Text('Poussins'),
                  ),
                  DropdownMenuItem(
                    value: 'FERTILE_EGGS',
                    child: Text('Oeufs fecondes'),
                  ),
                  DropdownMenuItem(
                    value: 'TABLE_EGGS',
                    child: Text('Oeufs consommation'),
                  ),
                  DropdownMenuItem(
                    value: 'LIVE_CHICKEN',
                    child: Text('Poulets vivants'),
                  ),
                  DropdownMenuItem(
                    value: 'DRESSED_CHICKEN',
                    child: Text('Poulets abattus'),
                  ),
                ],
                onChanged: (v) => setState(() => _productType = v),
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

              // Prix unitaire
              GGTextField(
                label: AppStrings.unitPrice,
                hint: 'FCFA',
                controller: _priceController,
                keyboardType: TextInputType.number,
                prefixIcon: Icons.payments,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Prix requis';
                  if (int.tryParse(v.trim()) == null) return 'Prix invalide';
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space12),

              // Auto-calcul total
              if (_total > 0)
                GGCard(
                  backgroundColor: AppColors.primaryLight,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        AppStrings.totalAmount,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.grey700,
                        ),
                      ),
                      Text(
                        Formatters.xof(_total),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: AppDimensions.space16),

              // Client (optionnel)
              GGTextField(
                label: '${AppStrings.client} (optionnel)',
                hint: 'Nom du client',
                controller: _clientController,
                prefixIcon: Icons.person,
              ),
              const SizedBox(height: AppDimensions.space16),

              // Mode de paiement
              DropdownButtonFormField<String>(
                value: _paymentMode,
                decoration: const InputDecoration(
                  labelText: AppStrings.paymentMode,
                  prefixIcon: Icon(Icons.payment),
                ),
                validator: (v) =>
                    v == null ? 'Selectionnez un mode de paiement' : null,
                items: const [
                  DropdownMenuItem(
                    value: 'ESPECES',
                    child: Text(AppStrings.especes),
                  ),
                  DropdownMenuItem(
                    value: 'WAVE',
                    child: Text(AppStrings.wave),
                  ),
                  DropdownMenuItem(
                    value: 'ORANGE_MONEY',
                    child: Text(AppStrings.orangeMoney),
                  ),
                  DropdownMenuItem(
                    value: 'FREE_MONEY',
                    child: Text(AppStrings.freeMoney),
                  ),
                  DropdownMenuItem(
                    value: 'AUTRE',
                    child: Text(AppStrings.paymentAutre),
                  ),
                ],
                onChanged: (v) => setState(() => _paymentMode = v),
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
