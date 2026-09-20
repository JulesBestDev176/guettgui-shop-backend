import 'dart:typed_data';

import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

class PdfGenerator {
  PdfGenerator._();

  static const _green = PdfColor.fromInt(0xFF2EA831);
  static const _black = PdfColor.fromInt(0xFF1D1D1B);
  static const _grey = PdfColor.fromInt(0xFF757575);
  static const _greyLight = PdfColor.fromInt(0xFFEEEEEE);
  static const _white = PdfColor.fromInt(0xFFFFFFFF);

  static final _dateFormat = DateFormat('dd/MM/yyyy', 'fr');
  static final _monthFormat = DateFormat('MMMM yyyy', 'fr');
  static final _xofFormat = NumberFormat.currency(
    locale: 'fr',
    symbol: 'FCFA',
    decimalDigits: 0,
  );

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  /// Generer un rapport journalier
  static Future<Uint8List> generateDailyReport({
    required String farmName,
    required DateTime date,
    required Map<String, dynamic> stats,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            _buildHeader(farmName, 'Rapport Journalier', _dateFormat.format(date)),
            pw.SizedBox(height: 24),
            _buildSectionTitle('Production'),
            _buildKeyValueTable([
              ['Oeufs pondus', '${stats['eggsLaid'] ?? 0}'],
              ['Oeufs collectes', '${stats['eggsCollected'] ?? 0}'],
              ['Oeufs casses', '${stats['eggsBroken'] ?? 0}'],
              ['Taux de ponte', '${stats['layingRate'] ?? 0}%'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Mortalite'),
            _buildKeyValueTable([
              ['Nombre de morts', '${stats['mortalityCount'] ?? 0}'],
              ['Cause principale', '${stats['mortalityCause'] ?? 'Aucune'}'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Alimentation'),
            _buildKeyValueTable([
              ['Aliment consomme', '${stats['feedConsumed'] ?? 0} kg'],
              ['Eau consommee', '${stats['waterConsumed'] ?? 0} L'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Ventes du jour'),
            _buildKeyValueTable([
              ['Nombre de ventes', '${stats['salesCount'] ?? 0}'],
              ['Montant total', _xofFormat.format(stats['salesAmount'] ?? 0)],
            ]),
          ],
        ),
        // footer is handled in build content
      ),
    );

    return pdf.save();
  }

  /// Generer un rapport hebdomadaire
  static Future<Uint8List> generateWeeklyReport({
    required String farmName,
    required DateTime weekStart,
    required List<Map<String, dynamic>> indicators,
  }) async {
    final pdf = pw.Document();
    final weekEnd = weekStart.add(const Duration(days: 6));
    final subtitle = '${_dateFormat.format(weekStart)} - ${_dateFormat.format(weekEnd)}';

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            _buildHeader(farmName, 'Rapport Hebdomadaire', subtitle),
            pw.SizedBox(height: 24),
            _buildSectionTitle('Indicateurs de la semaine'),
            pw.SizedBox(height: 8),
            _buildIndicatorsTable(indicators),
          ],
        ),
        // footer is handled in build content
      ),
    );

    return pdf.save();
  }

  /// Generer un rapport mensuel
  static Future<Uint8List> generateMonthlyReport({
    required String farmName,
    required DateTime month,
    required Map<String, dynamic> financials,
    required Map<String, dynamic> production,
    required Map<String, dynamic> stocks,
  }) async {
    final pdf = pw.Document();
    final subtitle = _monthFormat.format(month);

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        header: (context) => context.pageNumber == 1
            ? _buildHeader(farmName, 'Rapport Mensuel', subtitle)
            : pw.Container(),
        // footer is handled in build content
        build: (context) => [
          pw.SizedBox(height: 24),
          _buildSectionTitle('Bilan Financier'),
          _buildKeyValueTable([
            ['Total revenus', _xofFormat.format(financials['totalRevenue'] ?? 0)],
            ['Total depenses', _xofFormat.format(financials['totalExpenses'] ?? 0)],
            ['Resultat net', _xofFormat.format(financials['netResult'] ?? 0)],
            ['Marge', '${financials['margin'] ?? 0}%'],
          ]),
          pw.SizedBox(height: 16),
          _buildSectionTitle('Revenus par produit'),
          _buildKeyValueTable(
            (financials['revenueByProduct'] as List<Map<String, dynamic>>? ?? [])
                .map((e) => [e['product'] as String, _xofFormat.format(e['amount'] ?? 0)])
                .toList(),
          ),
          pw.SizedBox(height: 16),
          _buildSectionTitle('Depenses par categorie'),
          _buildKeyValueTable(
            (financials['expensesByCategory'] as List<Map<String, dynamic>>? ?? [])
                .map((e) => [e['category'] as String, _xofFormat.format(e['amount'] ?? 0)])
                .toList(),
          ),
          pw.SizedBox(height: 24),
          _buildSectionTitle('Production'),
          _buildKeyValueTable([
            ['Oeufs totaux', '${production['totalEggs'] ?? 0}'],
            ['Taux de ponte moyen', '${production['avgLayingRate'] ?? 0}%'],
            ['Mortalite totale', '${production['totalMortality'] ?? 0}'],
            ['Poussins eclos', '${production['chicksHatched'] ?? 0}'],
          ]),
          pw.SizedBox(height: 24),
          _buildSectionTitle('Etat des stocks'),
          _buildKeyValueTable(
            (stocks['items'] as List<Map<String, dynamic>>? ?? [])
                .map((e) => [e['name'] as String, '${e['quantity']} ${e['unit']}'])
                .toList(),
          ),
        ],
      ),
    );

    return pdf.save();
  }

  /// Generer un bilan de lot
  static Future<Uint8List> generateFlockReport({
    required String farmName,
    required Map<String, dynamic> flock,
  }) async {
    final pdf = pw.Document();
    final flockName = flock['name'] as String? ?? 'Lot';
    final flockType = flock['type'] as String? ?? '';

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            _buildHeader(farmName, 'Bilan de lot', '$flockName ($flockType)'),
            pw.SizedBox(height: 24),
            _buildSectionTitle('Informations generales'),
            _buildKeyValueTable([
              ['Nom du lot', flockName],
              ['Type', flockType],
              ['Date de demarrage', _dateFormat.format(flock['startDate'] as DateTime? ?? DateTime.now())],
              ['Date de cloture', flock['endDate'] != null ? _dateFormat.format(flock['endDate'] as DateTime) : 'En cours'],
              ['Duree', '${flock['durationDays'] ?? 0} jours'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Effectifs'),
            _buildKeyValueTable([
              ['Effectif initial', '${flock['initialCount'] ?? 0}'],
              ['Mortalite totale', '${flock['totalMortality'] ?? 0}'],
              ['Taux de mortalite', '${flock['mortalityRate'] ?? 0}%'],
              ['Effectif final', '${flock['finalCount'] ?? 0}'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Performance'),
            _buildKeyValueTable([
              ['Poids moyen final', '${flock['avgWeight'] ?? 0} kg'],
              ['Oeufs totaux', '${flock['totalEggs'] ?? 0}'],
              ['Taux de ponte moyen', '${flock['avgLayingRate'] ?? 0}%'],
            ]),
            pw.SizedBox(height: 16),
            _buildSectionTitle('Bilan financier'),
            _buildKeyValueTable([
              ['Cout total', _xofFormat.format(flock['totalCost'] ?? 0)],
              ['Total ventes', _xofFormat.format(flock['totalSales'] ?? 0)],
              ['Marge', _xofFormat.format(flock['margin'] ?? 0)],
              ['Cout par animal', _xofFormat.format(flock['costPerAnimal'] ?? 0)],
            ]),
          ],
        ),
        // footer is handled in build content
      ),
    );

    return pdf.save();
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  static pw.Widget _buildHeader(String farmName, String reportTitle, String subtitle) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text(
                  'Guett Gui',
                  style: pw.TextStyle(
                    fontSize: 24,
                    fontWeight: pw.FontWeight.bold,
                    color: _green,
                  ),
                ),
                pw.SizedBox(height: 4),
                pw.Text(
                  farmName,
                  style: pw.TextStyle(
                    fontSize: 14,
                    color: _black,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ],
            ),
            pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.end,
              children: [
                pw.Text(
                  reportTitle,
                  style: pw.TextStyle(
                    fontSize: 18,
                    fontWeight: pw.FontWeight.bold,
                    color: _black,
                  ),
                ),
                pw.SizedBox(height: 4),
                pw.Text(
                  subtitle,
                  style: const pw.TextStyle(
                    fontSize: 12,
                    color: _grey,
                  ),
                ),
              ],
            ),
          ],
        ),
        pw.SizedBox(height: 8),
        pw.Divider(color: _green, thickness: 2),
      ],
    );
  }

  static pw.Widget _buildFooter(pw.Context context) {
    return pw.Container(
      padding: const pw.EdgeInsets.only(top: 8),
      decoration: const pw.BoxDecoration(
        border: pw.Border(top: pw.BorderSide(color: _greyLight, width: 1)),
      ),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(
            'Guett Gui - Gestion d\'elevage avicole',
            style: const pw.TextStyle(fontSize: 9, color: _grey),
          ),
          pw.Text(
            'Page ${context.pageNumber} / ${context.pagesCount}',
            style: const pw.TextStyle(fontSize: 9, color: _grey),
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildSectionTitle(String title) {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 6, horizontal: 10),
      decoration: const pw.BoxDecoration(
        color: _green,
        borderRadius: pw.BorderRadius.all(pw.Radius.circular(4)),
      ),
      child: pw.Text(
        title,
        style: pw.TextStyle(
          fontSize: 13,
          fontWeight: pw.FontWeight.bold,
          color: _white,
        ),
      ),
    );
  }

  static pw.Widget _buildKeyValueTable(List<List<String>> rows) {
    return pw.Table(
      border: pw.TableBorder.all(color: _greyLight, width: 0.5),
      columnWidths: {
        0: const pw.FlexColumnWidth(2),
        1: const pw.FlexColumnWidth(1.5),
      },
      children: rows.map((row) {
        return pw.TableRow(
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.symmetric(vertical: 6, horizontal: 8),
              child: pw.Text(
                row[0],
                style: const pw.TextStyle(fontSize: 11, color: _grey),
              ),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.symmetric(vertical: 6, horizontal: 8),
              child: pw.Text(
                row.length > 1 ? row[1] : '',
                style: pw.TextStyle(
                  fontSize: 11,
                  fontWeight: pw.FontWeight.bold,
                  color: _black,
                ),
                textAlign: pw.TextAlign.right,
              ),
            ),
          ],
        );
      }).toList(),
    );
  }

  static pw.Widget _buildIndicatorsTable(List<Map<String, dynamic>> indicators) {
    return pw.Table(
      border: pw.TableBorder.all(color: _greyLight, width: 0.5),
      columnWidths: {
        0: const pw.FlexColumnWidth(2),
        1: const pw.FlexColumnWidth(1),
        2: const pw.FlexColumnWidth(1),
        3: const pw.FlexColumnWidth(1),
      },
      children: [
        pw.TableRow(
          decoration: const pw.BoxDecoration(color: _green),
          children: [
            _headerCell('Indicateur'),
            _headerCell('Objectif'),
            _headerCell('Reel'),
            _headerCell('Ecart'),
          ],
        ),
        ...indicators.map((ind) {
          return pw.TableRow(
            children: [
              _dataCell(ind['name'] as String? ?? '', align: pw.TextAlign.left),
              _dataCell('${ind['target'] ?? '-'}'),
              _dataCell('${ind['actual'] ?? '-'}'),
              _dataCell('${ind['gap'] ?? '-'}'),
            ],
          );
        }),
      ],
    );
  }

  static pw.Widget _headerCell(String text) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 6, horizontal: 8),
      child: pw.Text(
        text,
        style: pw.TextStyle(
          fontSize: 10,
          fontWeight: pw.FontWeight.bold,
          color: _white,
        ),
        textAlign: pw.TextAlign.center,
      ),
    );
  }

  static pw.Widget _dataCell(String text, {pw.TextAlign align = pw.TextAlign.center}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 5, horizontal: 8),
      child: pw.Text(
        text,
        style: const pw.TextStyle(fontSize: 10, color: _black),
        textAlign: align,
      ),
    );
  }
}
