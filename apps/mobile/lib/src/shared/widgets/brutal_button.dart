import 'package:flutter/material.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';

enum BrutalButtonSize {
  small,
  medium,
  large,
  xlarge,
}

enum BrutalButtonVariant {
  primary,
  secondary,
  danger,
  ghost,
}

class BrutalButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final BrutalButtonVariant variant;
  final BrutalButtonSize size;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final double? width;
  
  const BrutalButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.variant = BrutalButtonVariant.primary,
    this.size = BrutalButtonSize.medium,
    this.leadingIcon,
    this.trailingIcon,
    this.width,
  });
  
  factory BrutalButton.primary({
    Key? key,
    required String text,
    VoidCallback? onPressed,
    bool isLoading = false,
    BrutalButtonSize size = BrutalButtonSize.medium,
    IconData? leadingIcon,
    IconData? trailingIcon,
    double? width,
  }) => BrutalButton(
    key: key,
    text: text,
    onPressed: onPressed,
    isLoading: isLoading,
    variant: BrutalButtonVariant.primary,
    size: size,
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    width: width,
  );
  
  factory BrutalButton.secondary({
    Key? key,
    required String text,
    VoidCallback? onPressed,
    bool isLoading = false,
    BrutalButtonSize size = BrutalButtonSize.medium,
    IconData? leadingIcon,
    IconData? trailingIcon,
    double? width,
  }) => BrutalButton(
    key: key,
    text: text,
    onPressed: onPressed,
    isLoading: isLoading,
    variant: BrutalButtonVariant.secondary,
    size: size,
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    width: width,
  );
  
  factory BrutalButton.danger({
    Key? key,
    required String text,
    VoidCallback? onPressed,
    bool isLoading = false,
    BrutalButtonSize size = BrutalButtonSize.medium,
    IconData? leadingIcon,
    IconData? trailingIcon,
    double? width,
  }) => BrutalButton(
    key: key,
    text: text,
    onPressed: onPressed,
    isLoading: isLoading,
    variant: BrutalButtonVariant.danger,
    size: size,
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    width: width,
  );
  
  factory BrutalButton.ghost({
    Key? key,
    required String text,
    VoidCallback? onPressed,
    bool isLoading = false,
    BrutalButtonSize size = BrutalButtonSize.medium,
    IconData? leadingIcon,
    IconData? trailingIcon,
    double? width,
  }) => BrutalButton(
    key: key,
    text: text,
    onPressed: onPressed,
    isLoading: isLoading,
    variant: BrutalButtonVariant.ghost,
    size: size,
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    width: width,
  );
  
  @override
  State<BrutalButton> createState() => _BrutalButtonState();
}

class _BrutalButtonState extends State<BrutalButton> with SingleTickerProviderStateMixin {
  late AnimationController _pressController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;
  
  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      duration: BrutalTheme.durationFast,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.98).animate(
      CurvedAnimation(parent: _pressController, curve: BrutalTheme.curveDefault),
    );
  }
  
  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }
  
  void _handleTapDown(TapDownDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      setState(() => _isPressed = true);
      _pressController.forward();
    }
  }
  
  void _handleTapUp(TapUpDetails details) {
    if (_isPressed) {
      setState(() => _isPressed = false);
      _pressController.reverse();
    }
  }
  
  void _handleTapCancel() {
    if (_isPressed) {
      setState(() => _isPressed = false);
      _pressController.reverse();
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isEnabled = widget.onPressed != null && !widget.isLoading;
    
    // Determine colors based on variant
    Color backgroundColor;
    Color foregroundColor;
    BorderSide borderSide;
    List<BoxShadow> shadows;
    
    switch (widget.variant) {
      case BrutalButtonVariant.primary:
        backgroundColor = isDark ? BrutalTheme.mint : BrutalTheme.mint;
        foregroundColor = isDark ? BrutalTheme.inkDark : BrutalTheme.ink;
        borderSide = isDark ? BrutalTheme.borderSideDark : BrutalTheme.borderSideDefault;
        shadows = _isPressed ? BrutalTheme.shadowPressed : BrutalTheme.shadowCard;
        break;
      case BrutalButtonVariant.secondary:
        backgroundColor = isDark ? BrutalTheme.lilac : BrutalTheme.lilac;
        foregroundColor = isDark ? BrutalTheme.inkDark : BrutalTheme.ink;
        borderSide = isDark ? BrutalTheme.borderSideDark : BrutalTheme.borderSideDefault;
        shadows = _isPressed ? BrutalTheme.shadowPressed : BrutalTheme.shadowCard;
        break;
      case BrutalButtonVariant.danger:
        backgroundColor = isDark ? BrutalTheme.rose : BrutalTheme.rose;
        foregroundColor = isDark ? BrutalTheme.inkDark : BrutalTheme.ink;
        borderSide = isDark ? BrutalTheme.borderSideDark : BrutalTheme.borderSideDefault;
        shadows = _isPressed ? BrutalTheme.shadowPressed : BrutalTheme.shadowCard;
        break;
      case BrutalButtonVariant.ghost:
        backgroundColor = _isPressed 
          ? (isDark ? BrutalTheme.borderDark.withOpacity(0.1) : BrutalTheme.ink.withOpacity(0.05))
          : Colors.transparent;
        foregroundColor = isDark ? BrutalTheme.textDark : BrutalTheme.ink;
        borderSide = isDark ? BrutalTheme.borderSideDark : BrutalTheme.borderSideDefault;
        shadows = [];
        break;
    }
    
    // Size configuration
    double horizontalPadding;
    double verticalPadding;
    double fontSize;
    double minHeight;
    double minWidth;
    
    switch (widget.size) {
      case BrutalButtonSize.small:
        horizontalPadding = 16;
        verticalPadding = 8;
        fontSize = 12;
        minHeight = 40;
        minWidth = 40;
        break;
      case BrutalButtonSize.medium:
        horizontalPadding = 24;
        verticalPadding = 16;
        fontSize = 16;
        minHeight = 48;
        minWidth = 48;
        break;
      case BrutalButtonSize.large:
        horizontalPadding = 32;
        verticalPadding = 20;
        fontSize = 18;
        minHeight = 56;
        minWidth = 56;
        break;
      case BrutalButtonSize.xlarge:
        horizontalPadding = 40;
        verticalPadding = 24;
        fontSize = 20;
        minHeight = 64;
        minWidth = 64;
        break;
    }
    
    return GestureDetector(
      onTapDown: widget.onPressed != null && !widget.isLoading ? _handleTapDown : null,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedScale(
        scale: _isPressed ? 0.98 : 1.0,
        duration: BrutalTheme.durationFast,
        curve: BrutalTheme.curveDefault,
        child: AnimatedContainer(
          duration: BrutalTheme.durationFast,
          curve: BrutalTheme.curveDefault,
          width: widget.width,
          constraints: BoxConstraints(
            minHeight: minHeight,
            minWidth: minWidth,
          ),
          padding: EdgeInsets.symmetric(
            horizontal: horizontalPadding,
            vertical: verticalPadding,
          ),
          decoration: BoxDecoration(
            color: isEnabled ? backgroundColor : (isDark ? BrutalTheme.inkDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.1)),
            border: Border.all(
              color: isEnabled ? borderSide.color : (isDark ? BrutalTheme.borderDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.2)),
              width: borderSide.width,
            ),
            borderRadius: BrutalTheme.borderRadiusDefault,
            boxShadow: isEnabled ? shadows : [],
          ),
          child: Center(
            child: widget.isLoading
                ? SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (widget.leadingIcon != null) ...[
                        Icon(widget.leadingIcon, size: fontSize + 4, color: foregroundColor),
                        const SizedBox(width: 8),
                      ],
                      Text(
                        widget.text,
                        style: TextStyle(
                          fontFamily: BrutalTheme.fontFamilyBody,
                          fontWeight: FontWeight.w600,
                          fontSize: fontSize,
                          color: isEnabled ? foregroundColor : (isDark ? BrutalTheme.textDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.4)),
                          letterSpacing: 0.5,
                        ),
                      ),
                      if (widget.trailingIcon != null) ...[
                        const SizedBox(width: 8),
                        Icon(widget.trailingIcon, size: fontSize + 4, color: foregroundColor),
                      ],
                    ],
                  ),
          ),
        ),
      );
    }
  }
}