class Validators {
  Validators._();

  static String? required(String? value, [String fieldName = 'Ce champ']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName est requis.';
    }
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le numero de telephone est requis.';
    }
    final cleaned = value.replaceAll(RegExp(r'[\s\-()]'), '');
    if (!RegExp(r'^(\+221)?[0-9]{9}$').hasMatch(cleaned)) {
      return 'Numero de telephone invalide.';
    }
    return null;
  }

  static String? otp(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le code est requis.';
    }
    if (value.length != 6 || !RegExp(r'^[0-9]{6}$').hasMatch(value)) {
      return 'Le code doit contenir 6 chiffres.';
    }
    return null;
  }

  static String? name(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis.';
    }
    if (value.trim().length < 2) {
      return 'Minimum 2 caracteres.';
    }
    return null;
  }

  static String? positiveNumber(String? value, [String fieldName = 'La valeur']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName est requise.';
    }
    final number = num.tryParse(value);
    if (number == null) {
      return '$fieldName doit etre un nombre.';
    }
    if (number < 0) {
      return '$fieldName doit etre positive.';
    }
    return null;
  }

  static String? positiveInteger(
    String? value, [
    String fieldName = 'La valeur',
  ]) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName est requise.';
    }
    final number = int.tryParse(value);
    if (number == null) {
      return '$fieldName doit etre un nombre entier.';
    }
    if (number < 0) {
      return '$fieldName doit etre positive.';
    }
    return null;
  }

  static String? percentage(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le pourcentage est requis.';
    }
    final number = num.tryParse(value);
    if (number == null) {
      return 'Valeur invalide.';
    }
    if (number < 0 || number > 100) {
      return 'Le pourcentage doit etre entre 0 et 100.';
    }
    return null;
  }

  static String? amount(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le montant est requis.';
    }
    final cleaned = value.replaceAll(RegExp(r'[\s.]'), '');
    final number = num.tryParse(cleaned);
    if (number == null) {
      return 'Montant invalide.';
    }
    if (number <= 0) {
      return 'Le montant doit etre superieur a 0.';
    }
    return null;
  }

  static String? weight(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le poids est requis.';
    }
    final number = double.tryParse(value);
    if (number == null) {
      return 'Poids invalide.';
    }
    if (number <= 0) {
      return 'Le poids doit etre superieur a 0.';
    }
    return null;
  }

  static String? inviteCode(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Le code d\'invitation est requis.';
    }
    if (value.trim().length < 4) {
      return 'Code d\'invitation invalide.';
    }
    return null;
  }
}
