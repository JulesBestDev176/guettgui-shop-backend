import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';

class StockMoveModel extends StockMove {
  const StockMoveModel({
    required super.id,
    required super.stockId,
    required super.moveType,
    required super.quantity,
    super.reason,
    required super.date,
    required super.recordedById,
    required super.createdAt,
  });

  factory StockMoveModel.fromJson(Map<String, dynamic> json) {
    return StockMoveModel(
      id: json['id'] as String,
      stockId: json['stockId'] as String,
      moveType: json['moveType'] as String,
      quantity: (json['quantity'] as num).toDouble(),
      reason: json['reason'] as String?,
      date: DateTime.parse(json['date'] as String),
      recordedById: json['recordedById'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'stockId': stockId,
      'moveType': moveType,
      'quantity': quantity,
      'reason': reason,
      'date': date.toIso8601String(),
      'recordedById': recordedById,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
