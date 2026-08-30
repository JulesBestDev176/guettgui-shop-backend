import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<_NotifItem> _notifications = [
    _NotifItem(
      'Stock aliment bas',
      'Aliment pondeuse : 40 kg restants',
      'HIGH',
      false,
      'Il y a 1h',
    ),
    _NotifItem(
      'Mirage a faire demain',
      'Lot Incubation #5 - J7',
      'HIGH',
      false,
      'Il y a 3h',
    ),
    _NotifItem(
      'Saisie manquante',
      'Lot Chair #12 - Hier',
      'LOW',
      true,
      'Hier',
    ),
    _NotifItem(
      'Vaccination J14',
      'Lot Pondeuses #3 - Newcastle',
      'MEDIUM',
      true,
      'Il y a 2 jours',
    ),
    _NotifItem(
      'Commande a livrer',
      'Client Diop - 50 poussins',
      'MEDIUM',
      true,
      'Il y a 3 jours',
    ),
  ];

  void _markAllAsRead() {
    setState(() {
      for (var i = 0; i < _notifications.length; i++) {
        _notifications[i] = _NotifItem(
          _notifications[i].title,
          _notifications[i].message,
          _notifications[i].priority,
          true,
          _notifications[i].date,
        );
      }
    });
    context.showSuccessSnackBar('Toutes les notifications marquees comme lues.');
  }

  void _markAsRead(int index) {
    if (_notifications[index].isRead) return;
    setState(() {
      final n = _notifications[index];
      _notifications[index] = _NotifItem(
        n.title,
        n.message,
        n.priority,
        true,
        n.date,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.notifications),
        actions: [
          TextButton(
            onPressed: _markAllAsRead,
            child: const Text('Tout lire'),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: _notifications.length,
          itemBuilder: (context, index) {
            final notif = _notifications[index];
            final color = notif.priority == 'HIGH'
                ? AppColors.error
                : notif.priority == 'MEDIUM'
                    ? AppColors.warning
                    : AppColors.info;

            return Dismissible(
              key: ValueKey('notif_$index'),
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
              onDismissed: (_) => _markAsRead(index),
              child: Padding(
                padding: const EdgeInsets.only(
                  bottom: AppDimensions.space8,
                ),
                child: GGCard(
                  backgroundColor: notif.isRead
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
                          notif.priority == 'HIGH'
                              ? Icons.warning
                              : Icons.notifications,
                          color: color,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              notif.title,
                              style: TextStyle(
                                fontWeight: notif.isRead
                                    ? FontWeight.w400
                                    : FontWeight.w600,
                              ),
                            ),
                            Text(
                              notif.message,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grey500,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              notif.date,
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.grey400,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (!notif.isRead)
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
      ),
    );
  }
}

class _NotifItem {
  final String title;
  final String message;
  final String priority;
  final bool isRead;
  final String date;

  const _NotifItem(
    this.title,
    this.message,
    this.priority,
    this.isRead,
    this.date,
  );
}
