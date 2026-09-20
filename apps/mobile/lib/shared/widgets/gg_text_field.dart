import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:guettgui_mobile/core/constants/app_colors.dart';

/// Text field: 52px height, radius 12px, border rgba(29,29,27,0.12)
/// Label: 12px w500 rgba(29,29,27,0.55) above with 6px gap
class GGTextField extends StatelessWidget {
  final String label;
  final String? hint;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  final IconData? prefixIcon;
  final Widget? suffix;
  final bool obscureText;
  final int maxLines;
  final int? maxLength;
  final bool enabled;
  final List<TextInputFormatter>? inputFormatters;
  final FocusNode? focusNode;
  final TextInputAction? textInputAction;
  final VoidCallback? onEditingComplete;
  final String? initialValue;
  final bool autofocus;

  const GGTextField({
    super.key,
    required this.label,
    this.hint,
    this.controller,
    this.validator,
    this.onChanged,
    this.keyboardType,
    this.prefixIcon,
    this.suffix,
    this.obscureText = false,
    this.maxLines = 1,
    this.maxLength,
    this.enabled = true,
    this.inputFormatters,
    this.focusNode,
    this.textInputAction,
    this.onEditingComplete,
    this.initialValue,
    this.autofocus = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Label 12px w500 alpha0.55
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        // Input 52px radius 12px
        SizedBox(
          height: maxLines > 1 ? null : 52,
          child: TextFormField(
            controller: controller,
            initialValue: initialValue,
            validator: validator,
            onChanged: onChanged,
            keyboardType: keyboardType,
            obscureText: obscureText,
            maxLines: maxLines,
            maxLength: maxLength,
            enabled: enabled,
            inputFormatters: inputFormatters,
            focusNode: focusNode,
            textInputAction: textInputAction,
            onEditingComplete: onEditingComplete,
            autofocus: autofocus,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.night,
            ),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(
                fontSize: 14,
                color: AppColors.textHint,
              ),
              fillColor: AppColors.white,
              filled: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 14,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.inputBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.inputBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.primary, width: 2),
              ),
              prefixIcon: prefixIcon != null
                  ? Icon(prefixIcon, size: 20, color: AppColors.textMeta)
                  : null,
              suffixIcon: suffix,
              counterText: '',
            ),
          ),
        ),
      ],
    );
  }
}
