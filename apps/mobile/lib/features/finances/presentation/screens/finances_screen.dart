import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/router/app_router.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/features/finances/presentation/providers/finance_provider.dart';
import 'package:intl/intl.dart';

final _finTabProvider = StateProvider<String>((ref) => 'Resume');

/// Finances: tabs chips Resume/Depenses/Ventes/Creances
class FinancesScreen extends ConsumerWidget {
  const FinancesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeTab = ref.watch(_finTabProvider);
    final tabs = ['Resume', 'Depenses', 'Ventes', 'Creances'];
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

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
                  : activeTab == 'Resume'
                      ? _ResumeContent(teamId: teamId)
                      : _ListContent(tab: activeTab, teamId: teamId),
            ),
          ],
        ),
      ),
    );
  }
}

class _ResumeContent extends ConsumerWidget {
  final String teamId;

  const _ResumeContent({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summaryAsync = ref.watch(financialSummaryProvider(teamId));

    return summaryAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Impossible de charger le resume',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () =>
                  ref.invalidate(financialSummaryProvider(teamId)),
              child: const Text('Reessayer'),
            ),
          ],
        ),
      ),
      data: (summary) => _ResumeBody(summary: summary),
    );
  }
}

class _ResumeBody extends StatelessWidget {
  final FinancialSummary summary;

  const _ResumeBody({required this.summary});

  String _fmt(num value) => NumberFormat('#,###', 'fr_FR').format(value);

  @override
  Widget build(BuildContext context) {
    final margin = summary.totalRevenue > 0
        ? (summary.netProfit / summary.totalRevenue * 100).toStringAsFixed(1)
        : '0.0';

    final maxRevenue = summary.revenueByProduct.values.fold<num>(
        1, (a, b) => a > b ? a : b);
    final maxExpense = summary.expensesByCategory.values.fold<num>(
        1, (a, b) => a > b ? a : b);

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
                _SummaryRow('Revenus', _fmt(summary.totalRevenue), AppColors.night),
                const SizedBox(height: 10),
                _SummaryRow('Depenses', _fmt(summary.totalExpenses), AppColors.night),
                const SizedBox(height: 10),
                Container(
                  height: 1,
                  color: AppColors.night.withValues(alpha: 0.06),
                ),
                const SizedBox(height: 10),
                _SummaryRow('Resultat net', _fmt(summary.netProfit), AppColors.primary),
                const SizedBox(height: 10),
                _SummaryRow('Marge', '$margin %', AppColors.primary),
              ],
            ),
          ),
          const SizedBox(height: 24),

          if (summary.revenueByProduct.isNotEmpty) ...[
            const Text(
              'Revenus par produit',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.night,
              ),
            ),
            const SizedBox(height: 12),
            ...summary.revenueByProduct.entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _ProgressBar(
                    e.key,
                    _fmt(e.value),
                    maxRevenue > 0 ? (e.value / maxRevenue).toDouble() : 0,
                    AppColors.primary,
                  ),
                )),
            const SizedBox(height: 12),
          ],

          if (summary.expensesByCategory.isNotEmpty) ...[
            const Text(
              'Depenses par categorie',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.night,
              ),
            ),
            const SizedBox(height: 12),
            ...summary.expensesByCategory.entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _ProgressBar(
                    e.key,
                    _fmt(e.value),
                    maxExpense > 0 ? (e.value / maxExpense).toDouble() : 0,
                    AppColors.tealDark,
                  ),
                )),
          ],
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
              widthFactor: pct.clamp(0.0, 1.0),
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

/// Finance list content using API data (Depenses / Ventes / Creances)
class _ListContent extends ConsumerWidget {
  final String tab;
  final String teamId;

  const _ListContent({required this.tab, required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (tab == 'Depenses') {
      return _ExpensesList(teamId: teamId);
    } else if (tab == 'Ventes') {
      return _SalesList(teamId: teamId, showDebts: false);
    } else {
      // Creances
      return _SalesList(teamId: teamId, showDebts: true);
    }
  }
}

class _ExpensesList extends ConsumerWidget {
  final String teamId;

  const _ExpensesList({required this.teamId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expensesAsync = ref.watch(expenseListProvider(teamId));

    return expensesAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, __) => Center(
        child: Text(
          'Impossible de charger les depenses',
          style: TextStyle(fontSize: 13, color: AppColors.textMeta),
        ),
      ),
      data: (expenses) {
        if (expenses.isEmpty) {
          return Center(
            child: Text(
              'Aucune depense enregistree',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 110),
          itemCount: expenses.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final e = expenses[index];
            return _FinanceRow(
              icon: _categoryIcon(e.category),
              color: AppColors.error,
              bg: const Color(0x1AD32F2F),
              title: e.category,
              sub: e.description ?? '',
              amount: '-${_fmt(e.amount)}',
              date: _formatDate(e.date),
            );
          },
        );
      },
    );
  }

  IconData _categoryIcon(String cat) {
    final lower = cat.toLowerCase();
    if (lower.contains('aliment') || lower.contains('feed')) {
      return Icons.local_shipping_outlined;
    }
    if (lower.contains('vaccin') || lower.contains('vet')) {
      return Icons.vaccines_outlined;
    }
    return Icons.receipt_outlined;
  }
}

class _SalesList extends ConsumerWidget {
  final String teamId;
  final bool showDebts;

  const _SalesList({required this.teamId, required this.showDebts});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final salesAsync = ref.watch(saleListProvider(teamId));

    return salesAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, __) => Center(
        child: Text(
          'Impossible de charger les ventes',
          style: TextStyle(fontSize: 13, color: AppColors.textMeta),
        ),
      ),
      data: (sales) {
        final filtered = showDebts
            ? sales.where((s) => s.hasDebt).toList()
            : sales;

        if (filtered.isEmpty) {
          return Center(
            child: Text(
              showDebts
                  ? 'Aucune creance en cours'
                  : 'Aucune vente enregistree',
              style: TextStyle(fontSize: 13, color: AppColors.textMeta),
            ),
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 110),
          itemCount: filtered.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final s = filtered[index];
            if (showDebts) {
              return _FinanceRow(
                icon: Icons.schedule_outlined,
                color: AppColors.error,
                bg: const Color(0x1AD32F2F),
                title: s.customerName ?? 'Client',
                sub: '${s.productType} \u00b7 ${s.quantity} unites',
                amount: _fmt(s.remainingAmount),
                date: _formatDate(s.date),
              );
            }
            return _FinanceRow(
              icon: _productIcon(s.productType),
              color: AppColors.primary,
              bg: const Color(0x1A2EA831),
              title: s.productType,
              sub:
                  '${s.customerName ?? 'Client'} \u00b7 ${s.quantity} unites',
              amount: '+${_fmt(s.totalAmount)}',
              date: _formatDate(s.date),
            );
          },
        );
      },
    );
  }

  IconData _productIcon(String product) {
    final lower = product.toLowerCase();
    if (lower.contains('oeuf') || lower.contains('egg')) {
      return Icons.egg_outlined;
    }
    if (lower.contains('poulet') || lower.contains('chair')) {
      return Icons.pets_outlined;
    }
    return Icons.sell_outlined;
  }
}

class _FinanceRow extends StatelessWidget {
  final IconData icon;
  final Color color;
  final Color bg;
  final String title;
  final String sub;
  final String amount;
  final String date;

  const _FinanceRow({
    required this.icon,
    required this.color,
    required this.bg,
    required this.title,
    required this.sub,
    required this.amount,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
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
              color: bg,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 16, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.night,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  sub,
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
                amount,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: color,
                  fontFeatures: const [FontFeature.tabularFigures()],
                ),
              ),
              Text(
                date,
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
  }
}

String _fmt(num value) => NumberFormat('#,###', 'fr_FR').format(value);

String _formatDate(DateTime date) {
  return DateFormat('d MMM', 'fr_FR').format(date);
}
