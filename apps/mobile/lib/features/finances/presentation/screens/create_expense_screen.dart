import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/finances/presentation/providers/finance_provider.dart';
import 'package:guettgui_mobile/features/flocks/presentation/providers/flock_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateExpenseScreen extends ConsumerStatefulWidget {
  const CreateExpenseScreen({super.key});

  @override
  ConsumerState<CreateExpenseScreen> createState() =>
      _CreateExpenseScreenState();
}

class _CreateExpenseScreenState extends ConsumerState<CreateExpenseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descController = TextEditingController();
  String? _category;
  String? _flock;
  DateTime _date = DateTime.now();
  bool _isSaving = false;

  @override
  void dispose() {
    _amountController.dispose();
    _descController.dispose();
    super.dispose();
  }

  bool get _isFormValid {
    return _category != null &&
        _amountController.text.trim().isNotEmpty &&
        _descController.text.trim().isNotEmpty;
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

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final teamIdAsync = ref.read(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;
    if (teamId == null) return;

    setState(() => _isSaving = true);

    try {
      final notifier =
          ref.read(financeNotifierProvider(teamId).notifier);
      await notifier.createExpense({
        'category': _category,
        'amount': int.parse(_amountController.text.trim()),
        'description': _descController.text.trim(),
        'date': _date.toIso8601String(),
        if (_flock != null) 'flockId': _flock,
      });

      if (mounted) {
        context.showSuccessSnackBar('Depense enregistree.');
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

    final flocksAsync =
        teamId != null ? ref.watch(flockListProvider(teamId)) : null;
    final flocks = flocksAsync?.valueOrNull ?? [];

    return Scaffold(
      backgroundColor: AppColors.ivory,
      appBar: AppBar(title: const Text(AppStrings.addExpense)),
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

              // Category
              DropdownButtonFormField<String>(
                value: _category,
                decoration: const InputDecoration(
                  labelText: AppStrings.category,
                  prefixIcon: Icon(Icons.category),
                ),
                validator: (v) =>
                    v == null ? 'Selectionnez une categorie' : null,
                items: const [
                  DropdownMenuItem(
                    value: 'ALIMENTATION',
                    child: Text(AppStrings.catAlimentation),
                  ),
                  DropdownMenuItem(
                    value: 'SANTE',
                    child: Text(AppStrings.catSante),
                  ),
                  DropdownMenuItem(
                    value: 'ACHAT_ANIMAUX',
                    child: Text(AppStrings.catAchatAnimaux),
                  ),
                  DropdownMenuItem(
                    value: 'EQUIPEMENT',
                    child: Text(AppStrings.catEquipement),
                  ),
                  DropdownMenuItem(
                    value: 'MAIN_OEUVRE',
                    child: Text(AppStrings.catMainOeuvre),
                  ),
                  DropdownMenuItem(
                    value: 'TRANSPORT',
                    child: Text(AppStrings.catTransport),
                  ),
                  DropdownMenuItem(
                    value: 'ENERGIE',
                    child: Text(AppStrings.catEnergie),
                  ),
                  DropdownMenuItem(
                    value: 'AUTRE',
                    child: Text(AppStrings.catAutre),
                  ),
                ],
                onChanged: (v) => setState(() => _category = v),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Description
              GGTextField(
                label: AppStrings.description,
                hint: 'Ex: Achat aliment pondeuse 50kg',
                controller: _descController,
                prefixIcon: Icons.description,
                maxLines: 2,
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Montant
              GGTextField(
                label: AppStrings.amount,
                hint: 'Ex: 50000',
                controller: _amountController,
                keyboardType: TextInputType.number,
                prefixIcon: Icons.payments,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) {
                    return 'Montant requis';
                  }
                  if (int.tryParse(v.trim()) == null) {
                    return 'Montant invalide';
                  }
                  return null;
                },
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Lot (optionnel)
              DropdownButtonFormField<String>(
                value: _flock,
                decoration: const InputDecoration(
                  labelText: 'Lot (optionnel)',
                  prefixIcon: Icon(Icons.pets),
                ),
                items: flocks
                    .map((f) => DropdownMenuItem(
                          value: f.id,
                          child: Text(f.name),
                        ))
                    .toList(),
                onChanged: (v) => setState(() => _flock = v),
              ),
              const SizedBox(height: AppDimensions.space32),

              GGButton(
                label: AppStrings.save,
                onPressed:
                    _isFormValid && !_isSaving ? _submit : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
