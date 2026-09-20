import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

/// Onboarding: 3 intro pages + page connexion (derniere page)
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  final _phoneController = TextEditingController();
  int _currentPage = 0;

  static const _introPages = [
    _IntroPage(
      title: 'Gerez votre elevage simplement.',
      description:
          'Suivez votre production, vos finances et vos stocks au quotidien.',
      icon: Icons.agriculture_outlined,
    ),
    _IntroPage(
      title: 'Des donnees fiables, de meilleures decisions.',
      description:
          'Dashboard, alertes et rapports pour piloter votre rentabilite.',
      icon: Icons.insights_outlined,
    ),
    _IntroPage(
      title: 'Travaillez en equipe.',
      description:
          'Invitez vos collaborateurs et partagez le suivi en temps reel.',
      icon: Icons.group_outlined,
    ),
  ];

  // Total pages = intro pages + 1 login page
  int get _totalPages => _introPages.length + 1;

  @override
  void dispose() {
    _pageController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _login() {
    // No backend -- go directly to dashboard
    context.go(AppRoutes.dashboard);
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // Page view
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (index) =>
                    setState(() => _currentPage = index),
                children: [
                  // Intro pages
                  ..._introPages.map(
                    (page) => _IntroPageWidget(page: page),
                  ),
                  // Login page (last)
                  _buildLoginPage(),
                ],
              ),
            ),

            // Bottom: page indicator + button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: Column(
                children: [
                  // Page indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _totalPages,
                      (i) => Container(
                        width: i == _currentPage ? 24 : 8,
                        height: 8,
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        decoration: BoxDecoration(
                          color: i == _currentPage
                              ? AppColors.primary
                              : AppColors.night.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Button: "Suivant" for intro, nothing for login (login has its own)
                  if (_currentPage < _introPages.length)
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _nextPage,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Suivant',
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
          ],
        ),
      ),
    );
  }

  Widget _buildLoginPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 32, 16, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo centered 180px
          Center(
            child: Image.asset(
              'assets/images/logo_full.png',
              width: 180,
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 36),

          // Title
          const Text(
            'Connectez-vous',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: AppColors.night,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Entrez votre numero pour acceder a votre elevage',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 28),

          // Label
          Text(
            'Telephone',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 6),

          // Phone input 52px
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
                      letterSpacing: 0.5,
                    ),
                    decoration: InputDecoration(
                      hintText: '7X XXX XX XX',
                      hintStyle: TextStyle(
                        fontSize: 14,
                        color: AppColors.textHint,
                        letterSpacing: 0.5,
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
          const SizedBox(height: 20),

          // Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: _login,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Se connecter',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Signup link
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Pas de compte ? ',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
                GestureDetector(
                  onTap: () => context.go(AppRoutes.phone),
                  child: const Text(
                    'Inscription',
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
    );
  }
}

class _IntroPage {
  final String title;
  final String description;
  final IconData icon;

  const _IntroPage({
    required this.title,
    required this.description,
    required this.icon,
  });
}

class _IntroPageWidget extends StatelessWidget {
  final _IntroPage page;

  const _IntroPageWidget({required this.page});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.10),
              shape: BoxShape.circle,
            ),
            child: Icon(
              page.icon,
              size: 48,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 32),
          Text(
            page.title,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: AppColors.night,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            page.description,
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
