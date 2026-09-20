import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class TeamScreen extends StatelessWidget {
  const TeamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final members = [
      _MemberData('Amadou Diop', '+221 77 123 45 67', AppStrings.owner, true),
      _MemberData('Moussa Fall', '+221 78 234 56 78', AppStrings.member, false),
      _MemberData(
        'Fatou Ndiaye',
        '+221 76 345 67 89',
        AppStrings.member,
        false,
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.team)),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // --- Infos elevage ---
              GGCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Elevage Diop',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space4),
                    const Text(
                      'Thies, Senegal',
                      style: TextStyle(color: AppColors.grey600),
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    Row(
                      children: [
                        const Icon(
                          Icons.vpn_key,
                          size: 16,
                          color: AppColors.grey500,
                        ),
                        const SizedBox(width: 4),
                        const Text(
                          'Code: ABC123',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.copy, size: 18),
                          tooltip: 'Copier le code',
                          onPressed: () {
                            Clipboard.setData(
                              const ClipboardData(text: 'ABC123'),
                            );
                            context.showSuccessSnackBar('Code copie.');
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.space20),

              // --- Section membres ---
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${AppStrings.members} (${members.length})',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () => _showInviteBottomSheet(context),
                    icon: const Icon(Icons.person_add, size: 18),
                    label: const Text('Inviter'),
                  ),
                ],
              ),
              const SizedBox(height: AppDimensions.space12),

              // --- Liste membres ---
              ...members.map(
                (m) => Padding(
                  padding: const EdgeInsets.only(bottom: AppDimensions.space8),
                  child: GGCard(
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: m.isOwner
                              ? AppColors.primaryLight
                              : AppColors.grey100,
                          child: Icon(
                            Icons.person,
                            color: m.isOwner
                                ? AppColors.primary
                                : AppColors.grey500,
                          ),
                        ),
                        const SizedBox(width: AppDimensions.space12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                m.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                m.phone,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.grey500,
                                ),
                              ),
                              Text(
                                m.role,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: m.isOwner
                                      ? AppColors.primary
                                      : AppColors.grey500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (m.isOwner)
                          const Icon(
                            Icons.star,
                            color: AppColors.primary,
                            size: 20,
                          ),
                        if (!m.isOwner)
                          PopupMenuButton<String>(
                            icon: const Icon(
                              Icons.more_vert,
                              color: AppColors.grey400,
                            ),
                            onSelected: (value) {
                              if (value == 'remove') {
                                context.showSuccessSnackBar(
                                  '${m.name} retire de l\'equipe.',
                                );
                              }
                            },
                            itemBuilder: (context) => [
                              const PopupMenuItem(
                                value: 'remove',
                                child: Text(
                                  AppStrings.removeMember,
                                  style: TextStyle(color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showInviteBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppDimensions.radiusLg),
        ),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppDimensions.space24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.grey300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: AppDimensions.space20),
              const Text(
                'Inviter un membre',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: AppDimensions.space8),
              const Text(
                'Le nouveau membre devra entrer ce code pour rejoindre votre elevage.',
                style: TextStyle(color: AppColors.grey600),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.space24),
              GGCard(
                child: Column(
                  children: [
                    const Text(
                      'Code d\'invitation',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.grey500,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space8),
                    const Text(
                      'ABC123',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                        letterSpacing: 4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.space20),
              GGButton(
                label: 'Copier le code',
                icon: Icons.copy,
                onPressed: () {
                  Clipboard.setData(const ClipboardData(text: 'ABC123'));
                  ctx.showSuccessSnackBar('Code copie.');
                  Navigator.pop(ctx);
                },
              ),
              const SizedBox(height: AppDimensions.space12),
              GGButton.outlined(
                label: 'Partager',
                icon: Icons.share,
                onPressed: () {
                  Navigator.pop(ctx);
                },
              ),
              const SizedBox(height: AppDimensions.space16),
            ],
          ),
        );
      },
    );
  }
}

class _MemberData {
  final String name;
  final String phone;
  final String role;
  final bool isOwner;

  const _MemberData(this.name, this.phone, this.role, this.isOwner);
}
