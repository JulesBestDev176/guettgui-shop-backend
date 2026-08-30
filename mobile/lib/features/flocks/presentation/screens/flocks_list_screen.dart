import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

final flocksFilterProvider = StateProvider<String>((ref) => 'Tous');

/// Mock flock data matching prototype FLOCKS array
class _FlockData {
  final int id;
  final String name;
  final String type;
  final String count;
  final Color dotColor;
  final String key_;
  final Color keyColor;
  final String status;

  const _FlockData({
    required this.id,
    required this.name,
    required this.type,
    required this.count,
    required this.dotColor,
    required this.key_,
    required this.keyColor,
    required this.status,
  });
}

const _flocks = [
  _FlockData(
    id: 1,
    name: 'Pondeuses A1',
    type: 'Pondeuse',
    count: '200 sujets',
    dotColor: AppColors.warning,
    key_: '142 oeufs/j',
    keyColor: AppColors.primary,
    status: 'Actif',
  ),
  _FlockData(
    id: 2,
    name: 'Chair B2',
    type: 'Chair',
    count: '180 sujets',
    dotColor: AppColors.info,
    key_: 'J-15',
    keyColor: AppColors.warning,
    status: 'Actif',
  ),
  _FlockData(
    id: 3,
    name: 'Repro C1',
    type: 'Repro',
    count: '90 sujets',
    dotColor: AppColors.primary,
    key_: '68 oeufs/j',
    keyColor: AppColors.primary,
    status: 'Actif',
  ),
  _FlockData(
    id: 4,
    name: 'Cailles D1',
    type: 'Caille',
    count: '50 sujets',
    dotColor: AppColors.gold,
    key_: '31 oeufs/j',
    keyColor: AppColors.primary,
    status: 'Actif',
  ),
  _FlockData(
    id: 5,
    name: 'Chair A3',
    type: 'Chair',
    count: '120 sujets',
    dotColor: AppColors.info,
    key_: 'Cloture',
    keyColor: AppColors.grey500,
    status: 'Termine',
  ),
];

class FlocksListScreen extends ConsumerWidget {
  const FlocksListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(flocksFilterProvider);
    final chips = ['Tous', 'Repro', 'Pondeuse', 'Chair', 'Caille'];
    final filtered = _flocks
        .where((f) => filter == 'Tous' || f.type == filter)
        .toList();

    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px: title + search
            SizedBox(
              height: 48,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Text(
                      'Elevage',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                    const Spacer(),
                    const Icon(Icons.search, size: 22, color: AppColors.night),
                  ],
                ),
              ),
            ),

            // Filter chips horizontal scroll
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
                itemCount: chips.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final c = chips[index];
                  final isActive = filter == c;
                  return GestureDetector(
                    onTap: () =>
                        ref.read(flocksFilterProvider.notifier).state = c,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: isActive
                            ? AppColors.primary.withValues(alpha: 0.12)
                            : AppColors.night.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        c,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                          color: isActive
                              ? AppColors.primary
                              : AppColors.textMeta,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // List cards
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 110),
                itemCount: filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final f = filtered[index];
                  return GestureDetector(
                    onTap: () => context.push('/flocks/${f.id}'),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        children: [
                          // Dot
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: f.dotColor,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Name + detail
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  f.name,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.night,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${f.count} \u00b7 ${f.type}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: AppColors.textMeta,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Right: key + status chip
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                f.key_,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: f.keyColor,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 3,
                                ),
                                decoration: BoxDecoration(
                                  color: f.status == 'Actif'
                                      ? AppColors.primary
                                          .withValues(alpha: 0.12)
                                      : AppColors.night
                                          .withValues(alpha: 0.06),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text(
                                  f.status,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                    color: f.status == 'Actif'
                                        ? AppColors.primary
                                        : AppColors.textMeta,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
