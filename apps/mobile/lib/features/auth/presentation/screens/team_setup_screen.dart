import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

/// TeamSetup: toggle entre "Creer ma ferme" et "Rejoindre une ferme"
class TeamSetupScreen extends StatefulWidget {
  const TeamSetupScreen({super.key});

  @override
  State<TeamSetupScreen> createState() => _TeamSetupScreenState();
}

class _TeamSetupScreenState extends State<TeamSetupScreen> {
  bool _isCreate = true;

  // Creer
  final _nameController = TextEditingController();
  final _locationController = TextEditingController();

  // Rejoindre
  final _ownerPhoneController = TextEditingController();
  final _inviteCodeController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _locationController.dispose();
    _ownerPhoneController.dispose();
    _inviteCodeController.dispose();
    super.dispose();
  }

  bool get _canSubmitCreate =>
      _nameController.text.trim().isNotEmpty &&
      _locationController.text.trim().isNotEmpty;

  bool get _canSubmitJoin =>
      _ownerPhoneController.text.trim().length >= 9 &&
      _inviteCodeController.text.trim().isNotEmpty;

  bool get _canSubmit => _isCreate ? _canSubmitCreate : _canSubmitJoin;

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

                    // Toggle tabs
                    Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.night.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: _TabButton(
                              label: 'Creer ma ferme',
                              isActive: _isCreate,
                              onTap: () => setState(() => _isCreate = true),
                            ),
                          ),
                          Expanded(
                            child: _TabButton(
                              label: 'Rejoindre une ferme',
                              isActive: !_isCreate,
                              onTap: () => setState(() => _isCreate = false),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Form content
                    if (_isCreate) ...[
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
                    ] else ...[
                      // Telephone proprietaire
                      Text(
                        'Telephone du proprietaire',
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
                        child: Row(
                          children: [
                            const SizedBox(width: 14),
                            const Text(
                              '+221',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.night,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Container(
                              width: 1,
                              height: 22,
                              color: AppColors.inputBorder,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                controller: _ownerPhoneController,
                                keyboardType: TextInputType.phone,
                                onChanged: (_) => setState(() {}),
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  LengthLimitingTextInputFormatter(9),
                                ],
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppColors.night,
                                ),
                                decoration: InputDecoration(
                                  hintText: '7X XXX XX XX',
                                  hintStyle: TextStyle(
                                    fontSize: 14,
                                    color: AppColors.textHint,
                                  ),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.zero,
                                  isDense: true,
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Code invitation
                      _buildField(
                        "Code d'invitation",
                        'Code recu par WhatsApp',
                        _inviteCodeController,
                      ),
                    ],
                    const SizedBox(height: 24),

                    // CTA
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _canSubmit ? _submit : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor:
                              AppColors.primary.withValues(alpha: 0.4),
                          disabledForegroundColor:
                              Colors.white.withValues(alpha: 0.7),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          _isCreate ? 'Creer ma ferme' : 'Rejoindre',
                          style: const TextStyle(
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
            onChanged: (_) => setState(() {}),
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
}

class _TabButton extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _TabButton({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: isActive ? AppColors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppColors.night.withValues(alpha: 0.06),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
              color: isActive ? AppColors.night : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}
