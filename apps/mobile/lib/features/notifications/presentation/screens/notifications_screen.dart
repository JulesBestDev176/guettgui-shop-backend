import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/alerts/domain/entities/alert.dart';
import 'package:guettgui_mobile/features/alerts/presentation/providers/alert_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';
import 'package:intl/intl.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.notifications),
        actions: [
          if (teamId != null)
            TextButton(
              onPressed: () => _markAllAsRead(ref, teamId),
              child: const Text('Tout lire'),
            ),
        ],
      ),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _AlertsList(teamId: teamId),
    );
  }

  void _markAllAsRead(WidgetRef ref, String teamId) async {
    final alertsAsync = ref.read(alertListProvider(teamId));
    final alerts = alertsAsync.valueOrNull ?? [];
    final notifier = ref.read(alertNotifierProvider(teamId).notifier);
    for (final alert in alerts) {
      if (!alert.isRead) {
        await notifier.markAsRead(alert.id);
      }
    }
  }
}

class _AlertsList extends ConsumerWidget {
  final String teamId;

  const _AlertsList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alertsAsync = ref.watch(alertListProvider(teamId));

    return alertsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les notifications',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(alertListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (alerts) {
        final filtered =
            alerts.where((a) => !a.isDismissed).toList();

        if (filtered.isEmpty) {
          return Center(
            child: Text(
              'Aucune notification',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(alertListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final alert = filtered[index];
              final color = alert.priority == 'HIGH'
                  ? AppColors.error
                  : alert.priority == 'MEDIUM'
                      ? AppColors.warning
                      : AppColors.info;
              final dateStr = _formatRelativeDate(alert.createdAt);

              return Dismissible(
                key: ValueKey(alert.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 20),
                  margin: const EdgeInsets.only(
                    bottom: AppDimensions.space8,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(
                      AppDimensions.radiusMd,
                    ),
                  ),
                  child: const Icon(
                    Icons.mark_email_read,
                    color: AppColors.white,
                  ),
                ),
                onDismissed: (_) {
                  ref
                      .read(alertNotifierProvider(teamId).notifier)
                      .dismiss(alert.id);
                },
                child: Padding(
                  padding: const EdgeInsets.only(
                    bottom: AppDimensions.space8,
                  ),
                  child: GGCard(
                    backgroundColor: alert.isRead
                        ? AppColors.white
                        : AppColors.primaryLight.withValues(alpha: 0.3),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(
                              AppDimensions.radiusSm,
                            ),
                          ),
                          child: Icon(
                            alert.priority == 'HIGH'
                                ? Icons.warning
                                : Icons.notifications,
                            color: color,
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
                                alert.title,
                                style: TextStyle(
                                  fontWeight: alert.isRead
                                      ? FontWeight.w400
                                      : FontWeight.w600,
                                ),
                              ),
                              Text(
                                alert.message,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.grey500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                dateStr,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.grey400,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (!alert.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  String _formatRelativeDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 60) return 'Il y a ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Il y a ${diff.inHours}h';
    if (diff.inDays == 1) return 'Hier';
    if (diff.inDays < 7) return 'Il y a ${diff.inDays} jours';
    return DateFormat('d MMM', 'fr_FR').format(date);
  }
}
