import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/customers/presentation/providers/customer_provider.dart';
import 'package:guettgui_mobile/features/orders/presentation/providers/order_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateOrderScreen extends ConsumerStatefulWidget {
  const CreateOrderScreen({super.key});

  @override
  ConsumerState<CreateOrderScreen> createState() =>
      _CreateOrderScreenState();
}

class _CreateOrderScreenState extends ConsumerState<CreateOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _qtyController = TextEditingController();
  String? _client;
  String? _product;
  DateTime _deliveryDate = DateTime.now().add(const Duration(days: 7));
  bool _isSaving = false;

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

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final teamIdAsync = ref.read(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;
    if (teamId == null) return;

    setState(() => _isSaving = true);

    try {
      final notifier =
          ref.read(orderNotifierProvider(teamId).notifier);
      await notifier.createOrder({
        'customerId': _client,
        'productType': _product,
        'quantity': int.parse(_qtyController.text.trim()),
        'deliveryDate': _deliveryDate.toIso8601String(),
      });

      if (mounted) {
        context.showSuccessSnackBar('Commande creee.');
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
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    final customersAsync = teamId != null
        ? ref.watch(customerListProvider(teamId))
        : null;
    final customers = customersAsync?.valueOrNull ?? [];

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
                items: customers
                    .map((c) => DropdownMenuItem(
                          value: c.id,
                          child: Text(c.fullName),
                        ))
                    .toList(),
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
                  if (v == null || v.trim().isEmpty) {
                    return 'Quantite requise';
                  }
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
                onPressed: _isFormValid && !_isSaving ? _submit : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
