import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// Daily record: counters +/- for oeufs, casses, mortalite + aliment + notes
class DailyRecordScreen extends ConsumerStatefulWidget {
  final String flockId;

  const DailyRecordScreen({super.key, required this.flockId});

  @override
  ConsumerState<DailyRecordScreen> createState() => _DailyRecordScreenState();
}

class _DailyRecordScreenState extends ConsumerState<DailyRecordScreen> {
  int _eggs = 150;
  int _broken = 8;
  int _mort = 2;
  final _feedController = TextEditingController(text: '24');
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _feedController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  int get _collected => (_eggs - _broken).clamp(0, 99999);

  void _save() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Saisie enregistree',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white,
          ),
        ),
        backgroundColor: AppColors.night,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 80),
      ),
    );
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.ivory,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar 48px: back + title + date
            SizedBox(
              height: 48,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.pop(),
                      child: const Icon(Icons.arrow_back,
                          size: 22, color: AppColors.night),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Saisie du jour',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '30 aout',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textMeta,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Body
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Flock name
                    const Text(
                      'Pondeuses A1',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.night,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Oeufs pondus counter
                    _CounterCard(
                      label: 'Oeufs pondus',
                      value: _eggs,
                      onDec: () =>
                          setState(() => _eggs = (_eggs - 1).clamp(0, 99999)),
                      onInc: () => setState(() => _eggs++),
                    ),
                    const SizedBox(height: 12),

                    // Oeufs casses counter
                    _CounterCard(
                      label: 'Oeufs casses',
                      value: _broken,
                      onDec: () => setState(
                          () => _broken = (_broken - 1).clamp(0, 99999)),
                      onInc: () => setState(() => _broken++),
                    ),
                    const SizedBox(height: 12),

                    // Oeufs collectes row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Oeufs collectes',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Text(
                            '$_collected',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Mortalite counter
                    _CounterCard(
                      label: 'Mortalite',
                      value: _mort,
                      onDec: () =>
                          setState(() => _mort = (_mort - 1).clamp(0, 99999)),
                      onInc: () => setState(() => _mort++),
                      extraChild: _mort > 0
                          ? Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Container(
                                height: 52,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border:
                                      Border.all(color: AppColors.inputBorder),
                                ),
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 14),
                                child: Row(
                                  children: [
                                    Text(
                                      'Cause : Maladie',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: AppColors.night
                                            .withValues(alpha: 0.75),
                                      ),
                                    ),
                                    const Spacer(),
                                    Icon(
                                      Icons.expand_more,
                                      size: 20,
                                      color: AppColors.textMeta,
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(height: 16),

                    // Aliment consomme
                    Text(
                      'Aliment consomme (kg)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      height: 52,
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.inputBorder),
                      ),
                      alignment: Alignment.centerLeft,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: TextField(
                        controller: _feedController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(
                            fontSize: 14, color: AppColors.night),
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                          isDense: true,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Notes
                    Text(
                      'Notes (optionnel)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      height: 64,
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.inputBorder),
                      ),
                      padding: const EdgeInsets.all(14),
                      child: TextField(
                        controller: _notesController,
                        maxLines: 2,
                        style: const TextStyle(
                            fontSize: 14, color: AppColors.night),
                        decoration: InputDecoration(
                          hintText: 'Observations du jour...',
                          hintStyle: TextStyle(
                              fontSize: 14, color: AppColors.textHint),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                          isDense: true,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Save button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Enregistrer',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Counter card: white card, radius 16, padding 14
/// Label 12px w500 alpha0.55
/// Row: [-] [value 36px w700] [+]
class _CounterCard extends StatelessWidget {
  final String label;
  final int value;
  final VoidCallback onDec;
  final VoidCallback onInc;
  final Widget? extraChild;

  const _CounterCard({
    required this.label,
    required this.value,
    required this.onDec,
    required this.onInc,
    this.extraChild,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 56,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Minus button: 44px circle, border, fond blanc
                GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onDec();
                  },
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.inputBorder),
                    ),
                    child: const Center(
                      child: Text(
                        '\u2212',
                        style: TextStyle(
                          fontSize: 22,
                          color: AppColors.night,
                        ),
                      ),
                    ),
                  ),
                ),
                // Value: 80px wide, center, 36px w700
                SizedBox(
                  width: 80,
                  child: Center(
                    child: Text(
                      '$value',
                      style: const TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w700,
                        color: AppColors.night,
                        fontFeatures: [FontFeature.tabularFigures()],
                      ),
                    ),
                  ),
                ),
                // Plus button: 44px circle, fond vert
                GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onInc();
                  },
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        '+',
                        style: TextStyle(
                          fontSize: 22,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (extraChild != null) extraChild!,
        ],
      ),
    );
  }
}
