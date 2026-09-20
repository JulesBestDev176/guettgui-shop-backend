import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/features/finances/presentation/providers/finance_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateSaleScreen extends ConsumerStatefulWidget {
  const CreateSaleScreen({super.key});

  @override
  ConsumerState<CreateSaleScreen> createState() => _CreateSaleScreenState();
}

class _CreateSaleScreenState extends ConsumerState<CreateSaleScreen> {
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

  bool _isSaving = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final teamIdAsync = ref.read(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;
    if (teamId == null) return;

    setState(() => _isSaving = true);

    try {
      final notifier =
          ref.read(financeNotifierProvider(teamId).notifier);
      await notifier.createSale({
        'productType': _productType,
        'quantity': int.parse(_qtyController.text.trim()),
        'unitPrice': int.parse(_priceController.text.trim()),
        'totalAmount': _total,
        'date': _date.toIso8601String(),
        'paymentMode': _paymentMode,
        if (_clientController.text.trim().isNotEmpty)
          'customerName': _clientController.text.trim(),
      });

      if (mounted) {
        context.showSuccessSnackBar('Vente enregistree.');
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        context.showSuccessSnackBar('Erreur: $e');
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
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
