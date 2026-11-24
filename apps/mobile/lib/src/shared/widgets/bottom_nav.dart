import 'package:flutter/material.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';

class BottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  final bool isGuard;
  
  const BottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.isGuard = false,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = isGuard
        ? [
            _NavItem(icon: Icons.home, label: 'Dashboard', index: 0),
            _NavItem(icon: Icons.person_add, label: 'New Visitor', index: 1),
            _NavItem(icon: Icons.qr_code_scanner, label: 'Verify', index: 2),
            _NavItem(icon: Icons.list_alt, label: 'Pending', index: 3),
            _NavItem(icon: Icons.settings, label: 'Settings', index: 4),
          ]
        : [
            _NavItem(icon: Icons.home, label: 'Home', index: 0),
            _NavItem(icon: Icons.person_add, label: 'Invite', index: 1),
            _NavItem(icon: Icons.history, label: 'Visits', index: 2),
            _NavItem(icon: Icons.notifications, label: 'Notices', index: 3),
            _NavItem(icon: Icons.settings, label: 'Settings', index: 4),
          ];
    
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark ? BrutalTheme.inkDark : BrutalTheme.white,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark ? BrutalTheme.borderDark : BrutalTheme.ink,
            width: 3,
          ),
        ),
        boxShadow: Theme.of(context).brightness == Brightness.dark ? BrutalTheme.darkShadowHero : BrutalTheme.shadowHero,
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 72,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (index) {
              final item = items[index];
              final isActive = currentIndex == item.index;
              
              return Expanded(
                child: InkWell(
                  onTap: () => onTap(item.index),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: BrutalTheme.durationFast,
                        curve: BrutalTheme.curveDefault,
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isActive
                              ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.mint : BrutalTheme.mint)
                              : Colors.transparent,
                          border: Border.all(
                            color: isActive
                                ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.borderDark : BrutalTheme.ink)
                                : Colors.transparent,
                            width: 3,
                          ),
                          borderRadius: BrutalTheme.borderRadiusDefault,
                          boxShadow: isActive
                              ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.darkShadowCard : BrutalTheme.shadowCard)
                              : [],
                        ),
                        child: Icon(
                          item.icon,
                          size: 24,
                          color: isActive
                              ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.inkDark : BrutalTheme.ink)
                              : (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.textDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.5)),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.label,
                        style: TextStyle(
                          fontFamily: BrutalTheme.fontFamilyBody,
                          fontSize: 10,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                          color: isActive
                              ? (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.inkDark : BrutalTheme.ink)
                              : (Theme.of(context).brightness == Brightness.dark ? BrutalTheme.textDark.withOpacity(0.5) : BrutalTheme.ink.withOpacity(0.5)),
                        ),
                      ),
                    ],
                  ),
                );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;
  final int index;
  
  const _NavItem({
    required this.icon,
    required this.label,
    required this.index,
  });
}