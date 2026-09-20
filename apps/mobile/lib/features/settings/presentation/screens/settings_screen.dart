import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:guettgui_mobile/shared/widgets/gg_text_field.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // --- Elevage ---
  final _layingRateController = TextEditingController(text: '70');
  final _fertilityRateController = TextEditingController(text: '85');
  final _hatchRateController = TextEditingController(text: '82');
  final _broilerDaysController = TextEditingController(text: '45');

  // --- Personnel ---
  bool _notificationsEnabled = true;
  String _selectedLanguage = 'Francais';

  @override
  void dispose() {
    _layingRateController.dispose();
    _fertilityRateController.dispose();
    _hatchRateController.dispose();
    _broilerDaysController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.settings)),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ======= SECTION ELEVAGE =======
            const _SectionHeader(
              icon: Icons.agriculture,
              title: 'Elevage',
            ),
            const SizedBox(height: AppDimensions.space12),

            // Objectifs de production
            const Text(
              'Objectifs de production',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.grey700,
              ),
            ),
            const SizedBox(height: AppDimensions.space12),
            GGTextField(
              label: AppStrings.layingRateTarget,
              controller: _layingRateController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.egg,
            ),
            const SizedBox(height: AppDimensions.space12),
            GGTextField(
              label: AppStrings.fertilityRateTarget,
              controller: _fertilityRateController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.spa,
            ),
            const SizedBox(height: AppDimensions.space12),
            GGTextField(
              label: AppStrings.hatchRateTarget,
              controller: _hatchRateController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.egg_alt,
            ),
            const SizedBox(height: AppDimensions.space12),
            GGTextField(
              label: 'Duree engraissement (jours)',
              controller: _broilerDaysController,
              keyboardType: TextInputType.number,
              prefixIcon: Icons.timer,
            ),
            const SizedBox(height: AppDimensions.space16),

            // Seuils de stock
            const Text(
              'Seuils de stock',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.grey700,
              ),
            ),
            const SizedBox(height: AppDimensions.space12),
            _ThresholdTile('Aliment pondeuse', '50 kg'),
            _ThresholdTile('Aliment croissance', '50 kg'),
            _ThresholdTile('Vaccins', '50 doses'),
            _ThresholdTile('Tablettes vides', '10 unites'),
            const SizedBox(height: AppDimensions.space12),

            SizedBox(
              width: double.infinity,
              child: GGButton(
                label: 'Enregistrer les parametres elevage',
                onPressed: () {
                  context.showSuccessSnackBar('Parametres elevage mis a jour.');
                },
              ),
            ),
            const SizedBox(height: AppDimensions.space24),

            const Divider(color: AppColors.grey200),
            const SizedBox(height: AppDimensions.space16),

            // ======= SECTION PERSONNEL =======
            const _SectionHeader(
              icon: Icons.person,
              title: 'Personnel',
            ),
            const SizedBox(height: AppDimensions.space12),

            GGCard(
              child: Row(
                children: [
                  const Icon(Icons.notifications, color: AppColors.primary),
                  const SizedBox(width: AppDimensions.space12),
                  const Expanded(
                    child: Text(
                      AppStrings.notificationSettings,
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  Switch(
                    value: _notificationsEnabled,
                    activeColor: AppColors.primary,
                    onChanged: (v) => setState(() => _notificationsEnabled = v),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space8),

            GGCard(
              child: Row(
                children: [
                  const Icon(Icons.language, color: AppColors.primary),
                  const SizedBox(width: AppDimensions.space12),
                  const Expanded(
                    child: Text(
                      AppStrings.language,
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  DropdownButton<String>(
                    value: _selectedLanguage,
                    underline: const SizedBox.shrink(),
                    items: const [
                      DropdownMenuItem(
                        value: 'Francais',
                        child: Text('Francais'),
                      ),
                      DropdownMenuItem(
                        value: 'Wolof',
                        child: Text('Wolof'),
                      ),
                    ],
                    onChanged: (v) {
                      if (v != null) setState(() => _selectedLanguage = v);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space24),

            const Divider(color: AppColors.grey200),
            const SizedBox(height: AppDimensions.space16),

            // ======= SECTION EQUIPE =======
            const _SectionHeader(
              icon: Icons.group,
              title: 'Equipe',
            ),
            const SizedBox(height: AppDimensions.space12),

            GGCard(
              onTap: () => context.push(AppRoutes.teamRoute),
              child: Row(
                children: [
                  const Icon(Icons.group, color: AppColors.primary),
                  const SizedBox(width: AppDimensions.space12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Gerer l\'equipe',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          'Membres, invitations, roles',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.grey500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: AppColors.grey400),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space24),

            const Divider(color: AppColors.grey200),
            const SizedBox(height: AppDimensions.space16),

            // ======= A PROPOS =======
            GGCard(
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.primary),
                  const SizedBox(width: AppDimensions.space12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'A propos',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          'Guett Gui v1.0.0',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.grey500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space32),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final String title;

  const _SectionHeader({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 22),
        const SizedBox(width: AppDimensions.space8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.black,
          ),
        ),
      ],
    );
  }
}

class _ThresholdTile extends StatelessWidget {
  final String name;
  final String value;

  const _ThresholdTile(this.name, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDimensions.space8),
      child: GGCard(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(name, style: const TextStyle(color: AppColors.grey700)),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}
