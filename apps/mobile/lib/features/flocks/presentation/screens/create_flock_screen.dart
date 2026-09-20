import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/core/utils/validators.dart';
import 'package:guettgui_mobile/features/flocks/presentation/providers/flock_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class CreateFlockScreen extends ConsumerStatefulWidget {
  const CreateFlockScreen({super.key});

  @override
  ConsumerState<CreateFlockScreen> createState() => _CreateFlockScreenState();
}

class _CreateFlockScreenState extends ConsumerState<CreateFlockScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _raceController = TextEditingController();
  final _femalesController = TextEditingController();
  final _malesController = TextEditingController();
  String _selectedType = 'BREEDER';
  DateTime _startDate = DateTime.now();

  @override
  void dispose() {
    _nameController.dispose();
    _raceController.dispose();
    _femalesController.dispose();
    _malesController.dispose();
    super.dispose();
  }

  bool get _isFormValid {
    final hasName = _nameController.text.trim().isNotEmpty;
    final hasFemales = _femalesController.text.trim().isNotEmpty;
    if (_selectedType == 'BROILER') {
      return hasName && hasFemales;
    }
    final hasMales = _malesController.text.trim().isNotEmpty;
    return hasName && hasFemales && hasMales;
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _startDate = picked);
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
          ref.read(flockListNotifierProvider(teamId).notifier);
      await notifier.createFlock({
        'name': _nameController.text.trim(),
        'type': _selectedType,
        'startDate': _startDate.toIso8601String(),
        'initialFemales': int.tryParse(_femalesController.text.trim()) ?? 0,
        'initialMales': int.tryParse(_malesController.text.trim()) ?? 0,
      });

      if (mounted) {
        context.showSuccessSnackBar('Lot cree avec succes.');
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
      appBar: AppBar(title: const Text(AppStrings.createFlock)),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GGTextField(
                label: AppStrings.flockName,
                hint: 'Ex: Goliath - Noyau 1',
                controller: _nameController,
                validator: Validators.name,
                prefixIcon: Icons.label,
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppDimensions.space16),

              // Type dropdown
              DropdownButtonFormField<String>(
                value: _selectedType,
                decoration: const InputDecoration(
                  labelText: AppStrings.flockType,
                  prefixIcon: Icon(Icons.category),
                ),
                items: const [
                  DropdownMenuItem(
                    value: 'BREEDER',
                    child: Text(AppStrings.breederType),
                  ),
                  DropdownMenuItem(
                    value: 'LAYER',
                    child: Text(AppStrings.layerType),
                  ),
                  DropdownMenuItem(
                    value: 'BROILER',
                    child: Text(AppStrings.broilerType),
                  ),
                  DropdownMenuItem(
                    value: 'QUAIL',
                    child: Text(AppStrings.quailType),
                  ),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _selectedType = v);
                },
              ),
              const SizedBox(height: AppDimensions.space16),

              GGTextField(
                label: 'Race',
                hint: 'Ex: Goliath, ISA Brown',
                controller: _raceController,
                prefixIcon: Icons.pets,
              ),
              const SizedBox(height: AppDimensions.space16),

              // Date
              GestureDetector(
                onTap: _selectDate,
                child: AbsorbPointer(
                  child: GGTextField(
                    label: AppStrings.startDate,
                    controller: TextEditingController(
                      text:
                          '${_startDate.day.toString().padLeft(2, '0')}/${_startDate.month.toString().padLeft(2, '0')}/${_startDate.year}',
                    ),
                    prefixIcon: Icons.calendar_today,
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.space16),

              if (_selectedType != 'BROILER') ...[
                GGTextField(
                  label: AppStrings.initialFemales,
                  controller: _femalesController,
                  keyboardType: TextInputType.number,
                  validator: (v) =>
                      Validators.positiveInteger(v, 'Le nombre de femelles'),
                  prefixIcon: Icons.female,
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: AppDimensions.space16),
                GGTextField(
                  label: AppStrings.initialMales,
                  controller: _malesController,
                  keyboardType: TextInputType.number,
                  validator: (v) =>
                      Validators.positiveInteger(v, 'Le nombre de males'),
                  prefixIcon: Icons.male,
                  onChanged: (_) => setState(() {}),
                ),
              ] else ...[
                GGTextField(
                  label: AppStrings.initialTotal,
                  controller: _femalesController,
                  keyboardType: TextInputType.number,
                  validator: (v) =>
                      Validators.positiveInteger(v, 'L\'effectif initial'),
                  prefixIcon: Icons.pets,
                  onChanged: (_) => setState(() {}),
                ),
              ],
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
