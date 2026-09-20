import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/customers/presentation/providers/customer_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class CustomersListScreen extends ConsumerWidget {
  const CustomersListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.customers)),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        onPressed: () => context.push(AppRoutes.createCustomer),
        child: const Icon(Icons.add),
      ),
      body: teamId == null
          ? Center(
              child: Text(
                'Aucune equipe configuree',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
            )
          : _CustomersList(teamId: teamId),
    );
  }
}

class _CustomersList extends ConsumerWidget {
  final String teamId;

  const _CustomersList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final customersAsync = ref.watch(customerListProvider(teamId));

    return customersAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger les clients',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(customerListProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (customers) {
        if (customers.isEmpty) {
          return Center(
            child: Text(
              'Aucun client enregistre',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(customerListProvider(teamId));
          },
          child: ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            itemCount: customers.length,
            itemBuilder: (context, index) {
              final customer = customers[index];

              return Padding(
                padding:
                    const EdgeInsets.only(bottom: AppDimensions.space8),
                child: GGCard(
                  onTap: () =>
                      context.push('/customers/${customer.id}'),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          customer.firstName.isNotEmpty
                              ? customer.firstName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              customer.fullName,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            if (customer.phone != null)
                              Text(
                                customer.phone!,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.grey500,
                                ),
                              ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.chevron_right,
                        color: AppColors.grey400,
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
}
