class Stock {
  final String id;
  final String itemType;
  final String itemName;
  final double quantity;
  final String unit;
  final double? minThreshold;
  final String teamId;
  final DateTime updatedAt;

  const Stock({
    required this.id,
    required this.itemType,
    required this.itemName,
    required this.quantity,
    required this.unit,
    this.minThreshold,
    required this.teamId,
    required this.updatedAt,
  });

  bool get isLow => minThreshold != null && quantity <= minThreshold!;
  double get fillPercentage =>
      minThreshold != null && minThreshold! > 0
          ? (quantity / (minThreshold! * 3)).clamp(0.0, 1.0)
          : 1.0;
}

class StockMove {
  final String id;
  final String stockId;
  final String moveType; // IN_PURCHASE, IN_PRODUCTION, OUT_CONSUMPTION, OUT_SALE, ADJUST
  final double quantity;
  final String? reason;
  final DateTime date;
  final String recordedById;
  final DateTime createdAt;

  const StockMove({
    required this.id,
    required this.stockId,
    required this.moveType,
    required this.quantity,
    this.reason,
    required this.date,
    required this.recordedById,
    required this.createdAt,
  });

  bool get isEntry => moveType.startsWith('IN') || (moveType == 'ADJUST' && quantity > 0);
}
