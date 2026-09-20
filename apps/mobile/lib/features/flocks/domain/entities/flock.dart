class Flock {
  final String id;
  final String name;
  final String type; // BREEDER, LAYER, BROILER, QUAIL
  final String? breed;
  final DateTime startDate;
  final DateTime? endDate;
  final int initialFemales;
  final int initialMales;
  final int initialTotal;
  final int currentTotal;
  final String status; // ACTIVE, COMPLETED, ARCHIVED
  final String teamId;
  final DateTime createdAt;

  const Flock({
    required this.id,
    required this.name,
    required this.type,
    this.breed,
    required this.startDate,
    this.endDate,
    required this.initialFemales,
    required this.initialMales,
    required this.initialTotal,
    required this.currentTotal,
    required this.status,
    required this.teamId,
    required this.createdAt,
  });

  bool get isActive => status == 'ACTIVE';
  bool get isBroiler => type == 'BROILER';
  bool get isBreeder => type == 'BREEDER';
  bool get isLayer => type == 'LAYER';
  bool get isQuail => type == 'QUAIL';

  int get mortalityCount => initialTotal - currentTotal;
  double get mortalityRate =>
      initialTotal > 0 ? (mortalityCount / initialTotal) * 100 : 0;

  int get ageInDays => DateTime.now().difference(startDate).inDays;
  int get ageInWeeks => ageInDays ~/ 7;

  String get typeLabel => switch (type) {
        'BREEDER' => 'Reproducteur',
        'LAYER' => 'Pondeuse',
        'BROILER' => 'Chair',
        'QUAIL' => 'Caille',
        _ => type,
      };
}
