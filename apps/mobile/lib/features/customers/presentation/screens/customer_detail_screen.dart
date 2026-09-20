import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/features/customers/presentation/providers/customer_provider.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class CustomerDetailScreen extends ConsumerWidget {
  final String customerId;

  const CustomerDetailScreen({super.key, required this.customerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    if (teamId == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(title: const Text('Detail client')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final customerAsync = ref.watch(
      customerDetailProvider((teamId: teamId, customerId: customerId)),
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Detail client')),
      body: customerAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Impossible de charger le client',
                style: TextStyle(fontSize: 13, color: AppColors.textMeta),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => ref.invalidate(
                  customerDetailProvider(
                    (teamId: teamId, customerId: customerId),
                  ),
                ),
                child: const Text('Reessayer'),
              ),
            ],
          ),
        ),
        data: (customer) => RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            ref.invalidate(
              customerDetailProvider(
                (teamId: teamId, customerId: customerId),
              ),
            );
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: AppDimensions.screenPadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // --- Infos client ---
                GGCard(
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          customer.firstName.isNotEmpty
                              ? customer.firstName[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space12),
                      Text(
                        customer.fullName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (customer.address != null)
                        Text(
                          customer.address!,
                          style:
                              const TextStyle(color: AppColors.grey600),
                        ),
                      const SizedBox(height: AppDimensions.space12),
                      if (customer.phone != null)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.phone,
                              size: 16,
                              color: AppColors.grey500,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              customer.phone!,
                              style: const TextStyle(
                                  color: AppColors.grey600),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.space16),

                // --- Solde creances ---
                if (customer.hasDebt)
                  GGCard(
                    backgroundColor: AppColors.warningLight,
                    child: Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          AppStrings.outstandingDebt,
                          style:
                              TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          Formatters.xof(customer.totalDebt),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.warning,
                          ),
                        ),
                      ],
                    ),
                  ),
                if (customer.hasDebt)
                  const SizedBox(height: AppDimensions.space20),

                // --- Total achats ---
                if (customer.totalPurchases > 0) ...[
                  const Text(
                    AppStrings.purchaseHistory,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  GGCard(
                    child: Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total achats',
                          style:
                              TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          Formatters.xof(customer.totalPurchases),
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                if (customer.notes != null &&
                    customer.notes!.isNotEmpty) ...[
                  const SizedBox(height: AppDimensions.space20),
                  const Text(
                    'Notes',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space8),
                  GGCard(
                    child: Text(
                      customer.notes!,
                      style: const TextStyle(
                          color: AppColors.grey600),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
