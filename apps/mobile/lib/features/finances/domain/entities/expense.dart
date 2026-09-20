class Expense {
  final String id;
  final String category;
  final num amount;
  final String? description;
  final DateTime date;
  final String? receiptUrl;
  final String? flockId;
  final String teamId;
  final String recordedById;
  final DateTime createdAt;

  const Expense({
    required this.id,
    required this.category,
    required this.amount,
    this.description,
    required this.date,
    this.receiptUrl,
    this.flockId,
    required this.teamId,
    required this.recordedById,
    required this.createdAt,
  });
}
