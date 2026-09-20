import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/vaccination/presentation/providers/vaccination_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class ProtocolListScreen extends ConsumerWidget {
  const ProtocolListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.protocols)),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        onPressed: () => context.push(AppRoutes.createProtocol),
        child: const Icon(Icons.add),
      ),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _ProtocolsList(teamId: teamId),
    );
  }
}

class _ProtocolsList extends ConsumerWidget {
  final String teamId;

  const _ProtocolsList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final protocolsAsync = ref.watch(protocolListProvider(teamId));

    return protocolsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les protocoles',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(protocolListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (protocols) {
        if (protocols.isEmpty) {
          return Center(
            child: Text(
              'Aucun protocole de vaccination',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(protocolListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: protocols.length,
            itemBuilder: (context, index) {
              final protocol = protocols[index];
              return Padding(
                padding:
                    const EdgeInsets.only(bottom: AppDimensions.space12),
                child: GGCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight,
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusSm,
                              ),
                            ),
                            child: const Icon(
                              Icons.medical_services,
                              color: AppColors.primary,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: AppDimensions.space12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Text(
                                  protocol.name,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                if (protocol.description != null)
                                  Text(
                                    protocol.description!,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.grey500,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      if (protocol.steps.isNotEmpty) ...[
                        const SizedBox(height: AppDimensions.space12),
                        const Divider(
                            height: 1, color: AppColors.grey200),
                        const SizedBox(height: AppDimensions.space8),
                        ...protocol.steps.map(
                          (step) => Padding(
                            padding: const EdgeInsets.only(
                              bottom: AppDimensions.space6,
                            ),
                            child: Row(
                              children: [
                                const SizedBox(
                                    width: AppDimensions.space4),
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.primary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(
                                    width: AppDimensions.space8),
                                Expanded(
                                  child: Text(
                                    step['name'] as String? ?? '',
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                                Text(
                                  step['day'] as String? ?? '',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(
                                    width: AppDimensions.space12),
                                Text(
                                  step['mode'] as String? ?? '',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.grey500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
