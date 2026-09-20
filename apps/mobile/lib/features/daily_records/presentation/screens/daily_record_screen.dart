import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';
import 'package:guettgui_mobile/features/daily_records/presentation/providers/daily_record_provider.dart';
import 'package:guettgui_mobile/features/flocks/presentation/providers/flock_provider.dart';
import 'package:intl/intl.dart';

/// Daily record: counters +/- for oeufs, casses, mortalite + aliment + notes
class DailyRecordScreen extends ConsumerStatefulWidget {
  final String flockId;

  const DailyRecordScreen({super.key, required this.flockId});

  @override
  ConsumerState<DailyRecordScreen> createState() => _DailyRecordScreenState();
}

class _DailyRecordScreenState extends ConsumerState<DailyRecordScreen> {
  int _eggs = 0;
  int _broken = 0;
  int _mort = 0;
  final _feedController = TextEditingController(text: '0');
  final _notesController = TextEditingController();
  bool _isSaving = false;

  @override
  void dispose() {
    _feedController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  int get _collected => (_eggs - _broken).clamp(0, 99999);

  Future<void> _save() async {
    final teamIdAsync = ref.read(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;
    if (teamId == null) return;

    setState(() => _isSaving = true);

    try {
      final notifier =
          ref.read(dailyRecordNotifierProvider(teamId).notifier);
      await notifier.createRecord({
        'flockId': widget.flockId,
        'date': DateTime.now().toIso8601String().split('T').first,
        'eggsLaid': _eggs,
        'eggsBroken': _broken,
        'eggsCollected': _collected,
        'mortalityCount': _mort,
        'feedConsumedKg': double.tryParse(_feedController.text) ?? 0,
        'notes': _notesController.text.isNotEmpty
            ? _notesController.text
            : null,
      });

      if (mounted) {
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
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Erreur: $e',
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 80),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final teamIdAsync = ref.watch(currentTeamIdProvider);
    final teamId = teamIdAsync.valueOrNull;

    // Get flock name from API
    String flockName = 'Lot';
    if (teamId != null) {
      final flockAsync = ref.watch(
        flockDetailProvider((teamId: teamId, flockId: widget.flockId)),
      );
      flockName = flockAsync.valueOrNull?.name ?? 'Lot';
    }

    final dateStr = DateFormat('d MMMM', 'fr_FR').format(DateTime.now());

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
                      dateStr,
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
                    Text(
                      flockName,
                      style: const TextStyle(
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
                        onPressed: _isSaving ? null : _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: _isSaving
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text(
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
