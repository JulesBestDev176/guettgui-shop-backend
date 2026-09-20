import 'package:guettgui_mobile/core/utils/formatters.dart';

extension NumExtension on num {
  String get xof => Formatters.xof(this);
  String get xofCompact => Formatters.xofCompact(this);
  String get xofShort => Formatters.xofShort(this);
  String get formatted => Formatters.number(this);
}

extension IntExtension on int {
  String get eggs => Formatters.eggs(this);
  String get trays => Formatters.trays(this);
}

extension DoubleExtension on double {
  String get kg => Formatters.kg(this);
  String get kgInt => Formatters.kgInt(this);
  String get percent => Formatters.percent(this);
  String get percentInt => Formatters.percentInt(this);
}
