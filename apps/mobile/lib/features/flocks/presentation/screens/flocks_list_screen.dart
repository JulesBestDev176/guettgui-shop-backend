import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';
import 'package:guettgui_mobile/features/flocks/presentation/providers/flock_provider.dart';

final flocksFilterProvider = StateProvider<String>((ref) => 'Tous');

class FlocksListScreen extends ConsumerWidget {
  const FlocksListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(flocksFilterProvider);
    final chips = ['Tous', 'Repro', 'Pondeuse', 'Chair', 'Caille'];
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

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
              child: teamId == null
                  ? Center(
                      child: Text(
                        'Aucune equipe configuree',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textMeta,
                        ),
                      ),
                    )
                  : _FlocksList(teamId: teamId, filter: filter),
            ),
          ],
        ),
      ),
    );
  }
}

class _FlocksList extends ConsumerWidget {
  final String teamId;
  final String filter;

  const _FlocksList({required this.teamId, required this.filter});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flocksAsync = ref.watch(flockListProvider(teamId));

    return flocksAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les lots',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => ref.invalidate(flockListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (allFlocks) {
        final filtered = allFlocks.where((f) {
          if (filter == 'Tous') return true;
          return f.typeLabel == filter;
        }).toList();

        if (filtered.isEmpty) {
          return Center(
            child: Text(
              'Aucun lot trouve',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(flockListProvider(teamId));
          },
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
                          color: _dotColor(f),
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
                              '${f.currentTotal} sujets \u00b7 ${f.typeLabel}',
                              style: TextStyle(
                                fontSize: 11,
                                color: AppColors.textMeta,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Right: status chip
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            _keyLabel(f),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: _keyColor(f),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: f.isActive
                                  ? AppColors.primary
                                      .withValues(alpha: 0.12)
                                  : AppColors.night
                                      .withValues(alpha: 0.06),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              f.isActive ? 'Actif' : 'Termine',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: f.isActive
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
        );
      },
    );
  }

  Color _dotColor(Flock f) {
    return switch (f.type) {
      'LAYER' => AppColors.warning,
      'BROILER' => AppColors.info,
      'BREEDER' => AppColors.primary,
      'QUAIL' => AppColors.gold,
      _ => AppColors.primary,
    };
  }

  String _keyLabel(Flock f) {
    if (!f.isActive) return 'Cloture';
    if (f.isBroiler) return 'J-${f.ageInDays}';
    return '${f.currentTotal} sujets';
  }

  Color _keyColor(Flock f) {
    if (!f.isActive) return AppColors.grey500;
    if (f.isBroiler) return AppColors.warning;
    return AppColors.primary;
  }
}
