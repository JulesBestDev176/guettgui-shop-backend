import 'package:guettgui_mobile/features/customers/domain/entities/customer.dart';

class CustomerModel extends Customer {
  const CustomerModel({
    required super.id,
    required super.firstName,
    super.lastName,
    super.phone,
    super.address,
    super.notes,
    super.totalPurchases,
    super.totalDebt,
    required super.teamId,
    required super.createdAt,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String?,
      phone: json['phone'] as String?,
      address: json['address'] as String?,
      notes: json['notes'] as String?,
      totalPurchases: json['totalPurchases'] as num? ?? 0,
      totalDebt: json['totalDebt'] as num? ?? 0,
      teamId: json['teamId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'phone': phone,
      'address': address,
      'notes': notes,
      'totalPurchases': totalPurchases,
      'totalDebt': totalDebt,
      'teamId': teamId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
