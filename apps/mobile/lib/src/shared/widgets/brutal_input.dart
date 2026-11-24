import 'package:flutter/material.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';

class BrutalInput extends StatefulWidget {
  final TextEditingController? controller;
  final String? labelText;
  final String? hintText;
  final String? prefixText;
  final String? suffixText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String)? onFieldSubmitted;
  final bool enabled;
  final bool readOnly;
  final int maxLines;
  final int? maxLength;
  final TextCapitalization textCapitalization;
  final bool autofocus;
  
  const BrutalInput({
    super.key,
    this.controller,
    this.labelText,
    this.hintText,
    this.prefixText,
    this.suffixText,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.textInputAction = TextInputAction.next,
    this.validator,
    this.onChanged,
    this.onFieldSubmitted,
    this.enabled = true,
    this.readOnly = false,
    this.maxLines = 1,
    this.maxLength,
    this.textCapitalization = TextCapitalization.none,
    this.autofocus = false,
  });
  
  @override
  State<BrutalInput> createState() => _BrutalInputState();
}

class _BrutalInputState extends State<BrutalInput> {
  late FocusNode _focusNode;
  bool _hasFocus = false;
  bool _obscureText = false;
  
  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
    _obscureText = widget.obscureText;
  }
  
  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _focusNode.dispose();
    super.dispose();
  }
  
  void _onFocusChange() {
    setState(() => _hasFocus = _focusNode.hasFocus);
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final hasError = widget.validator != null && widget.controller?.text.isNotEmpty == true && 
                     widget.validator!(widget.controller!.text) != null;
    
    final borderColor = hasError 
        ? BrutalTheme.rose 
        : (_hasFocus ? BrutalTheme.lilac : BrutalTheme.ink);
    final borderWidth = _hasFocus || hasError ? 3.0 : 3.0;
    final focusRingColor = hasError ? BrutalTheme.rose : BrutalTheme.lilac;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.labelText != null) ...[
          Text(
            widget.labelText!,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: BrutalTheme.ink,
            ),
          ),
          const SizedBox(height: 8),
        ],
        Stack(
          children: [
            // Focus ring
            AnimatedContainer(
              duration: BrutalTheme.durationFast,
              curve: BrutalTheme.curveDefault,
              decoration: BoxDecoration(
                borderRadius: BrutalTheme.borderRadiusDefault,
                boxShadow: _hasFocus || hasError
                    ? [
                        BoxShadow(
                          color: focusRingColor.withOpacity(0.3),
                          blurRadius: 0,
                          spreadRadius: 3,
                        ),
                        BoxShadow(
                          color: BrutalTheme.ink.withOpacity(0.3),
                          blurRadius: 0,
                          spreadRadius: 6,
                        ),
                      ]
                    : [],
              ),
              child: TextFormField(
                controller: widget.controller,
                focusNode: _focusNode,
                obscureText: _obscureText,
                keyboardType: widget.keyboardType,
                textInputAction: widget.textInputAction,
                validator: widget.validator,
                onChanged: widget.onChanged,
                onFieldSubmitted: widget.onFieldSubmitted,
                enabled: widget.enabled,
                readOnly: widget.readOnly,
                maxLines: widget.maxLines,
                maxLength: widget.maxLength,
                textCapitalization: widget.textCapitalization,
                autofocus: widget.autofocus,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: BrutalTheme.ink,
                  fontFamily: BrutalTheme.fontFamilyBody,
                ),
                decoration: InputDecoration(
                  hintText: widget.hintText,
                  hintStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: BrutalTheme.ink.withOpacity(0.4),
                  ),
                  prefixText: widget.prefixText,
                  prefixStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w500,
                  ),
                  suffixText: widget.suffixText,
                  suffixStyle: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w500,
                  ),
                  prefixIcon: widget.prefixIcon != null
                      ? Padding(
                          padding: const EdgeInsets.all(16),
                          child: IconTheme(
                            data: IconThemeData(color: BrutalTheme.ink.withOpacity(0.6)),
                            child: widget.prefixIcon!,
                          ),
                        )
                      : null,
                  suffixIcon: widget.suffixIcon != null
                      ? Padding(
                          padding: const EdgeInsets.all(16),
                          child: IconTheme(
                            data: IconThemeData(color: BrutalTheme.ink.withOpacity(0.6)),
                            child: widget.suffixIcon!,
                          ),
                        )
                      : (widget.obscureText
                          ? IconButton(
                              icon: Icon(
                                _obscureText ? Icons.visibility_off : Icons.visibility,
                                color: BrutalTheme.ink.withOpacity(0.6),
                              ),
                              onPressed: () => setState(() => _obscureText = !_obscureText),
                            )
                          : null),
                  filled: true,
                  fillColor: widget.enabled 
                      ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.inkDark : BrutalTheme.white)
                      : (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.inkDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.1)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  border: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: BorderSide(
                      color: borderColor,
                      width: borderWidth,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: BorderSide(
                      color: hasError ? BrutalTheme.rose : BrutalTheme.ink,
                      width: 3.0,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: BorderSide(
                      color: hasError ? BrutalTheme.rose : BrutalTheme.lilac,
                      width: 3.0,
                    ),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: const BorderSide(color: BrutalTheme.rose, width: 3.0),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: const BorderSide(color: BrutalTheme.tomato, width: 3.0),
                  ),
                  disabledBorder: OutlineInputBorder(
                    borderRadius: BrutalTheme.borderRadiusDefault,
                    borderSide: BorderSide(
                      color: BrutalTheme.ink.withOpacity(0.2),
                      width: 3.0,
                    ),
                  ),
                  errorStyle: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: BrutalTheme.rose,
                    fontWeight: FontWeight.w500,
                  ),
                  counterStyle: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: BrutalTheme.ink.withOpacity(0.4),
                  ),
                ),
              ),
            ),
          ],
        ),
        if (widget.validator != null && widget.controller?.text.isNotEmpty == true) ...[
          const SizedBox(height: 8),
          AnimatedSwitcher(
            duration: BrutalTheme.durationFast,
            child: widget.validator!(widget.controller!.text) != null
                ? Padding(
                    key: ValueKey(widget.controller!.text),
                    padding: const EdgeInsets.only(top: 8, left: 4),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, size: 16, color: BrutalTheme.rose),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            widget.validator!(widget.controller!.text)!,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: BrutalTheme.rose,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      );
    }
  }
}