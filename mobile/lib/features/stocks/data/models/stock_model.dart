import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';

class StockModel extends Stock {
  const StockModel({
    required super.id,
    required super.itemType,
    required super.itemName,
    required super.quantity,
    required super.unit,
    super.minThreshold,
    required super.teamId,
    required super.updatedAt,
  });

  factory StockModel.fromJson(Map<String, dynamic> json) {
    return StockModel(
      id: json['id'] as String,
      itemType: json['itemType'] as String,
      itemName: json['itemName'] as String,
      quantity: (json['quantity'] as num).toDouble(),
      unit: json['unit'] as String? ?? 'kg',
      minThreshold: (json['minThreshold'] as num?)?.toDouble(),
      teamId: json['teamId'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemType': itemType,
      'itemName': itemName,
      'quantity': quantity,
      'unit': unit,
      'minThreshold': minThreshold,
      'teamId': teamId,
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
