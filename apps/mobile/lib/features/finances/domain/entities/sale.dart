class Sale {
  final String id;
  final String productType;
  final int quantity;
  final num unitPrice;
  final num totalAmount;
  final num paidAmount;
  final String paymentStatus; // PAID, PARTIAL, PENDING
  final String? customerId;
  final String? customerName;
  final DateTime date;
  final String? notes;
  final String teamId;
  final String recordedById;
  final DateTime createdAt;

  const Sale({
    required this.id,
    required this.productType,
    required this.quantity,
    required this.unitPrice,
    required this.totalAmount,
    required this.paidAmount,
    required this.paymentStatus,
    this.customerId,
    this.customerName,
    required this.date,
    this.notes,
    required this.teamId,
    required this.recordedById,
    required this.createdAt,
  });

  num get remainingAmount => totalAmount - paidAmount;
  bool get isPaid => paymentStatus == 'PAID';
  bool get hasDebt => remainingAmount > 0;
}
