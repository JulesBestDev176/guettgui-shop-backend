import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/financial_summary.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';

abstract class FinanceRepository {
  Future<List<Expense>> getExpenses(
    String teamId, {
    String? category,
    DateTime? dateFrom,
    DateTime? dateTo,
  });
  Future<Expense> createExpense(String teamId, Map<String, dynamic> data);
  Future<List<Sale>> getSales(
    String teamId, {
    String? productType,
    String? paymentStatus,
    DateTime? dateFrom,
    DateTime? dateTo,
  });
  Future<Sale> createSale(String teamId, Map<String, dynamic> data);
  Future<void> createSalePayment(
    String teamId,
    String saleId,
    Map<String, dynamic> data,
  );
  Future<FinancialSummary> getFinancialSummary(String teamId);
}
