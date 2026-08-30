class IncubationBatch {
  final String id;
  final String incubatorId;
  final String? incubatorName;
  final int eggsLoaded;
  final DateTime loadDate;
  final DateTime expectedHatchDate;
  final int? candling1Fertile;
  final int? candling1Infertile;
  final DateTime? candling1Date;
  final int? candling2Alive;
  final int? candling2Dead;
  final DateTime? candling2Date;
  final int? hatchedCount;
  final int? hatchedAlive;
  final int? hatchedDead;
  final DateTime? hatchDate;
  final String status; // INCUBATING, HATCHING, COMPLETED, CANCELLED
  final String teamId;
  final DateTime createdAt;

  const IncubationBatch({
    required this.id,
    required this.incubatorId,
    this.incubatorName,
    required this.eggsLoaded,
    required this.loadDate,
    required this.expectedHatchDate,
    this.candling1Fertile,
    this.candling1Infertile,
    this.candling1Date,
    this.candling2Alive,
    this.candling2Dead,
    this.candling2Date,
    this.hatchedCount,
    this.hatchedAlive,
    this.hatchedDead,
    this.hatchDate,
    required this.status,
    required this.teamId,
    required this.createdAt,
  });

  int get daysSinceLoad => DateTime.now().difference(loadDate).inDays;
  double get hatchRate =>
      eggsLoaded > 0 && hatchedAlive != null
          ? (hatchedAlive! / eggsLoaded) * 100
          : 0;
  double get fertilityRate =>
      eggsLoaded > 0 && candling1Fertile != null
          ? (candling1Fertile! / eggsLoaded) * 100
          : 0;
}
