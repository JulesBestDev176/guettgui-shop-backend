class Customer {
  final String id;
  final String firstName;
  final String? lastName;
  final String? phone;
  final String? address;
  final String? notes;
  final num totalPurchases;
  final num totalDebt;
  final String teamId;
  final DateTime createdAt;

  const Customer({
    required this.id,
    required this.firstName,
    this.lastName,
    this.phone,
    this.address,
    this.notes,
    this.totalPurchases = 0,
    this.totalDebt = 0,
    required this.teamId,
    required this.createdAt,
  });

  String get fullName =>
      lastName != null ? '$firstName $lastName' : firstName;
  bool get hasDebt => totalDebt > 0;
}
