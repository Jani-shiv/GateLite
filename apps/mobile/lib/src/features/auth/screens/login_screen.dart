import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/features/auth/providers/auth_provider.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_input.dart';
import 'package:uuid/uuid.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  String? _error;
  
  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }
  
  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() {
      _isLoading = true;
      _error = null;
    });
    
    final deviceId = const Uuid().v4(); // In real app, use stable device ID
    
    try {
      await ref.read(authStateProvider.notifier).sendOtp(
        _phoneController.text.trim(),
        deviceId,
      );
      
      if (mounted) {
        Navigator.pushNamed(
          context,
          '/otp',
          arguments: {
            'phone': _phoneController.text.trim(),
            'deviceId': deviceId,
          },
        );
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to send OTP. Please try again.';
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: BrutalTheme.paper,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  decoration: BoxDecoration(
                    color: BrutalTheme.butter,
                    border: Border.all(color: BrutalTheme.ink, width: 3),
                    borderRadius: BrutalTheme.borderRadiusDefault,
                  ),
                  child: Text(
                    'GATELITE',
                    style: theme.textTheme.displayLarge?.copyWith(
                      color: BrutalTheme.ink,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Admin Dashboard',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: BrutalTheme.ink.withOpacity(0.6),
                  ),
                ),
                const SizedBox(height: 48),
                
                // Error message
                if (_error != null) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.only(bottom: 24),
                    decoration: BoxDecoration(
                      color: BrutalTheme.rose.withOpacity(0.1),
                      border: Border.all(color: BrutalTheme.rose, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: BrutalTheme.rose),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _error!,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: BrutalTheme.rose,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                
                // Login Form
                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Sign in with phone',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: BrutalTheme.ink,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Enter your phone number to receive a one-time code',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.6),
                        ),
                      ),
                      const SizedBox(height: 24),
                      
                      TextFormField(
                        controller: _phoneController,
                        decoration: const InputDecoration(
                          labelText: 'Phone Number',
                          hintText: '+91 98765 43210',
                          prefixText: '+91 ',
                        ),
                        keyboardType: TextInputType.phone,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter your phone number';
                          }
                          if (value.trim().length < 10) {
                            return 'Enter a valid 10-digit phone number';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                BrutalButton.primary(
                  text: _isLoading ? 'Sending...' : 'Send OTP',
                  onPressed: _isLoading ? null : _sendOtp,
                  isLoading: _isLoading,
                  size: BrutalButtonSize.large,
                ),
                const SizedBox(height: 16),
                
                // Demo notice
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: BrutalTheme.ink.withOpacity(0.05),
                    border: Border.all(color: BrutalTheme.ink.withOpacity(0.2)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Demo Mode',
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: BrutalTheme.ink,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Use any 10-digit number\nOTP: 123456',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.6),
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}