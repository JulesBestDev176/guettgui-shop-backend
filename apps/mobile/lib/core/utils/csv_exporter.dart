import 'package:intl/intl.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';
import 'package:guettgui_mobile/features/customers/domain/entities/customer.dart';

class CsvExporter {
  CsvExporter._();

  static final _dateFormat = DateFormat('dd/MM/yyyy', 'fr');

  static const _separator = ';';

  /// Exporte une liste de ventes en CSV (separateur ; format francais)
  static String exportSales(List<Sale> sales) {
    final buffer = StringBuffer();
    buffer.writeln([
      'Date',
      'Produit',
      'Quantite',
      'Prix unitaire',
      'Montant total',
      'Montant paye',
      'Reste du',
      'Statut paiement',
      'Client',
      'Notes',
    ].join(_separator));

    for (final sale in sales) {
      buffer.writeln([
        _dateFormat.format(sale.date),
        _productLabel(sale.productType),
        sale.quantity,
        sale.unitPrice,
        sale.totalAmount,
        sale.paidAmount,
        sale.remainingAmount,
        _paymentStatusLabel(sale.paymentStatus),
        sale.customerName ?? '',
        _escapeCsv(sale.notes ?? ''),
      ].join(_separator));
    }

    return buffer.toString();
  }

  /// Exporte une liste de depenses en CSV (separateur ; format francais)
  static String exportExpenses(List<Expense> expenses) {
    final buffer = StringBuffer();
    buffer.writeln([
      'Date',
      'Categorie',
      'Montant',
      'Description',
    ].join(_separator));

    for (final expense in expenses) {
      buffer.writeln([
        _dateFormat.format(expense.date),
        _categoryLabel(expense.category),
        expense.amount,
        _escapeCsv(expense.description ?? ''),
      ].join(_separator));
    }

    return buffer.toString();
  }

  /// Exporte une liste de saisies quotidiennes en CSV (separateur ; format francais)
  static String exportDailyRecords(List<DailyRecord> records) {
    final buffer = StringBuffer();
    buffer.writeln([
      'Date',
      'Lot',
      'Oeufs pondus',
      'Oeufs collectes',
      'Oeufs casses',
      'Mortalite',
      'Cause mortalite',
      'Aliment (kg)',
      'Eau (L)',
      'Poids moyen (g)',
      'Notes',
    ].join(_separator));

    for (final r in records) {
      buffer.writeln([
        _dateFormat.format(r.date),
        r.flockId,
        r.eggsLaid ?? '',
        r.eggsCollected ?? '',
        r.eggsBroken ?? '',
        r.mortalityCount,
        r.mortalityCause ?? '',
        r.feedConsumedKg ?? '',
        r.waterConsumedL ?? '',
        r.averageWeightG ?? '',
        _escapeCsv(r.notes ?? ''),
      ].join(_separator));
    }

    return buffer.toString();
  }

  /// Exporte une liste de clients en CSV (separateur ; format francais)
  static String exportCustomers(List<Customer> customers) {
    final buffer = StringBuffer();
    buffer.writeln([
      'Nom',
      'Telephone',
      'Adresse',
      'Total achats',
      'Solde du',
      'Notes',
      'Date creation',
    ].join(_separator));

    for (final c in customers) {
      buffer.writeln([
        c.fullName,
        c.phone ?? '',
        c.address ?? '',
        c.totalPurchases,
        c.totalDebt,
        _escapeCsv(c.notes ?? ''),
        _dateFormat.format(c.createdAt),
      ].join(_separator));
    }

    return buffer.toString();
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  static String _escapeCsv(String value) {
    if (value.contains(_separator) || value.contains('"') || value.contains('\n')) {
      return '"${value.replaceAll('"', '""')}"';
    }
    return value;
  }

  static String _productLabel(String type) {
    return switch (type) {
      'CHICKS' => 'Poussins',
      'FERTILE_EGGS' => 'Oeufs fecondes',
      'TABLE_EGGS' => 'Oeufs consommation',
      'LIVE_CHICKEN' => 'Poulets vivants',
      'SLAUGHTERED_CHICKEN' => 'Poulets abattus',
      'LIVE_QUAIL' => 'Cailles vivantes',
      'QUAIL_EGGS' => 'Oeufs de caille',
      'QUAIL_MEAT' => 'Chair de caille',
      _ => type,
    };
  }

  static String _paymentStatusLabel(String status) {
    return switch (status) {
      'PAID' => 'Paye',
      'PARTIAL' => 'Partiel',
      'PENDING' => 'En attente',
      _ => status,
    };
  }

  static String _categoryLabel(String category) {
    return switch (category) {
      'ALIMENTATION' => 'Alimentation',
      'SANTE' => 'Sante',
      'ACHAT_ANIMAUX' => 'Achat d\'animaux',
      'EQUIPEMENT' => 'Equipement',
      'MAIN_OEUVRE' => 'Main d\'oeuvre',
      'TRANSPORT' => 'Transport',
      'ENERGIE' => 'Energie',
      'AUTRE' => 'Autre',
      _ => category,
    };
  }
}
