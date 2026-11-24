import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');

interface Token {
  value: string;
  type: string;
  description?: string;
}

interface Tokens {
  color: Record<string, Token>;
  spacing: Record<string, Token>;
  border: {
    width: Record<string, Token>;
    radius: Record<string, Token>;
    color: Token;
  };
  shadow: Record<string, Token>;
  typography: {
    fontFamily: Record<string, Token>;
    fontWeight: Record<string, Token>;
    fontSize: Record<string, Token>;
    lineHeight: Record<string, Token>;
  };
  touchTarget: Record<string, Token>;
  motion: {
    duration: Record<string, Token>;
    easing: Record<string, Token>;
  };
  zIndex: Record<string, Token>;
  breakpoints: Record<string, Token>;
}

const tokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'tokens.json'), 'utf-8')
) as Tokens;

function resolveValue(value: string, tokens: Tokens): string {
  return value.replace(/\{([^}]+)\}/g, (_, key) => {
    const parts = key.split('.');
    let obj: any = tokens;
    for (const part of parts) {
      obj = obj?.[part];
    }
    return obj?.value ?? value;
  });
}

function generateCSSVariables(tokens: Tokens): string {
  const lines = [':root {'];
  
  // Colors
  for (const [key, token] of Object.entries(tokens.color)) {
    lines.push(`  --${key}: ${token.value};`);
  }
  
  // Spacing
  for (const [key, token] of Object.entries(tokens.spacing)) {
    lines.push(`  --spacing-${key}: ${token.value};`);
  }
  
  // Border
  for (const [key, token] of Object.entries(tokens.border.width)) {
    lines.push(`  --border-width-${key}: ${token.value};`);
  }
  for (const [key, token] of Object.entries(tokens.border.radius)) {
    lines.push(`  --border-radius-${key}: ${token.value};`);
  }
  lines.push(`  --border-color: ${resolveValue(tokens.border.color.value, tokens)};`);
  
  // Shadow
  for (const [key, token] of Object.entries(tokens.shadow)) {
    lines.push(`  --shadow-${key}: ${resolveValue(token.value, tokens)};`);
  }
  
  // Typography
  for (const [key, token] of Object.entries(tokens.typography.fontFamily)) {
    lines.push(`  --font-family-${key}: ${token.value};`);
  }
  for (const [key, token] of Object.entries(tokens.typography.fontWeight)) {
    lines.push(`  --font-weight-${key}: ${token.value};`);
  }
  for (const [key, token] of Object.entries(tokens.typography.fontSize)) {
    lines.push(`  --font-size-${key}: ${token.value};`);
  }
  for (const [key, token] of Object.entries(tokens.typography.lineHeight)) {
    lines.push(`  --line-height-${key}: ${token.value};`);
  }
  
  // Touch targets
  for (const [key, token] of Object.entries(tokens.touchTarget)) {
    lines.push(`  --touch-target-${key}: ${token.value};`);
  }
  
  // Motion
  for (const [key, token] of Object.entries(tokens.motion.duration)) {
    lines.push(`  --motion-duration-${key}: ${token.value};`);
  }
  for (const [key, token] of Object.entries(tokens.motion.easing)) {
    lines.push(`  --motion-easing-${key}: ${token.value};`);
  }
  
  // Z-index
  for (const [key, token] of Object.entries(tokens.zIndex)) {
    lines.push(`  --z-${key}: ${token.value};`);
  }
  
  // Breakpoints
  for (const [key, token] of Object.entries(tokens.breakpoints)) {
    lines.push(`  --breakpoint-${key}: ${token.value};`);
  }
  
  // Dark mode
  lines.push('');
  lines.push('  /* Dark mode overrides */');
  lines.push('  --paper: var(--paperDark);');
  lines.push('  --ink: var(--textDark);');
  lines.push('  --border-color: var(--borderDark);');
  lines.push('  --shadow-card: 4px 4px 0 var(--shadowDark);');
  lines.push('  --shadow-hero: 6px 6px 0 var(--shadowDark);');
  lines.push('  --shadow-chip: 2px 2px 0 var(--shadowDark);');
  lines.push('  --shadow-pressed: 2px 2px 0 var(--shadowDark);');
  lines.push('  --shadow-hover: 6px 6px 0 var(--shadowDark);');
  lines.push('  --shadow-focus: 0 0 0 3px var(--borderDark), 0 0 0 6px var(--shadowDark);');
  
  lines.push('}');
  
  lines.push('');
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  :root {');
  lines.push('    --paper: var(--paperDark);');
  lines.push('    --ink: var(--textDark);');
  lines.push('    --border-color: var(--borderDark);');
  lines.push('    --shadow-card: 4px 4px 0 var(--shadowDark);');
  lines.push('    --shadow-hero: 6px 6px 0 var(--shadowDark);');
  lines.push('    --shadow-chip: 2px 2px 0 var(--shadowDark);');
  lines.push('    --shadow-pressed: 2px 2px 0 var(--shadowDark);');
  lines.push('    --shadow-hover: 6px 6px 0 var(--shadowDark);');
  lines.push('    --shadow-focus: 0 0 0 3px var(--borderDark), 0 0 0 6px var(--shadowDark);');
  lines.push('  }');
  lines.push('}');
  
  return lines.join('\n');
}

function generateTailwindTheme(tokens: Tokens): string {
  const theme: Record<string, any> = {
    extend: {
      colors: {},
      spacing: {},
      borderWidth: {},
      borderRadius: {},
      boxShadow: {},
      fontFamily: {},
      fontSize: {},
      fontWeight: {},
      lineHeight: {},
      transitionDuration: {},
      transitionTimingFunction: {},
      zIndex: {},
      screens: {},
      minHeight: {},
      minWidth: {},
    },
  };
  
  // Colors
  for (const [key, token] of Object.entries(tokens.color)) {
    theme.extend.colors[key] = token.value;
  }
  
  // Spacing
  for (const [key, token] of Object.entries(tokens.spacing)) {
    theme.extend.spacing[key] = token.value;
  }
  
  // Border width
  for (const [key, token] of Object.entries(tokens.border.width)) {
    theme.extend.borderWidth[key] = token.value;
  }
  
  // Border radius
  for (const [key, token] of Object.entries(tokens.border.radius)) {
    theme.extend.borderRadius[key] = token.value;
  }
  
  // Box shadow
  for (const [key, token] of Object.entries(tokens.shadow)) {
    theme.extend.boxShadow[key] = resolveValue(token.value, tokens);
  }
  
  // Font family
  for (const [key, token] of Object.entries(tokens.typography.fontFamily)) {
    theme.extend.fontFamily[key] = String(token.value).split(',').map(s => s.trim().replace(/['"]/g, ''));
  }
  
  // Font size
  for (const [key, token] of Object.entries(tokens.typography.fontSize)) {
    const size = token.value;
    const lineHeight = tokens.typography.lineHeight.normal.value;
    theme.extend.fontSize[key] = [size, { lineHeight }];
  }
  
  // Font weight
  for (const [key, token] of Object.entries(tokens.typography.fontWeight)) {
    theme.extend.fontWeight[key] = token.value;
  }
  
  // Line height
  for (const [key, token] of Object.entries(tokens.typography.lineHeight)) {
    theme.extend.lineHeight[key] = token.value;
  }
  
  // Touch targets as min-height/min-width
  for (const [key, token] of Object.entries(tokens.touchTarget)) {
    theme.extend.minHeight[`touch-${key}`] = token.value;
    theme.extend.minWidth[`touch-${key}`] = token.value;
  }
  
  // Motion
  for (const [key, token] of Object.entries(tokens.motion.duration)) {
    theme.extend.transitionDuration[key] = token.value;
  }
  for (const [key, token] of Object.entries(tokens.motion.easing)) {
    theme.extend.transitionTimingFunction[key] = token.value;
  }
  
  // Z-index
  for (const [key, token] of Object.entries(tokens.zIndex)) {
    theme.extend.zIndex[key] = token.value;
  }
  
  // Breakpoints
  for (const [key, token] of Object.entries(tokens.breakpoints)) {
    theme.extend.screens[key] = token.value;
  }
  
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(theme, null, 2)};`;
}

function generateFlutterTheme(tokens: Tokens): string {
  const colors = tokens.color;
  const spacing = tokens.spacing;
  const border = tokens.border;
  const shadow = tokens.shadow;
  const typography = tokens.typography;
  const touchTarget = tokens.touchTarget;
  const motion = tokens.motion;
  
  return `// GENERATED FILE - DO NOT EDIT MANUALLY
// Run 'pnpm tokens:build' in packages/design-tokens to regenerate

import 'package:flutter/material.dart';

/// BrutalTheme - Neo-brutalist design system for GateLite
/// Generated from tokens.json
class BrutalTheme {
  BrutalTheme._();

  // =========================================================================
  // COLORS
  // =========================================================================
  
  static const Color ink = Color(0xFF111111);
  static const Color paper = Color(0xFFFFFBF2);
  static const Color white = Color(0xFFFFFFFF);
  static const Color mint = Color(0xFFB8F2D0);
  static const Color peach = Color(0xFFFFD3B6);
  static const Color lilac = Color(0xFFD9C6FF);
  static const Color sky = Color(0xFFBFE3FF);
  static const Color butter = Color(0xFFFFF1A8);
  static const Color rose = Color(0xFFFFC2D1);
  static const Color tomato = Color(0xFFFF5A4E);
  
  // Dark mode
  static const Color inkDark = Color(0xFF0A0A0A);
  static const Color paperDark = Color(0xFF161616);
  static const Color textDark = Color(0xFFFFFBF2);
  static const Color borderDark = Color(0xFFB8F2D0);
  static const Color shadowDark = Color(0xFFD9C6FF);

  // Semantic color getters
  static Color get primary => mint;
  static Color get secondary => lilac;
  static Color get success => mint;
  static Color get warning => butter;
  static Color get error => rose;
  static Color get critical => tomato;
  static Color get info => sky;
  static Color get accent => peach;

  static Color get background => paper;
  static Color get surface => white;
  static Color get onBackground => ink;
  static Color get onSurface => ink;
  static Color get outline => ink;

  // Dark mode semantics
  static Color get darkBackground => paperDark;
  static Color get darkSurface => inkDark;
  static Color get darkOnBackground => textDark;
  static Color get darkOnSurface => textDark;
  static Color get darkOutline => borderDark;

  // =========================================================================
  // SPACING (4px base grid)
  // =========================================================================
  
  static const double space1 = 4.0;
  static const double space2 = 8.0;
  static const double space3 = 12.0;
  static const double space4 = 16.0;
  static const double space6 = 24.0;
  static const double space8 = 32.0;
  static const double space12 = 48.0;

  static double sp(int multiplier) => 4.0 * multiplier;

  // =========================================================================
  // BORDERS
  // =========================================================================
  
  static const double borderWidthThin = 2.0;
  static const double borderWidthDefault = 3.0;
  
  static const BorderRadius borderRadiusNone = BorderRadius.zero;
  static const BorderRadius borderRadiusDefault = BorderRadius.all(Radius.circular(12.0));
  static const BorderRadius borderRadiusPill = BorderRadius.all(Radius.circular(999.0));

  static BorderSide get borderSideDefault => const BorderSide(color: ink, width: borderWidthDefault);
  static BorderSide get borderSideThin => const BorderSide(color: ink, width: borderWidthThin);
  static BorderSide get borderSideDark => const BorderSide(color: borderDark, width: borderWidthDefault);

  // =========================================================================
  // SHADOWS (hard offset, zero blur)
  // =========================================================================
  
  static List<BoxShadow> get shadowCard => [
    const BoxShadow(
      color: ink,
      offset: Offset(4, 4),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get shadowHero => [
    const BoxShadow(
      color: ink,
      offset: Offset(6, 6),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get shadowChip => [
    const BoxShadow(
      color: ink,
      offset: Offset(2, 2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get shadowPressed => [
    const BoxShadow(
      color: ink,
      offset: Offset(2, 2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get shadowHover => [
    const BoxShadow(
      color: ink,
      offset: Offset(-2, -2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get shadowFocus => [
    const BoxShadow(
      color: ink,
      offset: Offset(0, 0),
      blurRadius: 0,
      spreadRadius: 3,
    ),
    const BoxShadow(
      color: lilac,
      offset: Offset(0, 0),
      blurRadius: 0,
      spreadRadius: 6,
    ),
  ];

  // Dark mode shadows
  static List<BoxShadow> get darkShadowCard => [
    const BoxShadow(
      color: shadowDark,
      offset: Offset(4, 4),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get darkShadowHero => [
    const BoxShadow(
      color: shadowDark,
      offset: Offset(6, 6),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get darkShadowChip => [
    const BoxShadow(
      color: shadowDark,
      offset: Offset(2, 2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get darkShadowPressed => [
    const BoxShadow(
      color: shadowDark,
      offset: Offset(2, 2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get darkShadowHover => [
    const BoxShadow(
      color: shadowDark,
      offset: Offset(-2, -2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
  
  static List<BoxShadow> get darkShadowFocus => [
    const BoxShadow(
      color: borderDark,
      offset: Offset(0, 0),
      blurRadius: 0,
      spreadRadius: 3,
    ),
    const BoxShadow(
      color: shadowDark,
      offset: Offset(0, 0),
      blurRadius: 0,
      spreadRadius: 6,
    ),
  ];

  // =========================================================================
  // TYPOGRAPHY
  // =========================================================================
  
  static const String fontFamilyHeading = 'SpaceGrotesk';
  static const String fontFamilyBody = 'Inter';
  static const String fontFamilyMono = 'JetBrainsMono';

  static const FontWeight weightNormal = FontWeight.w400;
  static const FontWeight weightMedium = FontWeight.w500;
  static const FontWeight weightSemiBold = FontWeight.w600;
  static const FontWeight weightBold = FontWeight.w700;

  static const double fontSizeXs = 12.0;
  static const double fontSizeSm = 14.0;
  static const double fontSizeBase = 16.0;
  static const double fontSizeLg = 20.0;
  static const double fontSizeXl = 24.0;
  static const double fontSize2xl = 32.0;
  static const double fontSize3xl = 40.0;

  static const double lineHeightTight = 1.1;
  static const double lineHeightNormal = 1.5;
  static const double lineHeightRelaxed = 1.6;

  // Text styles
  static TextStyle get heading1 => TextStyle(
    fontFamily: fontFamilyHeading,
    fontWeight: weightBold,
    fontSize: fontSize3xl,
    height: lineHeightTight,
    color: ink,
  );

  static TextStyle get heading2 => TextStyle(
    fontFamily: fontFamilyHeading,
    fontWeight: weightBold,
    fontSize: fontSize2xl,
    height: lineHeightTight,
    color: ink,
  );

  static TextStyle get heading3 => TextStyle(
    fontFamily: fontFamilyHeading,
    fontWeight: weightBold,
    fontSize: fontSizeXl,
    height: lineHeightTight,
    color: ink,
  );

  static TextStyle get heading4 => TextStyle(
    fontFamily: fontFamilyHeading,
    fontWeight: weightBold,
    fontSize: fontSizeLg,
    height: lineHeightTight,
    color: ink,
  );

  static TextStyle get bodyLarge => TextStyle(
    fontFamily: fontFamilyBody,
    fontWeight: weightNormal,
    fontSize: fontSizeLg,
    height: lineHeightNormal,
    color: ink,
  );

  static TextStyle get body => TextStyle(
    fontFamily: fontFamilyBody,
    fontWeight: weightNormal,
    fontSize: fontSizeBase,
    height: lineHeightNormal,
    color: ink,
  );

  static TextStyle get bodySmall => TextStyle(
    fontFamily: fontFamilyBody,
    fontWeight: weightNormal,
    fontSize: fontSizeSm,
    height: lineHeightNormal,
    color: ink,
  );

  static TextStyle get label => TextStyle(
    fontFamily: fontFamilyBody,
    fontWeight: weightMedium,
    fontSize: fontSizeSm,
    height: lineHeightNormal,
    color: ink,
  );

  static TextStyle get code => TextStyle(
    fontFamily: fontFamilyMono,
    fontWeight: weightNormal,
    fontSize: fontSizeBase,
    height: lineHeightNormal,
    color: ink,
  );

  static TextStyle get otp => TextStyle(
    fontFamily: fontFamilyMono,
    fontWeight: weightBold,
    fontSize: fontSize2xl,
    height: lineHeightTight,
    color: ink,
    letterSpacing: 8.0,
  );

  // Dark mode text styles
  static TextStyle get darkHeading1 => heading1.copyWith(color: textDark);
  static TextStyle get darkHeading2 => heading2.copyWith(color: textDark);
  static TextStyle get darkHeading3 => heading3.copyWith(color: textDark);
  static TextStyle get darkHeading4 => heading4.copyWith(color: textDark);
  static TextStyle get darkBodyLarge => bodyLarge.copyWith(color: textDark);
  static TextStyle get darkBody => body.copyWith(color: textDark);
  static TextStyle get darkBodySmall => bodySmall.copyWith(color: textDark);
  static TextStyle get darkLabel => label.copyWith(color: textDark);
  static TextStyle get darkCode => code.copyWith(color: textDark);
  static TextStyle get darkOtp => otp.copyWith(color: textDark);

  // =========================================================================
  // TOUCH TARGETS
  // =========================================================================
  
  static const double touchTargetMin = 48.0;
  static const double touchTargetGuardPrimary = 56.0;

  // =========================================================================
  // MOTION
  // =========================================================================
  
  static const Duration durationFast = Duration(milliseconds: 120);
  static const Duration durationNormal = Duration(milliseconds: 150);
  static const Duration durationSlow = Duration(milliseconds: 180);
  
  static const Curve curveDefault = Curves.easeOut;

  // =========================================================================
  // Z-INDEX (for web compatibility reference)
  // =========================================================================
  
  static const int zBase = 0;
  static const int zDropdown = 100;
  static const int zSticky = 200;
  static const int zModal = 300;
  static const int zToast = 400;
  static const int zTooltip = 500;

  // =========================================================================
  // COMPONENT THEMES
  // =========================================================================
  
  /// Button variants
  static ButtonStyle buttonPrimary({bool isDark = false, bool isPressed = false}) {
    final bg = isDark ? mint : mint;
    final fg = isDark ? inkDark : ink;
    final sh = isDark 
      ? (isPressed ? darkShadowPressed : darkShadowCard)
      : (isPressed ? shadowPressed : shadowCard);
    final offset = isPressed ? const Offset(2, 2) : Offset.zero;
    
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.all(bg),
      foregroundColor: WidgetStateProperty.all(fg),
      elevation: WidgetStateProperty.all(0),
      shadowColor: WidgetStateProperty.all(Colors.transparent),
      overlayColor: WidgetStateProperty.all(Colors.transparent),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: borderRadiusDefault,
          side: isDark ? borderSideDark : borderSideDefault,
        ),
      ),
      padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
      minimumSize: WidgetStateProperty.all(const Size(touchTargetMin, touchTargetMin)),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    ).copyWith(
      surfaceTintColor: WidgetStateProperty.all(Colors.transparent),
    );
  }

  static ButtonStyle buttonSecondary({bool isDark = false, bool isPressed = false}) {
    final bg = isDark ? lilac : lilac;
    final fg = isDark ? inkDark : ink;
    final sh = isDark 
      ? (isPressed ? darkShadowPressed : darkShadowCard)
      : (isPressed ? shadowPressed : shadowCard);
    
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.all(bg),
      foregroundColor: WidgetStateProperty.all(fg),
      elevation: WidgetStateProperty.all(0),
      shadowColor: WidgetStateProperty.all(Colors.transparent),
      overlayColor: WidgetStateProperty.all(Colors.transparent),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: borderRadiusDefault,
          side: isDark ? borderSideDark : borderSideDefault,
        ),
      ),
      padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
      minimumSize: WidgetStateProperty.all(const Size(touchTargetMin, touchTargetMin)),
    );
  }

  static ButtonStyle buttonDanger({bool isDark = false, bool isPressed = false}) {
    final bg = isDark ? rose : rose;
    final fg = isDark ? inkDark : ink;
    final sh = isDark 
      ? (isPressed ? darkShadowPressed : darkShadowCard)
      : (isPressed ? shadowPressed : shadowCard);
    
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.all(bg),
      foregroundColor: WidgetStateProperty.all(fg),
      elevation: WidgetStateProperty.all(0),
      shadowColor: WidgetStateProperty.all(Colors.transparent),
      overlayColor: WidgetStateProperty.all(Colors.transparent),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: borderRadiusDefault,
          side: isDark ? borderSideDark : borderSideDefault,
        ),
      ),
      padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
      minimumSize: WidgetStateProperty.all(const Size(touchTargetMin, touchTargetMin)),
    );
  }

  static ButtonStyle buttonGhost({bool isDark = false, bool isPressed = false}) {
    final bg = isPressed ? (isDark ? borderDark.withOpacity(0.1) : ink.withOpacity(0.05)) : Colors.transparent;
    final fg = isDark ? textDark : ink;
    final border = isDark ? borderSideDark : borderSideDefault;
    
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.all(bg),
      foregroundColor: WidgetStateProperty.all(fg),
      elevation: WidgetStateProperty.all(0),
      shadowColor: WidgetStateProperty.all(Colors.transparent),
      overlayColor: WidgetStateProperty.all(Colors.transparent),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: borderRadiusDefault,
          side: border,
        ),
      ),
      padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
      minimumSize: WidgetStateProperty.all(const Size(touchTargetMin, touchTargetMin)),
    );
  }

  // =========================================================================
  // THEME DATA
  // =========================================================================
  
  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: mint,
      secondary: lilac,
      tertiary: peach,
      surface: white,
      background: paper,
      error: rose,
      onPrimary: ink,
      onSecondary: ink,
      onSurface: ink,
      onBackground: ink,
      onError: ink,
      outline: ink,
      outlineVariant: ink,
      shadow: ink,
    ),
    fontFamily: fontFamilyBody,
    textTheme: TextTheme(
      displayLarge: heading1,
      displayMedium: heading2,
      displaySmall: heading3,
      headlineLarge: heading4,
      headlineMedium: heading4.copyWith(fontSize: fontSizeLg),
      headlineSmall: heading4.copyWith(fontSize: fontSizeBase),
      titleLarge: bodyLarge.copyWith(fontWeight: weightSemiBold),
      titleMedium: body.copyWith(fontWeight: weightMedium),
      titleSmall: label,
      bodyLarge: bodyLarge,
      bodyMedium: body,
      bodySmall: bodySmall,
      labelLarge: label,
      labelMedium: label.copyWith(fontSize: fontSizeXs),
      labelSmall: label.copyWith(fontSize: fontSizeXs),
    ),
    cardTheme: CardThemeData(
      color: white,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      shadowColor: ink,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadiusDefault,
        side: borderSideDefault,
      ),
      margin: EdgeInsets.all(space4),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: borderSideDefault,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: borderSideDefault,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: lilac, width: 3),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: rose, width: 3),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: tomato, width: 3),
      ),
      labelStyle: label,
      hintStyle: bodySmall.copyWith(color: ink.withOpacity(0.5)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: buttonPrimary(),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: buttonGhost(),
    ),
    textButtonTheme: TextButtonThemeData(
      style: buttonGhost(),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: white,
      selectedColor: mint,
      disabledColor: ink.withOpacity(0.1),
      labelStyle: label,
      secondaryLabelStyle: label.copyWith(color: ink),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: borderRadiusPill,
        side: borderSideDefault,
      ),
      side: borderSideDefault,
      elevation: 0,
      shadowColor: ink,
      pressElevation: 0,
    ),
    dividerTheme: DividerThemeData(
      color: ink,
      thickness: 3,
      space: space4,
    ),
  );

  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: mint,
      secondary: lilac,
      tertiary: peach,
      surface: inkDark,
      background: paperDark,
      error: rose,
      onPrimary: inkDark,
      onSecondary: inkDark,
      onSurface: textDark,
      onBackground: textDark,
      onError: inkDark,
      outline: borderDark,
      outlineVariant: borderDark,
      shadow: shadowDark,
    ),
    fontFamily: fontFamilyBody,
    textTheme: TextTheme(
      displayLarge: darkHeading1,
      displayMedium: darkHeading2,
      displaySmall: darkHeading3,
      headlineLarge: darkHeading4,
      headlineMedium: darkHeading4.copyWith(fontSize: fontSizeLg),
      headlineSmall: darkHeading4.copyWith(fontSize: fontSizeBase),
      titleLarge: darkBodyLarge.copyWith(fontWeight: weightSemiBold),
      titleMedium: darkBody.copyWith(fontWeight: weightMedium),
      titleSmall: darkLabel,
      bodyLarge: darkBodyLarge,
      bodyMedium: darkBody,
      bodySmall: darkBodySmall,
      labelLarge: darkLabel,
      labelMedium: darkLabel.copyWith(fontSize: fontSizeXs),
      labelSmall: darkLabel.copyWith(fontSize: fontSizeXs),
    ),
    cardTheme: CardThemeData(
      color: inkDark,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      shadowColor: shadowDark,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadiusDefault,
        side: borderSideDark,
      ),
      margin: EdgeInsets.all(space4),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inkDark,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: borderSideDark,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: borderSideDark,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: lilac, width: 3),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: rose, width: 3),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: borderRadiusDefault,
        borderSide: const BorderSide(color: tomato, width: 3),
      ),
      labelStyle: darkLabel,
      hintStyle: darkBodySmall.copyWith(color: textDark.withOpacity(0.5)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: buttonPrimary(isDark: true),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: buttonGhost(isDark: true),
    ),
    textButtonTheme: TextButtonThemeData(
      style: buttonGhost(isDark: true),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: inkDark,
      selectedColor: mint,
      disabledColor: textDark.withOpacity(0.1),
      labelStyle: darkLabel,
      secondaryLabelStyle: darkLabel.copyWith(color: textDark),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: borderRadiusPill,
        side: borderSideDark,
      ),
      side: borderSideDark,
      elevation: 0,
      shadowColor: shadowDark,
      pressElevation: 0,
    ),
    dividerTheme: DividerThemeData(
      color: borderDark,
      thickness: 3,
      space: space4,
    ),
  );
}
`;
}

function main() {
  const outDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Generate CSS variables
  const css = generateCSSVariables(tokens);
  fs.writeFileSync(path.resolve(outDir, 'css-variables.css'), css);
  console.log('Generated: dist/css-variables.css');
  
  // Generate Tailwind theme
  const tailwind = generateTailwindTheme(tokens);
  fs.writeFileSync(path.resolve(outDir, 'tailwind-theme.js'), tailwind);
  console.log('Generated: dist/tailwind-theme.js');
  
  // Generate Flutter theme
  const flutter = generateFlutterTheme(tokens);
  fs.writeFileSync(path.resolve(outDir, 'brutal-theme.dart'), flutter);
  console.log('Generated: dist/brutal-theme.dart');
  
  // Generate index.ts for TypeScript consumers
  const indexTs = `// GENERATED FILE - DO NOT EDIT MANUALLY
export const tokens = ${JSON.stringify(tokens, null, 2)} as const;

export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type BorderWidthToken = keyof typeof tokens.border.width;
export type BorderRadiusToken = keyof typeof tokens.border.radius;
export type ShadowToken = keyof typeof tokens.shadow;
export type FontSizeToken = keyof typeof tokens.typography.fontSize;
export type TouchTargetToken = keyof typeof tokens.touchTarget;
`;
  fs.writeFileSync(path.resolve(outDir, 'index.ts'), indexTs);
  console.log('Generated: dist/index.ts');
  
  console.log('\\nAll design tokens generated successfully!');
}

main();