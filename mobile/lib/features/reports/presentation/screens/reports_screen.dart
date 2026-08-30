import 'package:flutter/material.dart';
import 'package:printing/printing.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/constants/app_dimensions.dart';
import 'package:guettgui_mobile/core/constants/app_strings.dart';
import 'package:guettgui_mobile/core/utils/pdf_generator.dart';
import 'package:guettgui_mobile/shared/extensions/context_extensions.dart';
import 'package:guettgui_mobile/shared/widgets/gg_card.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.reports)),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            )
          : ListView(
              padding: AppDimensions.screenPadding,
              children: [
                _ReportTypeCard(
                  icon: Icons.today,
                  title: AppStrings.dailyReport,
                  description:
                      'Ponte, mortalite, alimentation et ventes du jour.',
                  color: AppColors.primary,
                  onTap: () => _generateAndShareDaily(),
                ),
                const SizedBox(height: AppDimensions.space12),
                _ReportTypeCard(
                  icon: Icons.view_week,
                  title: AppStrings.weeklyReport,
                  description:
                      'Tableau de bord : objectif vs reel sur 7 jours.',
                  color: AppColors.info,
                  onTap: () => _generateAndShareWeekly(),
                ),
                const SizedBox(height: AppDimensions.space12),
                _ReportTypeCard(
                  icon: Icons.calendar_month,
                  title: AppStrings.monthlyReport,
                  description:
                      'Bilan financier, production et stocks du mois.',
                  color: AppColors.warning,
                  onTap: () => _generateAndShareMonthly(),
                ),
                const SizedBox(height: AppDimensions.space12),
                _ReportTypeCard(
                  icon: Icons.pets,
                  title: AppStrings.flockReport,
                  description:
                      'Rapport complet d\'un lot : effectif, mortalite, couts, marge.',
                  color: AppColors.typeGoliath,
                  onTap: () => _generateAndShareFlock(),
                ),
              ],
            ),
    );
  }

  Future<void> _generateAndShareDaily() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2024),
      lastDate: DateTime.now(),
      locale: const Locale('fr'),
    );
    if (picked == null || !mounted) return;

    setState(() => _isLoading = true);

    final pdfBytes = await PdfGenerator.generateDailyReport(
      farmName: 'Elevage Diop',
      date: picked,
      stats: {
        'eggsLaid': 92,
        'eggsCollected': 89,
        'eggsBroken': 3,
        'layingRate': 66,
        'mortalityCount': 1,
        'mortalityCause': 'Maladie',
        'feedConsumed': 21.0,
        'waterConsumed': 35.0,
        'salesCount': 2,
        'salesAmount': 46000,
      },
    );

    setState(() => _isLoading = false);

    if (mounted) {
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename:
            'rapport_journalier_${picked.day}_${picked.month}_${picked.year}.pdf',
      );
      if (mounted) {
        context.showSuccessSnackBar('Rapport journalier partage.');
      }
    }
  }

  Future<void> _generateAndShareWeekly() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2024),
      lastDate: DateTime.now(),
      locale: const Locale('fr'),
    );
    if (picked == null || !mounted) return;

    final weekStart = picked.subtract(Duration(days: picked.weekday - 1));
    setState(() => _isLoading = true);

    final pdfBytes = await PdfGenerator.generateWeeklyReport(
      farmName: 'Elevage Diop',
      weekStart: weekStart,
      indicators: [
        {'name': 'Oeufs pondus', 'target': 98, 'actual': 92, 'gap': -6},
        {
          'name': 'Taux de ponte',
          'target': '70%',
          'actual': '66%',
          'gap': '-4%',
        },
        {'name': 'Mortalite', 'target': 0, 'actual': 1, 'gap': '+1'},
        {
          'name': 'Aliment consomme',
          'target': '20.2 kg',
          'actual': '21 kg',
          'gap': '+0.8 kg',
        },
        {'name': 'Ventes poussins', 'target': '-', 'actual': 39, 'gap': '-'},
        {
          'name': 'CA semaine',
          'target': '-',
          'actual': '46 000 FCFA',
          'gap': '-',
        },
        {
          'name': 'Taux fertilite',
          'target': '85%',
          'actual': '82%',
          'gap': '-3%',
        },
        {
          'name': 'Taux eclosion',
          'target': '82%',
          'actual': '79%',
          'gap': '-3%',
        },
        {
          'name': 'Stock aliment',
          'target': '> 50 kg',
          'actual': '120 kg',
          'gap': 'OK',
        },
        {
          'name': 'Creances',
          'target': '-',
          'actual': '25 000 FCFA',
          'gap': '-',
        },
      ],
    );

    setState(() => _isLoading = false);

    if (mounted) {
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename: 'rapport_hebdo_${weekStart.day}_${weekStart.month}.pdf',
      );
      if (mounted) {
        context.showSuccessSnackBar('Rapport hebdomadaire partage.');
      }
    }
  }

  Future<void> _generateAndShareMonthly() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2024),
      lastDate: DateTime.now(),
      locale: const Locale('fr'),
    );
    if (picked == null || !mounted) return;

    setState(() => _isLoading = true);

    final pdfBytes = await PdfGenerator.generateMonthlyReport(
      farmName: 'Elevage Diop',
      month: DateTime(picked.year, picked.month),
      financials: {
        'totalRevenue': 2450000,
        'totalExpenses': 1600000,
        'netResult': 850000,
        'margin': 34.7,
        'revenueByProduct': [
          {'product': 'Poussins', 'amount': 1200000},
          {'product': 'Oeufs', 'amount': 750000},
          {'product': 'Poulets', 'amount': 500000},
        ],
        'expensesByCategory': [
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
        'items': [
          {'name': 'Aliment ponte', 'quantity': 120, 'unit': 'kg'},
          {'name': 'Aliment croissance', 'quantity': 85, 'unit': 'kg'},
          {'name': 'Vaccins', 'quantity': 200, 'unit': 'doses'},
          {'name': 'Tablettes vides', 'quantity': 45, 'unit': 'unites'},
        ],
      },
    );

    setState(() => _isLoading = false);

    if (mounted) {
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename: 'rapport_mensuel_${picked.month}_${picked.year}.pdf',
      );
      if (mounted) {
        context.showSuccessSnackBar('Rapport mensuel partage.');
      }
    }
  }

  Future<void> _generateAndShareFlock() async {
    setState(() => _isLoading = true);

    final pdfBytes = await PdfGenerator.generateFlockReport(
      farmName: 'Elevage Diop',
      flock: {
        'name': 'Chair - Lot 12 - Aout 2026',
        'type': 'Poulets de chair',
        'startDate': DateTime(2026, 7, 15),
        'endDate': DateTime(2026, 8, 28),
        'durationDays': 44,
        'initialCount': 500,
        'totalMortality': 18,
        'mortalityRate': 3.6,
        'finalCount': 482,
        'avgWeight': 2.1,
        'totalEggs': 0,
        'avgLayingRate': 0,
        'totalCost': 1250000,
        'totalSales': 1930000,
        'margin': 680000,
        'costPerAnimal': 2500,
      },
    );

    setState(() => _isLoading = false);

    if (mounted) {
      await Printing.sharePdf(
        bytes: pdfBytes,
        filename: 'bilan_lot_chair_12.pdf',
      );
      if (mounted) {
        context.showSuccessSnackBar('Bilan de lot partage.');
      }
    }
  }
}

class _ReportTypeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final Color color;
  final VoidCallback onTap;

  const _ReportTypeCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GGCard(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: AppDimensions.space16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.black,
                  ),
                ),
                const SizedBox(height: AppDimensions.space4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.grey600,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.share, color: AppColors.grey400, size: 20),
        ],
      ),
    );
  }
}
