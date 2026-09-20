import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

/// Signup screen (inscription nom+prenom+telephone) matching prototype isSignup.
class PhoneInputScreen extends StatefulWidget {
  const PhoneInputScreen({super.key});

  @override
  State<PhoneInputScreen> createState() => _PhoneInputScreenState();
}

class _PhoneInputScreenState extends State<PhoneInputScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _submit() {
    context.go(AppRoutes.teamSetup);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px with back button
            SizedBox(
              height: 48,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.go(AppRoutes.onboarding),
                      child: const Icon(
                        Icons.arrow_back,
                        size: 22,
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
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Logo 64x64
                    Center(
                      child: Image.asset(
                        'assets/images/logo.png',
                        width: 64,
                        height: 64,
                        fit: BoxFit.contain,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Title
                    const Text(
                      'Creer un compte',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Quelques informations pour demarrer',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Fields with gap 12px
                    // Prenom
                    _buildField(
                      'Prenom',
                      'Amadou',
                      _firstNameController,
                    ),
                    const SizedBox(height: 12),

                    // Nom
                    _buildField(
                      'Nom',
                      'Diallo',
                      _lastNameController,
                    ),
                    const SizedBox(height: 12),

                    // Telephone
                    Text(
                      'Telephone',
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
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
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
                    const SizedBox(height: 28),

                    // Button
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
                          "S'inscrire",
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Login link
                    Center(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Deja un compte ? ',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => context.go(AppRoutes.onboarding),
                            child: const Text(
                              'Se connecter',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.night,
                              ),
                            ),
                          ),
                        ],
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
}
