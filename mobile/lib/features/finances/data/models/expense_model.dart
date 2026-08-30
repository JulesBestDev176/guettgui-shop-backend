import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';

class ExpenseModel extends Expense {
  const ExpenseModel({
    required super.id,
    required super.category,
    required super.amount,
    super.description,
    required super.date,
    super.receiptUrl,
    super.flockId,
    required super.teamId,
    required super.recordedById,
    required super.createdAt,
  });

  factory ExpenseModel.fromJson(Map<String, dynamic> json) {
    return ExpenseModel(
      id: json['id'] as String,
      category: json['category'] as String,
      amount: json['amount'] as num,
      description: json['description'] as String?,
      date: DateTime.parse(json['date'] as String),
      receiptUrl: json['receiptUrl'] as String?,
      flockId: json['flockId'] as String?,
      teamId: json['teamId'] as String,
      recordedById: json['recordedById'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'amount': amount,
      'description': description,
      'date': date.toIso8601String(),
      'receiptUrl': receiptUrl,
      'flockId': flockId,
      'teamId': teamId,
      'recordedById': recordedById,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
