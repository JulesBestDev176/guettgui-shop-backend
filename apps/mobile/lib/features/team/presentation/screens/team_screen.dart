import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/network/api_client.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_button.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

// --- Team Members Provider ---
final teamMembersProvider =
    FutureProvider.family<List<Map<String, dynamic>>, String>(
        (ref, teamId) async {
  final dio = ref.watch(dioProvider);
  try {
    final response = await dio.get(ApiEndpoints.teamMembers(teamId));
    return (response.data['data'] as List)
        .map((e) => e as Map<String, dynamic>)
        .toList();
  } catch (_) {
    return [];
  }
});

// --- Team Info Provider ---
final teamInfoProvider =
    FutureProvider.family<Map<String, dynamic>?, String>(
        (ref, teamId) async {
  final dio = ref.watch(dioProvider);
  try {
    final response = await dio.get(ApiEndpoints.teamById(teamId));
    return response.data['data'] as Map<String, dynamic>;
  } catch (_) {
    return null;
  }
});

class TeamScreen extends ConsumerWidget {
  const TeamScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;
    final user = ref.watch(authStateProvider).user;

    if (teamId == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(title: const Text(AppStrings.team)),
        body: Center(
          child: Text(
            'Aucune equipe configuree',
            style: TextStyle(fontSize: 13, color: AppColors.textMeta),
          ),
        ),
      );
    }

    final membersAsync = ref.watch(teamMembersProvider(teamId));
    final teamInfoAsync = ref.watch(teamInfoProvider(teamId));

    final teamName = teamInfoAsync.valueOrNull?['name'] as String? ??
        user?.teamName ??
        '';
    final teamLocation =
        teamInfoAsync.valueOrNull?['location'] as String? ?? '';
    final inviteCode =
        teamInfoAsync.valueOrNull?['inviteCode'] as String? ?? '';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.team)),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(teamMembersProvider(teamId));
          ref.invalidate(teamInfoProvider(teamId));
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
                    Text(
                      teamName,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    if (teamLocation.isNotEmpty) ...[
                      const SizedBox(height: AppDimensions.space4),
                      Text(
                        teamLocation,
                        style:
                            const TextStyle(color: AppColors.grey600),
                      ),
                    ],
                    if (inviteCode.isNotEmpty) ...[
                      const SizedBox(height: AppDimensions.space12),
                      Row(
                        children: [
                          const Icon(
                            Icons.vpn_key,
                            size: 16,
                            color: AppColors.grey500,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Code: $inviteCode',
                            style: const TextStyle(
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
                                ClipboardData(text: inviteCode),
                              );
                              context
                                  .showSuccessSnackBar('Code copie.');
                            },
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.space20),

              // --- Section membres ---
              membersAsync.when(
                loading: () => const Center(
                    child: CircularProgressIndicator()),
                error: (_, __) => const Text(
                    'Impossible de charger les membres'),
                data: (members) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${AppStrings.members} (${members.length})',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        TextButton.icon(
                          onPressed: () =>
                              _showInviteBottomSheet(context),
                          icon: const Icon(
                              Icons.person_add, size: 18),
                          label: const Text('Inviter'),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    ...members.map((m) {
                      final name =
                          '${m['firstName'] ?? ''} ${m['lastName'] ?? ''}'
                              .trim();
                      final phone = m['phone'] as String? ?? '';
                      final role = m['role'] as String? ?? 'MEMBER';
                      final isOwner = role == 'OWNER';

                      return Padding(
                        padding: const EdgeInsets.only(
                            bottom: AppDimensions.space8),
                        child: GGCard(
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundColor: isOwner
                                    ? AppColors.primaryLight
                                    : AppColors.grey100,
                                child: Icon(
                                  Icons.person,
                                  color: isOwner
                                      ? AppColors.primary
                                      : AppColors.grey500,
                                ),
                              ),
                              const SizedBox(
                                  width: AppDimensions.space12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      name.isNotEmpty
                                          ? name
                                          : phone,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    Text(
                                      phone,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: AppColors.grey500,
                                      ),
                                    ),
                                    Text(
                                      isOwner
                                          ? AppStrings.owner
                                          : AppStrings.member,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: isOwner
                                            ? AppColors.primary
                                            : AppColors.grey500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (isOwner)
                                const Icon(
                                  Icons.star,
                                  color: AppColors.primary,
                                  size: 20,
                                ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
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
      backgroundColor: AppColors.ivory,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppDimensions.radiusLg),
        ),
      ),
      builder: (ctx) {
        return const _InviteBottomSheet();
      },
    );
  }
}

class _InviteBottomSheet extends StatefulWidget {
  const _InviteBottomSheet();

  @override
  State<_InviteBottomSheet> createState() => _InviteBottomSheetState();
}

class _InviteBottomSheetState extends State<_InviteBottomSheet> {
  final _phoneController = TextEditingController();
  String _selectedRole = 'Membre';

  static const _roles = [
    'Proprietaire',
    'Membre',
    'Ouvrier',
    'Gestionnaire',
  ];

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  bool get _canSend => _phoneController.text.trim().length >= 9;

  void _sendInvitation() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Invitation envoyee par WhatsApp',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white,
          ),
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 80),
      ),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppDimensions.space24,
        right: AppDimensions.space24,
        top: AppDimensions.space24,
        bottom: MediaQuery.of(context).viewInsets.bottom +
            AppDimensions.space24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.grey300,
                borderRadius: BorderRadius.circular(2),
              ),
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
          Text(
            'Saisissez le numero WhatsApp du membre a inviter.',
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppDimensions.space24),

          // Telephone WhatsApp
          Text(
            'Telephone WhatsApp',
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
          const SizedBox(height: AppDimensions.space16),

          // Role dropdown
          Text(
            'Role',
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
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedRole,
                isExpanded: true,
                icon: Icon(
                  Icons.expand_more,
                  size: 20,
                  color: AppColors.textMeta,
                ),
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.night,
                ),
                dropdownColor: AppColors.white,
                items: _roles
                    .map((r) => DropdownMenuItem(
                          value: r,
                          child: Text(r),
                        ))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedRole = val);
                },
              ),
            ),
          ),
          const SizedBox(height: AppDimensions.space24),

          // Send button
          GGButton(
            label: "Envoyer l'invitation",
            icon: Icons.send,
            onPressed: _canSend ? _sendInvitation : null,
          ),
          const SizedBox(height: AppDimensions.space16),
        ],
      ),
    );
  }
}
