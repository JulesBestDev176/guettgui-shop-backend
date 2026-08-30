import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';

abstract class StockRepository {
  Future<List<Stock>> getStocks(String teamId);
  Future<List<StockMove>> getStockMoves(String teamId, String stockId);
  Future<void> adjustStock(
    String teamId,
    String stockId,
    Map<String, dynamic> data,
  );
}
