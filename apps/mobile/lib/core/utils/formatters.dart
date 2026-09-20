import 'package:intl/intl.dart';

class Formatters {
  Formatters._();

  // --- MONEY (XOF / FCFA) ---
  static final NumberFormat _xofFormat = NumberFormat.currency(
    locale: 'fr',
    symbol: 'FCFA',
    decimalDigits: 0,
  );

  static final NumberFormat _xofCompact = NumberFormat.compactCurrency(
    locale: 'fr',
    symbol: 'FCFA',
    decimalDigits: 0,
  );

  static String xof(num amount) => _xofFormat.format(amount);

  static String xofCompact(num amount) => _xofCompact.format(amount);

  static String xofShort(num amount) {
    if (amount >= 1000000) {
      return '${(amount / 1000000).toStringAsFixed(1)}M FCFA';
    }
    if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(0)}K FCFA';
    }
    return '$amount FCFA';
  }

  // --- DATES ---
  static final DateFormat _fullDate = DateFormat('EEEE d MMMM yyyy', 'fr');
  static final DateFormat _mediumDate = DateFormat('d MMMM yyyy', 'fr');
  static final DateFormat _shortDate = DateFormat('dd/MM/yyyy', 'fr');
  static final DateFormat _dayMonth = DateFormat('d MMM', 'fr');
  static final DateFormat _time = DateFormat('HH:mm', 'fr');
  static final DateFormat _dateTime = DateFormat('dd/MM/yyyy HH:mm', 'fr');

  static String fullDate(DateTime date) => _fullDate.format(date);
  static String mediumDate(DateTime date) => _mediumDate.format(date);
  static String shortDate(DateTime date) => _shortDate.format(date);
  static String dayMonth(DateTime date) => _dayMonth.format(date);
  static String time(DateTime date) => _time.format(date);
  static String dateTime(DateTime date) => _dateTime.format(date);

  static String relativeDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final dateOnly = DateTime(date.year, date.month, date.day);
    final diff = today.difference(dateOnly).inDays;

    if (diff == 0) return 'Aujourd\'hui';
    if (diff == 1) return 'Hier';
    if (diff == -1) return 'Demain';
    if (diff > 1 && diff < 7) return 'Il y a $diff jours';
    if (diff < -1 && diff > -7) return 'Dans ${-diff} jours';
    return shortDate(date);
  }

  // --- WEIGHT ---
  static String kg(double weight) => '${weight.toStringAsFixed(1)} kg';

  static String kgInt(double weight) => '${weight.toStringAsFixed(0)} kg';

  // --- PERCENTAGES ---
  static String percent(double value) => '${value.toStringAsFixed(1)}%';

  static String percentInt(double value) => '${value.toStringAsFixed(0)}%';

  // --- NUMBERS ---
  static final NumberFormat _numberFormat = NumberFormat('#,###', 'fr');

  static String number(num value) => _numberFormat.format(value);

  // --- EGGS ---
  static String eggs(int count) {
    if (count == 0) return '0 oeuf';
    if (count == 1) return '1 oeuf';
    return '$count oeufs';
  }

  static String trays(int eggCount) {
    final trays = eggCount ~/ 30;
    final remaining = eggCount % 30;
    if (trays == 0) return '$remaining oeufs';
    if (remaining == 0) {
      return '$trays tablette${trays > 1 ? "s" : ""}';
    }
    return '$trays tablette${trays > 1 ? "s" : ""} + $remaining oeufs';
  }

  // --- PHONE ---
  static String phone(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[^\d+]'), '');
    if (cleaned.startsWith('+221') && cleaned.length == 13) {
      return '+221 ${cleaned.substring(4, 6)} ${cleaned.substring(6, 9)} '
          '${cleaned.substring(9, 11)} ${cleaned.substring(11, 13)}';
    }
    return phone;
  }

  static String phoneObfuscated(String phone) {
    final cleaned = phone.replaceAll(RegExp(r'[^\d+]'), '');
    if (cleaned.length >= 9) {
      final last2 = cleaned.substring(cleaned.length - 2);
      return '+221 ** *** ** $last2';
    }
    return '*** *** ****';
  }

  // --- DURATION ---
  static String countdown(Duration duration) {
    if (duration.isNegative) return 'Depasse';
    final days = duration.inDays;
    final hours = duration.inHours % 24;
    if (days > 0) return '$days jour${days > 1 ? "s" : ""}';
    if (hours > 0) return '$hours heure${hours > 1 ? "s" : ""}';
    return 'Aujourd\'hui';
  }

  static String timerDisplay(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:'
        '${secs.toString().padLeft(2, '0')}';
  }
}
