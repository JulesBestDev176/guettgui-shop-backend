import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';

final _finTabProvider = StateProvider<String>((ref) => 'Resume');

/// Finances: tabs chips Resume/Depenses/Ventes/Creances
class FinancesScreen extends ConsumerWidget {
  const FinancesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeTab = ref.watch(_finTabProvider);
    final tabs = ['Resume', 'Depenses', 'Ventes', 'Creances'];

    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px: title + report icon
            SizedBox(
              height: 48,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Text(
                      'Finances',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => context.push(AppRoutes.financialReport),
                      child: const Icon(Icons.assessment_outlined,
                          size: 22, color: AppColors.night),
                    ),
                  ],
                ),
              ),
            ),

            // Filter chips
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
                itemCount: tabs.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final t = tabs[index];
                  final isActive = activeTab == t;
                  return GestureDetector(
                    onTap: () =>
                        ref.read(_finTabProvider.notifier).state = t,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: isActive
                            ? AppColors.primary.withValues(alpha: 0.12)
                            : AppColors.night.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        t,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight:
                              isActive ? FontWeight.w600 : FontWeight.w500,
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

            // Content
            Expanded(
              child: activeTab == 'Resume'
                  ? _ResumeContent()
                  : _ListContent(tab: activeTab),
            ),
          ],
        ),
      ),
    );
  }
}

class _ResumeContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 110),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Summary card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Column(
              children: [
                _SummaryRow('Revenus', '2 450 000', AppColors.night),
                const SizedBox(height: 10),
                _SummaryRow('Depenses', '1 380 000', AppColors.night),
                const SizedBox(height: 10),
                Container(
                  height: 1,
                  color: AppColors.night.withValues(alpha: 0.06),
                ),
                const SizedBox(height: 10),
                _SummaryRow('Resultat net', '1 070 000', AppColors.primary),
                const SizedBox(height: 10),
                _SummaryRow('Marge', '43,7 %', AppColors.primary),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Revenus par produit
          const Text(
            'Revenus par produit',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.night,
            ),
          ),
          const SizedBox(height: 12),
          _ProgressBar('Oeufs de table', '1 420 000', 0.78, AppColors.primary),
          const SizedBox(height: 12),
          _ProgressBar(
              'Poulets de chair', '760 000', 0.42, AppColors.primary),
          const SizedBox(height: 12),
          _ProgressBar('Poussins', '270 000', 0.15, AppColors.primary),
          const SizedBox(height: 24),

          // Depenses par categorie
          const Text(
            'Depenses par categorie',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.night,
            ),
          ),
          const SizedBox(height: 12),
          _ProgressBar('Aliment', '840 000', 0.72, AppColors.tealDark),
          const SizedBox(height: 12),
          _ProgressBar('Veterinaire', '310 000', 0.34, AppColors.tealDark),
          const SizedBox(height: 12),
          _ProgressBar("Main d'oeuvre", '230 000', 0.25, AppColors.tealDark),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final Color valueColor;

  const _SummaryRow(this.label, this.value, this.valueColor);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: valueColor,
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
      ],
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final String label;
  final String value;
  final double pct;
  final Color color;

  const _ProgressBar(this.label, this.value, this.pct, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            Text(
              value,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.night,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Container(
          height: 6,
          decoration: BoxDecoration(
            color: AppColors.night.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(3),
          ),
          child: Align(
            alignment: Alignment.centerLeft,
            child: FractionallySizedBox(
              widthFactor: pct,
              child: Container(
                height: 6,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Generic finance list content (Depenses / Ventes / Creances)
class _ListContent extends StatelessWidget {
  final String tab;

  const _ListContent({required this.tab});

  @override
  Widget build(BuildContext context) {
    final rows = _getRows(tab);
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 110),
      itemCount: rows.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final r = rows[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: r.bg,
                  shape: BoxShape.circle,
                ),
                child: Icon(r.icon, size: 16, color: r.color),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      r.title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      r.sub,
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textMeta,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    r.amount,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: r.color,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                  Text(
                    r.date,
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textMeta,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  List<_FinRow> _getRows(String tab) {
    switch (tab) {
      case 'Depenses':
        return const [
          _FinRow(Icons.local_shipping_outlined, AppColors.error,
              Color(0x1AD32F2F), 'Aliment ponte 2', '10 sacs', '-145 000', '29 aout'),
          _FinRow(Icons.vaccines_outlined, AppColors.error,
              Color(0x1AD32F2F), 'Vaccins', 'Newcastle + Gumboro', '-62 000', '26 aout'),
          _FinRow(Icons.build_outlined, AppColors.error,
              Color(0x1AD32F2F), 'Reparation abreuvoirs', 'Poulailler 2', '-18 000', '22 aout'),
        ];
      case 'Ventes':
        return const [
          _FinRow(Icons.egg_outlined, AppColors.primary,
              Color(0x1A2EA831), 'Oeufs de table', 'Fatou Sow \u00b7 30 plateaux', '+180 000', '28 aout'),
          _FinRow(Icons.pets_outlined, AppColors.primary,
              Color(0x1A2EA831), 'Poulets de chair', 'Ibrahima Ba \u00b7 40 sujets', '+240 000', '25 aout'),
          _FinRow(Icons.egg_outlined, AppColors.primary,
              Color(0x1A2EA831), 'Oeufs de table', 'Keur Massar \u00b7 15 plateaux', '+90 000', '21 aout'),
        ];
      case 'Creances':
        return const [
          _FinRow(Icons.schedule_outlined, AppColors.error,
              Color(0x1AD32F2F), 'Fatou Sow', 'Echeance depassee \u00b7 12 j', '85 000', '18 aout'),
          _FinRow(Icons.schedule_outlined, AppColors.warning,
              Color(0x1AF57F17), 'Boutique Keur Massar', 'Echeance 5 sept', '24 000', '25 aout'),
        ];
      default:
        return [];
    }
  }
}

class _FinRow {
  final IconData icon;
  final Color color;
  final Color bg;
  final String title;
  final String sub;
  final String amount;
  final String date;

  const _FinRow(
      this.icon, this.color, this.bg, this.title, this.sub, this.amount, this.date);
}
