import 'package:flutter/material.dart';

class BrutalTheme {
  BrutalTheme._();

  // Colors
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

  // Semantic colors
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

  static Color get darkBackground => paperDark;
  static Color get darkSurface => inkDark;
  static Color get darkOnBackground => textDark;
  static Color get darkOnSurface => textDark;
  static Color get darkOutline => borderDark;

  // Spacing (4px base grid)
  static const double space1 = 4.0;
  static const double space2 = 8.0;
  static const double space3 = 12.0;
  static const double space4 = 16.0;
  static const double space6 = 24.0;
  static const double space8 = 32.0;
  static const double space12 = 48.0;

  static double sp(int multiplier) => 4.0 * multiplier;

  // Borders
  static const double borderWidthThin = 2.0;
  static const double borderWidthDefault = 3.0;
  
  static const BorderRadius borderRadiusNone = BorderRadius.zero;
  static const BorderRadius borderRadiusDefault = BorderRadius.all(Radius.circular(12.0));
  static const BorderRadius borderRadiusPill = BorderRadius.all(Radius.circular(999.0));

  static BorderSide get borderSideDefault => const BorderSide(color: ink, width: borderWidthDefault);
  static BorderSide get borderSideThin => const BorderSide(color: ink, width: borderWidthThin);
  static BorderSide get borderSideDark => const BorderSide(color: borderDark, width: borderWidthDefault);

  // Shadows (hard offset, zero blur)
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

  // Typography
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

  // Touch targets
  static const double touchTargetMin = 48.0;
  static const double touchTargetGuardPrimary = 56.0;

  // Motion
  static const Duration durationFast = Duration(milliseconds: 120);
  static const Duration durationNormal = Duration(milliseconds: 150);
  static const Duration durationSlow = Duration(milliseconds: 180);
  
  static const Curve curveDefault = Curves.easeOut;

  // Component Themes
  static ButtonStyle buttonPrimary({bool isDark = false, bool isPressed = false}) {
    final bg = isDark ? mint : mint;
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