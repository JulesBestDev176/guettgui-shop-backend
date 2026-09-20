import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class ProtocolListScreen extends StatelessWidget {
  const ProtocolListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final protocols = [
      _ProtocolData(
        'Protocole Chair',
        'Poulets de chair',
        [
          _VaccineStep('Newcastle', 'J7', 'Eau de boisson'),
          _VaccineStep('Gumboro', 'J14', 'Eau de boisson'),
          _VaccineStep('Newcastle rappel', 'J21', 'Eau de boisson'),
          _VaccineStep('Gumboro rappel', 'J28', 'Eau de boisson'),
        ],
      ),
      _ProtocolData(
        'Protocole Pondeuses',
        'Pondeuses',
        [
          _VaccineStep('Newcastle', 'J7', 'Eau de boisson'),
          _VaccineStep('Gumboro', 'J14', 'Eau de boisson'),
          _VaccineStep('Newcastle rappel', 'Trimestriel', 'Injection'),
          _VaccineStep('Gumboro rappel', 'Trimestriel', 'Injection'),
        ],
      ),
      _ProtocolData(
        'Protocole Reproducteurs',
        'Reproducteurs',
        [
          _VaccineStep('Newcastle', 'J7', 'Eau de boisson'),
          _VaccineStep('Gumboro', 'J14', 'Eau de boisson'),
          _VaccineStep('Newcastle rappel', 'Trimestriel', 'Injection'),
          _VaccineStep('Gumboro rappel', 'Trimestriel', 'Injection'),
        ],
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.protocols)),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        onPressed: () => context.push(AppRoutes.createProtocol),
        child: const Icon(Icons.add),
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: ListView.builder(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.screenPadding,
          itemCount: protocols.length,
          itemBuilder: (context, index) {
            final protocol = protocols[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space12),
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
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                protocol.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                protocol.type,
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
                    const SizedBox(height: AppDimensions.space12),
                    const Divider(height: 1, color: AppColors.grey200),
                    const SizedBox(height: AppDimensions.space8),
                    ...protocol.steps.map(
                      (step) => Padding(
                        padding: const EdgeInsets.only(
                          bottom: AppDimensions.space6,
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: AppDimensions.space4),
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: AppDimensions.space8),
                            Expanded(
                              child: Text(
                                step.name,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            Text(
                              step.day,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(width: AppDimensions.space12),
                            Text(
                              step.mode,
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
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _ProtocolData {
  final String name;
  final String type;
  final List<_VaccineStep> steps;

  const _ProtocolData(this.name, this.type, this.steps);
}

class _VaccineStep {
  final String name;
  final String day;
  final String mode;

  const _VaccineStep(this.name, this.day, this.mode);
}
