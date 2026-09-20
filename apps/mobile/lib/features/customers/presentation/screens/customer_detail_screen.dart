import 'package:flutter/material.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class CustomerDetailScreen extends StatelessWidget {
  final String customerId;

  const CustomerDetailScreen({super.key, required this.customerId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Detail client')),
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
              // --- Infos client ---
              GGCard(
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 36,
                      backgroundColor: AppColors.primaryLight,
                      child: Icon(
                        Icons.person,
                        size: 40,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    const Text(
                      'Amadou Diop',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Text(
                      'Particulier - Thies',
                      style: TextStyle(color: AppColors.grey600),
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.phone,
                          size: 16,
                          color: AppColors.grey500,
                        ),
                        SizedBox(width: 4),
                        Text(
                          '+221 77 123 45 67',
                          style: TextStyle(color: AppColors.grey600),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.space16),

              // --- Solde creances ---
              GGCard(
                backgroundColor: AppColors.warningLight,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      AppStrings.outstandingDebt,
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    Text(
                      Formatters.xof(35000),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.warning,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.space20),

              // --- Historique achats ---
              const Text(
                AppStrings.purchaseHistory,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: AppDimensions.space12),
              ...List.generate(
                5,
                (i) => Padding(
                  padding: const EdgeInsets.only(
                    bottom: AppDimensions.space8,
                  ),
                  child: GGCard(
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.successLight,
                            borderRadius: BorderRadius.circular(
                              AppDimensions.radiusSm,
                            ),
                          ),
                          child: const Icon(
                            Icons.shopping_cart,
                            color: AppColors.success,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: AppDimensions.space12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Poussins x ${(i + 1) * 10}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Il y a ${(i + 1) * 7} jours',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.grey500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          Formatters.xofShort((i + 1) * 25000),
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
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
}
