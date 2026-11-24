import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_input.dart';
import 'package:gatelite_mobile/src/features/auth/providers/auth_provider.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});
  
  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _pushEnabled = true;
  bool _smsEnabled = true;
  bool _emailEnabled = false;
  bool _darkMode = false;
  String _language = 'en';
  String _selectedSociety = 'Green Valley Society';
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authStateProvider);
    final user = authState.value?.user;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Profile
            if (user != null) _UserProfileCard(user: user!),
            const SizedBox(height: 24),
            
            // Society
            _SectionHeader(title: 'Society'),
            const SizedBox(height: 12),
            _SettingsCard(
              child: Column(
                children: [
                  _SettingsTile(
                    icon: Icons.apartment,
                    title: 'Current Society',
                    subtitle: _selectedSociety,
                    onTap: () {
                      // Show society switcher
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Notifications
            _SectionHeader(title: 'Notifications'),
            const SizedBox(height: 12),
            _SettingsCard(
              child: Column(
                children: [
                  _SettingsSwitch(
                    icon: Icons.notifications_active,
                    title: 'Push Notifications',
                    subtitle: 'Real-time alerts for visitors, deliveries, SOS',
                    value: _pushEnabled,
                    onChanged: (v) => setState(() => _pushEnabled = v),
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsSwitch(
                    icon: Icons.sms,
                    title: 'SMS Notifications',
                    subtitle: 'Critical alerts via SMS (charges may apply)',
                    value: _smsEnabled,
                    onChanged: (v) => setState(() => _smsEnabled = v),
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsSwitch(
                    icon: Icons.email,
                    title: 'Email Notifications',
                    subtitle: 'Weekly digest and important updates',
                    value: _emailEnabled,
                    onChanged: (v) => setState(() => _emailEnabled = v),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Appearance
            _SectionHeader(title: 'Appearance'),
            const SizedBox(height: 12),
            _SettingsCard(
              child: Column(
                children: [
                  _SettingsSwitch(
                    icon: Icons.dark_mode,
                    title: 'Dark Mode',
                    subtitle: 'Use dark theme (follows system by default)',
                    value: _darkMode,
                    onChanged: (v) => setState(() => _darkMode = v),
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.language,
                    title: 'Language',
                    subtitle: _getLanguageLabel(_language),
                    onTap: _showLanguageDialog,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Security
            _SectionHeader(title: 'Security & Privacy'),
            const SizedBox(height: 12),
            _SettingsCard(
              child: Column(
                children: [
                  _SettingsTile(
                    icon: Icons.lock,
                    title: 'Change PIN/Password',
                    subtitle: 'Update your authentication credentials',
                    onTap: () {
                      // Navigate to change password
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.devices,
                    title: 'Manage Devices',
                    subtitle: 'View and remove linked devices',
                    onTap: () {
                      // Navigate to device management
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.privacy_tip,
                    title: 'Data Privacy',
                    subtitle: 'View data policy and export your data',
                    onTap: () {
                      _launchUrl('https://gatelite.app/privacy');
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.delete_forever,
                    title: 'Delete Account',
                    subtitle: 'Permanently delete your account and data',
                    onTap: _showDeleteAccountDialog,
                    isDestructive: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // About
            _SectionHeader(title: 'About'),
            const SizedBox(height: 12),
            _SettingsCard(
              child: Column(
                children: [
                  _SettingsTile(
                    icon: Icons.info,
                    title: 'About GateLite',
                    subtitle: 'Version 0.0.1',
                    onTap: () {
                      _launchUrl('https://gatelite.app');
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.description,
                    title: 'Terms of Service',
                    onTap: () {
                      _launchUrl('https://gatelite.app/terms');
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.privacy_tip,
                    title: 'Privacy Policy',
                    onTap: () {
                      _launchUrl('https://gatelite.app/privacy');
                    },
                  ),
                  const Divider(height: 1, color: BrutalTheme.ink.withOpacity(0.1)),
                  _SettingsTile(
                    icon: Icons.bug_report,
                    title: 'Report a Bug',
                    onTap: () {
                      _launchUrl('mailto:support@gatelite.app?subject=Bug Report');
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Logout
            BrutalButton.danger(
              text: 'Log Out',
              leadingIcon: Icons.logout,
              onPressed: () async {
                await ref.read(authStateProvider.notifier).logout();
                if (mounted) {
                  Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                }
              },
              size: BrutalButtonSize.large,
              width: double.infinity,
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
  
  String _getLanguageLabel(String code) {
    switch (code) {
      case 'en': return 'English';
      case 'hi': return 'Hindi';
      case 'gu': return 'Gujarati';
      default: return 'English';
    }
  }
  
  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: BrutalTheme.ink, width: 3),
        ),
        title: Text('Select Language', style: Theme.of(context).textTheme.headlineSmall),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _LanguageOption(code: 'en', label: 'English', selected: _language == 'en'),
            _LanguageOption(code: 'hi', label: 'Hindi', selected: _language == 'hi'),
            _LanguageOption(code: 'gu', label: 'Gujarati', selected: _language == 'gu'),
          ],
        ),
      ),
    );
  }
  
  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: BrutalTheme.ink, width: 3),
        ),
        title: Text('Delete Account', style: Theme.of(context).textTheme.headlineSmall),
        content: Text(
          'This will permanently delete your account and all data. This action cannot be undone.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        actions: [
          BrutalButton.ghost(
            text: 'Cancel',
            onPressed: () => Navigator.pop(context),
          ),
          BrutalButton.danger(
            text: 'Delete',
            onPressed: () {
              Navigator.pop(context);
              // Implement account deletion
            },
          ),
        ],
      ),
    );
  }
  
  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    // This is a placeholder - the actual build is above
    return Container();
  }
}

// Helper widgets
class _SectionHeader extends StatelessWidget {
  final String title;
  
  const _SectionHeader({required this.title});
  
  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
        color: BrutalTheme.ink,
        fontWeight: FontWeight.w700,
      ),
    );
  }
}

class _SettingsCard extends StatelessWidget {
  final Widget child;
  
  const _SettingsCard({super.key, required this.child});
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: BrutalTheme.white,
        border: Border.all(color: BrutalTheme.ink, width: 3),
        borderRadius: BrutalTheme.borderRadiusDefault,
        boxShadow: BrutalTheme.shadowCard,
      ),
      child: child,
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final bool isDestructive;
  
  const _SettingsTile({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.isDestructive = false,
  });
  
  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: onTap != null
              ? (isDestructive ? BrutalTheme.rose.withOpacity(0.1) : BrutalTheme.lilac.withOpacity(0.1))
              : BrutalTheme.ink.withOpacity(0.05),
          border: Border.all(
            color: onTap != null
                ? (isDestructive ? BrutalTheme.rose : BrutalTheme.lilac)
                : BrutalTheme.ink.withOpacity(0.2),
            width: 2),
          borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: onTap != null
                ? (isDestructive ? BrutalTheme.rose : BrutalTheme.lilac)
                : BrutalTheme.ink.withOpacity(0.4),
            size: 20,
          ),
        ),
      title: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          color: isDestructive ? BrutalTheme.rose : BrutalTheme.ink,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle!,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: BrutalTheme.ink.withOpacity(0.6),
              ),
            )
          : null,
      trailing: onTap != null
          ? const Icon(Icons.chevron_right, color: BrutalTheme.ink.withOpacity(0.4))
          : null,
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
}

class _SettingsSwitch extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  
  const _SettingsSwitch({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });
  
  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: BrutalTheme.lilac.withOpacity(0.1),
          border: Border.all(color: BrutalTheme.lilac, width: 2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: BrutalTheme.lilac, size: 20),
      ),
      title: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: BrutalTheme.ink.withOpacity(0.6),
        ),
      ),
      trailing: Switch(
        value: value,
        onChanged: (v) => onChanged(v),
        activeColor: BrutalTheme.mint,
        activeTrackColor: BrutalTheme.mint.withOpacity(0.3),
        inactiveThumbColor: BrutalTheme.ink,
        inactiveTrackColor: BrutalTheme.ink.withOpacity(0.2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
}

class _LanguageOption extends StatelessWidget {
  final String code;
  final String label;
  final bool selected;
  
  const _LanguageOption({
    super.key,
    required this.code,
    required this.label,
    required this.selected,
  });
  
  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        label,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
        ),
      ),
      trailing: selected
          ? const Icon(Icons.check, color: BrutalTheme.mint)
          : null,
      onTap: () {
        // Update language
        Navigator.pop(context);
      },
    );
  }
}