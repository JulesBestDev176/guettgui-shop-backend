class DailyRecord {
  final String id;
  final String flockId;
  final DateTime date;
  final int? eggsLaid;
  final int? eggsCollected;
  final int? eggsBroken;
  final int mortalityCount;
  final String? mortalityCause;
  final double? feedConsumedKg;
  final double? waterConsumedL;
  final double? averageWeightG;
  final String? notes;
  final String? photoUrl;
  final String recordedById;
  final DateTime createdAt;

  const DailyRecord({
    required this.id,
    required this.flockId,
    required this.date,
    this.eggsLaid,
    this.eggsCollected,
    this.eggsBroken,
    this.mortalityCount = 0,
    this.mortalityCause,
    this.feedConsumedKg,
    this.waterConsumedL,
    this.averageWeightG,
    this.notes,
    this.photoUrl,
    required this.recordedById,
    required this.createdAt,
  });
}
