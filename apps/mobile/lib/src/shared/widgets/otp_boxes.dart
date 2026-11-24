import 'package:flutter/material.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';

class OtpBoxes extends StatelessWidget {
  final List<TextEditingController> controllers;
  final List<FocusNode> focusNodes;
  final Function(String, int) onChanged;
  final double boxSize;
  final double spacing;
  
  const OtpBoxes({
    super.key,
    required this.controllers,
    required this.focusNodes,
    required this.onChanged,
    this.boxSize = 56,
    this.spacing = 12,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(6, (index) {
        return Container(
          width: boxSize,
          height: boxSize,
          margin: EdgeInsets.symmetric(horizontal: spacing / 2),
          child: TextFormField(
            controller: controllers[index],
            focusNode: focusNodes[index],
            textAlign: TextAlign.center,
            style: theme.textTheme.displaySmall?.copyWith(
              fontFamily: BrutalTheme.fontFamilyMono,
              fontWeight: FontWeight.w700,
              color: BrutalTheme.ink,
              letterSpacing: 0,
            ),
            keyboardType: TextInputType.number,
            maxLength: 1,
            autofocus: index == 0,
            textInputAction: index == 5 ? TextInputAction.done : TextInputAction.next,
            decoration: InputDecoration(
              counterText: '',
              filled: true,
              fillColor: BrutalTheme.white,
              contentPadding: EdgeInsets.zero,
              border: OutlineInputBorder(
                borderRadius: BrutalTheme.borderRadiusDefault,
                borderSide: const BorderSide(color: BrutalTheme.ink, width: 3),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BrutalTheme.borderRadiusDefault,
                borderSide: const BorderSide(color: BrutalTheme.ink, width: 3),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BrutalTheme.borderRadiusDefault,
                borderSide: const BorderSide(color: BrutalTheme.lilac, width: 3),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BrutalTheme.borderRadiusDefault,
                borderSide: const BorderSide(color: BrutalTheme.rose, width: 3),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BrutalTheme.borderRadiusDefault,
                borderSide: const BorderSide(color: BrutalTheme.tomato, width: 3),
              ),
            ),
            onChanged: (value) => onChanged(value, index),
            onTapOutside: (event) => FocusScope.of(context).unfocus(),
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
            ],
          );
      }),
    );
  }
}