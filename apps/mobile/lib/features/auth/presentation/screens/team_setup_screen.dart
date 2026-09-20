import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

/// TeamSetup: Generic Form pattern
/// AppBar 48px: close (X) + titre "Votre elevage"
/// Subtitle + fields + CTA
class TeamSetupScreen extends StatefulWidget {
  const TeamSetupScreen({super.key});

  @override
  State<TeamSetupScreen> createState() => _TeamSetupScreenState();
}

class _TeamSetupScreenState extends State<TeamSetupScreen> {
  final _nameController = TextEditingController();
  final _locationController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _submit() {
    context.go(AppRoutes.dashboard);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px: close + title
            SizedBox(
              height: 48,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.go(AppRoutes.onboarding),
                      child: const Icon(
                        Icons.close,
                        size: 22,
                        color: AppColors.night,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Votre elevage',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Body
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Subtitle
                    Text(
                      "Derniere etape avant d'acceder a votre tableau de bord.",
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Fields
                    _buildField(
                      "Nom de l'elevage",
                      'ex. Ferme Ndiaye Bi',
                      _nameController,
                    ),
                    const SizedBox(height: 12),
                    _buildField(
                      'Localite',
                      'ex. Sebikotane',
                      _locationController,
                    ),
                    const SizedBox(height: 12),
                    // Type d'activite with chevron
                    _buildSelectField(
                      "Type d'activite",
                      'Ponte et chair',
                    ),
                    const SizedBox(height: 24),

                    // CTA
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Continuer',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, String hint, TextEditingController ctrl) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          height: 52,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.inputBorder),
          ),
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: TextField(
            controller: ctrl,
            style: const TextStyle(fontSize: 14, color: AppColors.night),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(fontSize: 14, color: AppColors.textHint),
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
              isDense: true,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectField(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          height: 52,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.inputBorder),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(fontSize: 14, color: AppColors.night),
                ),
              ),
              Icon(
                Icons.expand_more,
                size: 20,
                color: AppColors.textMeta,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
