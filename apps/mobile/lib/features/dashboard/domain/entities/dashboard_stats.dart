class DashboardStats {
  final int eggsToday;
  final int eggsDiff;
  final int totalEffective;
  final num monthRevenue;
  final int activeAlerts;
  final num totalRevenue;
  final double? revenueTrend;

  const DashboardStats({
    this.eggsToday = 0,
    this.eggsDiff = 0,
    this.totalEffective = 0,
    this.monthRevenue = 0,
    this.activeAlerts = 0,
    this.totalRevenue = 0,
    this.revenueTrend,
  });
}
