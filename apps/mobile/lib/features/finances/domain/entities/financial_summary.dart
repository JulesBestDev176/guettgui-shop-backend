class FinancialSummary {
  final num totalRevenue;
  final num totalExpenses;
  final num netProfit;
  final num totalDebts;
  final num monthRevenue;
  final num monthExpenses;
  final double? revenueTrend;
  final Map<String, num> expensesByCategory;
  final Map<String, num> revenueByProduct;

  const FinancialSummary({
    required this.totalRevenue,
    required this.totalExpenses,
    required this.netProfit,
    required this.totalDebts,
    required this.monthRevenue,
    required this.monthExpenses,
    this.revenueTrend,
    this.expensesByCategory = const {},
    this.revenueByProduct = const {},
  });
}
