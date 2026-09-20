import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:printing/printing.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/core/utils/csv_exporter.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/core/utils/pdf_generator.dart';
import 'package:guettgui_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';
import 'package:guettgui_mobile/features/finances/presentation/providers/finance_provider.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class FinancialReportScreen extends ConsumerWidget {
  const FinancialReportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.financialReport),
        actions: [
          if (teamId != null)
            PopupMenuButton<String>(
              icon: const Icon(Icons.more_vert),
              onSelected: (value) {
                switch (value) {
                  case 'pdf':
                    _exportPdf(context, ref, teamId);
                  case 'csv_sales':
                    _exportCsvSales(context, ref, teamId);
                  case 'csv_expenses':
                    _exportCsvExpenses(context, ref, teamId);
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'pdf',
                  child: Row(
                    children: [
                      Icon(Icons.picture_as_pdf,
                          color: AppColors.error, size: 20),
                      SizedBox(width: 12),
                      Text('Exporter PDF'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'csv_sales',
                  child: Row(
                    children: [
                      Icon(Icons.table_chart,
                          color: AppColors.primary, size: 20),
                      SizedBox(width: 12),
                      Text('Exporter ventes CSV'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'csv_expenses',
                  child: Row(
                    children: [
                      Icon(Icons.table_chart,
                          color: AppColors.warning, size: 20),
                      SizedBox(width: 12),
                      Text('Exporter depenses CSV'),
                    ],
                  ),
                ),
              ],
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
          : _ReportBody(teamId: teamId),
    );
  }

  Future<void> _exportPdf(
      BuildContext context, WidgetRef ref, String teamId) async {
    final summaryAsync = ref.read(financialSummaryProvider(teamId));
    final summary = summaryAsync.valueOrNull;
    if (summary == null) return;

    final user = ref.read(authStateProvider).user;
    final margin = summary.totalRevenue > 0
        ? (summary.netProfit / summary.totalRevenue * 100)
        : 0.0;

    final pdfBytes = await PdfGenerator.generateMonthlyReport(
      farmName: user?.teamName ?? 'Ferme',
      month: DateTime(DateTime.now().year, DateTime.now().month),
      financials: {
        'totalRevenue': summary.totalRevenue,
        'totalExpenses': summary.totalExpenses,
        'netResult': summary.netProfit,
        'margin': margin,
        'revenueByProduct': summary.revenueByProduct.entries
            .map((e) => {'product': e.key, 'amount': e.value})
            .toList(),
        'expensesByCategory': summary.expensesByCategory.entries
            .map((e) => {'category': e.key, 'amount': e.value})
            .toList(),
      },
      production: const {},
      stocks: const {},
    );

    if (context.mounted) {
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename: 'rapport_financier_guettgui.pdf',
      );
      if (context.mounted) {
        context.showSuccessSnackBar('Rapport PDF partage.');
      }
    }
  }

  Future<void> _exportCsvSales(
      BuildContext context, WidgetRef ref, String teamId) async {
    final salesAsync = ref.read(saleListProvider(teamId));
    final sales = salesAsync.valueOrNull ?? [];

    if (sales.isEmpty) {
      context.showSuccessSnackBar('Aucune vente a exporter.');
      return;
    }

    final csv = CsvExporter.exportSales(sales);
    await Printing.sharePdf(
      bytes: _stringToBytes(csv),
      filename: 'ventes_guettgui.csv',
    );
    if (context.mounted) {
      context.showSuccessSnackBar('Export CSV des ventes genere.');
    }
  }

  Future<void> _exportCsvExpenses(
      BuildContext context, WidgetRef ref, String teamId) async {
    final expensesAsync = ref.read(expenseListProvider(teamId));
    final expenses = expensesAsync.valueOrNull ?? [];

    if (expenses.isEmpty) {
      context.showSuccessSnackBar('Aucune depense a exporter.');
      return;
    }

    final csv = CsvExporter.exportExpenses(expenses);
    await Printing.sharePdf(
      bytes: _stringToBytes(csv),
      filename: 'depenses_guettgui.csv',
    );
    if (context.mounted) {
      context.showSuccessSnackBar('Export CSV des depenses genere.');
    }
  }

  static Uint8List _stringToBytes(String s) =>
      Uint8List.fromList(s.codeUnits);
}

class _ReportBody extends ConsumerWidget {
  final String teamId;

  const _ReportBody({required this.teamId});

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
              'Impossible de charger le rapport',
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
      data: (summary) => _ReportContent(summary: summary),
    );
  }
}

class _ReportContent extends StatelessWidget {
  final FinancialSummary summary;

  const _ReportContent({required this.summary});

  @override
  Widget build(BuildContext context) {
    final margin = summary.totalRevenue > 0
        ? (summary.netProfit / summary.totalRevenue * 100)
            .toStringAsFixed(1)
        : '0.0';

    return SingleChildScrollView(
      padding: AppDimensions.screenPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GGCard(
            child: Column(
              children: [
                _ReportRow(
                  'Total revenus',
                  Formatters.xof(summary.totalRevenue),
                  AppColors.success,
                ),
                _ReportRow(
                  'Total depenses',
                  Formatters.xof(summary.totalExpenses),
                  AppColors.error,
                ),
                const Divider(),
                _ReportRow(
                  'Resultat net',
                  Formatters.xof(summary.netProfit),
                  AppColors.primary,
                ),
                _ReportRow('Marge', '$margin%', AppColors.primary),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.space20),

          if (summary.revenueByProduct.isNotEmpty) ...[
            const Text(
              'Revenus par produit',
              style:
                  TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppDimensions.space12),
            ...summary.revenueByProduct.entries.map(
              (e) => _BarItem(
                e.key,
                e.value.toInt(),
                summary.totalRevenue.toInt(),
              ),
            ),
            const SizedBox(height: AppDimensions.space20),
          ],

          if (summary.expensesByCategory.isNotEmpty) ...[
            const Text(
              'Depenses par categorie',
              style:
                  TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppDimensions.space12),
            ...summary.expensesByCategory.entries.map(
              (e) => _BarItem(
                e.key,
                e.value.toInt(),
                summary.totalExpenses.toInt(),
                isExpense: true,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ReportRow extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _ReportRow(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppDimensions.space6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(color: AppColors.grey600)),
          Text(
            value,
            style:
                TextStyle(fontWeight: FontWeight.w700, color: color),
          ),
        ],
      ),
    );
  }
}

class _BarItem extends StatelessWidget {
  final String label;
  final int amount;
  final int total;
  final bool isExpense;

  const _BarItem(
    this.label,
    this.amount,
    this.total, {
    this.isExpense = false,
  });

  @override
  Widget build(BuildContext context) {
    final percent = total > 0 ? amount / total : 0.0;
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDimensions.space12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.grey700,
                ),
              ),
              Text(
                Formatters.xofShort(amount),
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color:
                      isExpense ? AppColors.error : AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.space4),
          ClipRRect(
            borderRadius:
                BorderRadius.circular(AppDimensions.radiusFull),
            child: LinearProgressIndicator(
              value: percent.clamp(0.0, 1.0),
              backgroundColor: AppColors.grey200,
              color:
                  isExpense ? AppColors.error : AppColors.success,
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}
