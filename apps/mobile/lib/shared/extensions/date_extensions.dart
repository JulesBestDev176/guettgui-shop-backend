import 'package:guettgui_mobile/core/utils/formatters.dart';

extension DateTimeExtension on DateTime {
  String get fullDate => Formatters.fullDate(this);
  String get mediumDate => Formatters.mediumDate(this);
  String get shortDate => Formatters.shortDate(this);
  String get dayMonth => Formatters.dayMonth(this);
  String get timeStr => Formatters.time(this);
  String get dateTimeStr => Formatters.dateTime(this);
  String get relative => Formatters.relativeDate(this);

  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year &&
        month == yesterday.month &&
        day == yesterday.day;
  }

  bool get isTomorrow {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return year == tomorrow.year &&
        month == tomorrow.month &&
        day == tomorrow.day;
  }

  bool get isPast => isBefore(DateTime.now());
  bool get isFuture => isAfter(DateTime.now());

  DateTime get startOfDay => DateTime(year, month, day);
  DateTime get endOfDay => DateTime(year, month, day, 23, 59, 59);

  DateTime get startOfWeek {
    final diff = weekday - DateTime.monday;
    return subtract(Duration(days: diff)).startOfDay;
  }

  DateTime get startOfMonth => DateTime(year, month);
  DateTime get endOfMonth => DateTime(year, month + 1, 0, 23, 59, 59);

  int get daysInMonth => DateTime(year, month + 1, 0).day;

  int daysDifference(DateTime other) {
    return startOfDay.difference(other.startOfDay).inDays;
  }

  DateTime addDays(int days) => add(Duration(days: days));

  bool isSameDay(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }
}
