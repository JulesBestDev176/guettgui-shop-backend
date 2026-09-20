import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';

class SaleModel extends Sale {
  const SaleModel({
    required super.id,
    required super.productType,
    required super.quantity,
    required super.unitPrice,
    required super.totalAmount,
    required super.paidAmount,
    required super.paymentStatus,
    super.customerId,
    super.customerName,
    required super.date,
    super.notes,
    required super.teamId,
    required super.recordedById,
    required super.createdAt,
  });

  factory SaleModel.fromJson(Map<String, dynamic> json) {
    return SaleModel(
      id: json['id'] as String,
      productType: json['productType'] as String,
      quantity: json['quantity'] as int,
      unitPrice: json['unitPrice'] as num,
      totalAmount: json['totalAmount'] as num,
      paidAmount: json['paidAmount'] as num? ?? 0,
      paymentStatus: json['paymentStatus'] as String? ?? 'PENDING',
      customerId: json['customerId'] as String?,
      customerName: json['customerName'] as String? ??
          (json['customer'] is Map
              ? '${(json['customer'] as Map)['firstName'] ?? ''} ${(json['customer'] as Map)['lastName'] ?? ''}'.trim()
              : null),
      date: DateTime.parse(json['date'] as String),
      notes: json['notes'] as String?,
      teamId: json['teamId'] as String,
      recordedById: json['recordedById'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productType': productType,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalAmount': totalAmount,
      'paidAmount': paidAmount,
      'paymentStatus': paymentStatus,
      'customerId': customerId,
      'date': date.toIso8601String(),
      'notes': notes,
      'teamId': teamId,
      'recordedById': recordedById,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
