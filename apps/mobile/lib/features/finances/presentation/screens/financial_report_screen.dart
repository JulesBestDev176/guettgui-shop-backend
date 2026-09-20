import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:printing/printing.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/utils/csv_exporter.dart';
import 'package:guettgui_mobile/core/utils/formatters.dart';
import 'package:guettgui_mobile/core/utils/pdf_generator.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class FinancialReportScreen extends StatelessWidget {
  const FinancialReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(AppStrings.financialReport),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              switch (value) {
                case 'pdf':
                  _exportPdf(context);
                case 'csv_sales':
                  _exportCsvSales(context);
                case 'csv_expenses':
                  _exportCsvExpenses(context);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'pdf',
                child: Row(
                  children: [
                    Icon(Icons.picture_as_pdf, color: AppColors.error, size: 20),
                    SizedBox(width: 12),
                    Text('Exporter PDF'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'csv_sales',
                child: Row(
                  children: [
                    Icon(Icons.table_chart, color: AppColors.primary, size: 20),
                    SizedBox(width: 12),
                    Text('Exporter ventes CSV'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'csv_expenses',
                child: Row(
                  children: [
                    Icon(Icons.table_chart, color: AppColors.warning, size: 20),
                    SizedBox(width: 12),
                    Text('Exporter depenses CSV'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GGCard(
              child: Column(
                children: [
                  _ReportRow(
                    'Total revenus',
                    Formatters.xof(2450000),
                    AppColors.success,
                  ),
                  _ReportRow(
                    'Total depenses',
                    Formatters.xof(1600000),
                    AppColors.error,
                  ),
                  const Divider(),
                  _ReportRow(
                    'Resultat net',
                    Formatters.xof(850000),
                    AppColors.primary,
                  ),
                  _ReportRow('Marge', '34.7%', AppColors.primary),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space16),

            // Export buttons row
            Row(
              children: [
                Expanded(
                  child: _ExportButton(
                    icon: Icons.picture_as_pdf,
                    label: 'Exporter PDF',
                    color: AppColors.error,
                    onTap: () => _exportPdf(context),
                  ),
                ),
                const SizedBox(width: AppDimensions.space12),
                Expanded(
                  child: _ExportButton(
                    icon: Icons.table_chart,
                    label: 'Exporter CSV',
                    color: AppColors.primary,
                    onTap: () => _exportCsvSales(context),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppDimensions.space20),

            const Text(
              'Revenus par produit',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppDimensions.space12),
            _BarItem('Poussins', 1200000, 2450000),
            _BarItem('Oeufs', 750000, 2450000),
            _BarItem('Poulets', 500000, 2450000),
            const SizedBox(height: AppDimensions.space20),

            const Text(
              'Depenses par categorie',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppDimensions.space12),
            _BarItem('Alimentation', 800000, 1600000, isExpense: true),
            _BarItem('Main d\'oeuvre', 300000, 1600000, isExpense: true),
            _BarItem('Sante', 200000, 1600000, isExpense: true),
            _BarItem('Equipement', 150000, 1600000, isExpense: true),
            _BarItem('Autre', 150000, 1600000, isExpense: true),
          ],
        ),
      ),
    );
  }

  Future<void> _exportPdf(BuildContext context) async {
    final pdfBytes = await PdfGenerator.generateMonthlyReport(
      farmName: 'Elevage Diop',
      month: DateTime(DateTime.now().year, DateTime.now().month),
      financials: {
        'totalRevenue': 2450000,
        'totalExpenses': 1600000,
        'netResult': 850000,
        'margin': 34.7,
        'revenueByProduct': <Map<String, dynamic>>[
          {'product': 'Poussins', 'amount': 1200000},
          {'product': 'Oeufs', 'amount': 750000},
          {'product': 'Poulets', 'amount': 500000},
        ],
        'expensesByCategory': <Map<String, dynamic>>[
          {'category': 'Alimentation', 'amount': 800000},
          {'category': 'Sante', 'amount': 200000},
          {'category': 'Main d\'oeuvre', 'amount': 300000},
          {'category': 'Equipement', 'amount': 150000},
          {'category': 'Autre', 'amount': 150000},
        ],
      },
      production: {
        'totalEggs': 2760,
        'avgLayingRate': 66,
        'totalMortality': 12,
        'chicksHatched': 180,
      },
      stocks: {
        'items': <Map<String, dynamic>>[
          {'name': 'Aliment ponte', 'quantity': 120, 'unit': 'kg'},
          {'name': 'Aliment croissance', 'quantity': 85, 'unit': 'kg'},
        ],
      },
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

  void _exportCsvSales(BuildContext context) {
    final sales = [
      Sale(
        id: '1',
        productType: 'CHICKS',
        quantity: 50,
        unitPrice: 500,
        totalAmount: 25000,
        paidAmount: 25000,
        paymentStatus: 'PAID',
        customerName: 'Diop',
        date: DateTime.now(),
        teamId: 't1',
        recordedById: 'u1',
        createdAt: DateTime.now(),
      ),
      Sale(
        id: '2',
        productType: 'TABLE_EGGS',
        quantity: 5,
        unitPrice: 3000,
        totalAmount: 15000,
        paidAmount: 10000,
        paymentStatus: 'PARTIAL',
        customerName: 'Fall',
        date: DateTime.now().subtract(const Duration(days: 1)),
        teamId: 't1',
        recordedById: 'u1',
        createdAt: DateTime.now(),
      ),
    ];

    final csv = CsvExporter.exportSales(sales);
    Printing.sharePdf(
      bytes: _stringToBytes(csv),
      filename: 'ventes_guettgui.csv',
    );
    context.showSuccessSnackBar('Export CSV des ventes genere.');
  }

  void _exportCsvExpenses(BuildContext context) {
    final expenses = [
      Expense(
        id: '1',
        category: 'ALIMENTATION',
        amount: 50000,
        description: 'Aliment ponte 50kg',
        date: DateTime.now(),
        teamId: 't1',
        recordedById: 'u1',
        createdAt: DateTime.now(),
      ),
      Expense(
        id: '2',
        category: 'SANTE',
        amount: 15000,
        description: 'Vaccin Newcastle',
        date: DateTime.now().subtract(const Duration(days: 2)),
        teamId: 't1',
        recordedById: 'u1',
        createdAt: DateTime.now(),
      ),
    ];

    final csv = CsvExporter.exportExpenses(expenses);
    Printing.sharePdf(
      bytes: _stringToBytes(csv),
      filename: 'depenses_guettgui.csv',
    );
    context.showSuccessSnackBar('Export CSV des depenses genere.');
  }

  static Uint8List _stringToBytes(String s) =>
      Uint8List.fromList(s.codeUnits);
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
          Text(label, style: const TextStyle(color: AppColors.grey600)),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.w700, color: color),
          ),
        ],
      ),
    );
  }
}

class _ExportButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ExportButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GGCard(
      onTap: onTap,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: AppDimensions.space8),
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: color,
            ),
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
                  color: isExpense ? AppColors.error : AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.space4),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
            child: LinearProgressIndicator(
              value: percent,
              backgroundColor: AppColors.grey200,
              color: isExpense ? AppColors.error : AppColors.success,
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}
