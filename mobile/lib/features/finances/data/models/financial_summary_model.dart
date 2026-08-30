import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';

class FinancialSummaryModel extends FinancialSummary {
  const FinancialSummaryModel({
    required super.totalRevenue,
    required super.totalExpenses,
    required super.netProfit,
    required super.totalDebts,
    required super.monthRevenue,
    required super.monthExpenses,
    super.revenueTrend,
    super.expensesByCategory,
    super.revenueByProduct,
  });

  factory FinancialSummaryModel.fromJson(Map<String, dynamic> json) {
    return FinancialSummaryModel(
      totalRevenue: json['totalRevenue'] as num? ?? 0,
      totalExpenses: json['totalExpenses'] as num? ?? 0,
      netProfit: json['netProfit'] as num? ?? 0,
      totalDebts: json['totalDebts'] as num? ?? 0,
      monthRevenue: json['monthRevenue'] as num? ?? 0,
      monthExpenses: json['monthExpenses'] as num? ?? 0,
      revenueTrend: (json['revenueTrend'] as num?)?.toDouble(),
      expensesByCategory: json['expensesByCategory'] != null
          ? (json['expensesByCategory'] as Map<String, dynamic>)
              .map((key, value) => MapEntry(key, value as num))
          : const {},
      revenueByProduct: json['revenueByProduct'] != null
          ? (json['revenueByProduct'] as Map<String, dynamic>)
              .map((key, value) => MapEntry(key, value as num))
          : const {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalRevenue': totalRevenue,
      'totalExpenses': totalExpenses,
      'netProfit': netProfit,
      'totalDebts': totalDebts,
      'monthRevenue': monthRevenue,
      'monthExpenses': monthExpenses,
      'revenueTrend': revenueTrend,
      'expensesByCategory': expensesByCategory,
      'revenueByProduct': revenueByProduct,
    };
  }
}
