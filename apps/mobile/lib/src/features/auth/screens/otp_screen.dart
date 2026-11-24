import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/features/auth/providers/auth_provider.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/otp_boxes.dart';

class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({super.key});
  
  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  bool _isLoading = false;
  String? _error;
  int _resendTimer = 60;
  String _phone = '';
  String _deviceId = '';
  
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    if (args != null) {
      _phone = args['phone'] as String;
      _deviceId = args['deviceId'] as String;
    }
    _startTimer();
  }
  
  void _startTimer() {
    _resendTimer = 60;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        setState(() => _resendTimer--);
        return _resendTimer > 0;
      }
      return false;
    });
  }
  
  void _onOtpChanged(String value, int index) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length == 6) {
      _verifyOtp(otp);
    }
  }
  
  Future<void> _verifyOtp(String otp) async {
    setState(() => _isLoading = true);
    
    try {
      await ref.read(authStateProvider.notifier).verifyOtp(
        _phone,
        otp,
        '', // deviceId from args
      );
      
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      setState(() {
        _error = 'Invalid OTP. Please try again.';
        // Clear boxes
        for (var c in _controllers) {
          c.clear();
        }
        _focusNodes[0].requestFocus();
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
  
  void _resendOtp() {
    // In real app, call sendOtp again
    _startTimer();
  }
  
  @override
  void dispose() {
    for (var c in _controllers) c.dispose();
    for (var f in _focusNodes) f.dispose();
    super.dispose();
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
                    style: Theme.of(context).textTheme.displayLarge?.copyWith(
                      color: BrutalTheme.ink,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2,
                    ),
                  ),
                ),
                const SizedBox(height: 48),
                
                // Title
                Text(
                  'Verify Code',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: BrutalTheme.ink,
                  ),
                ),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: BrutalTheme.ink.withOpacity(0.6),
                    ),
                    children: [
                      const TextSpan(text: 'Enter the 6-digit code sent to '),
                      TextSpan(
                        text: '+91 $_phone',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                
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
                
                // OTP Boxes
                OtpBoxes(
                  controllers: _controllers,
                  focusNodes: _focusNodes,
                  onChanged: _onOtpChanged,
                ),
                const SizedBox(height: 32),
                
                // Verify Button
                BrutalButton.primary(
                  text: _isLoading ? 'Verifying...' : 'Verify & Sign In',
                  onPressed: _isLoading ? null : () {
                    final otp = _controllers.map((c) => c.text).join();
                    if (otp.length == 6) {
                      _verifyOtp(otp);
                    }
                  },
                  isLoading: _isLoading,
                  size: BrutalButtonSize.large,
                ),
                const SizedBox(height: 24),
                
                // Resend OTP
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextButton(
                      onPressed: _resendTimer > 0 ? null : _resendOtp,
                      child: Text(
                        _resendTimer > 0
                            ? 'Resend in ${_resendTimer}s'
                            : 'Resend OTP',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: _resendTimer > 0
                              ? BrutalTheme.ink.withOpacity(0.4)
                              : BrutalTheme.ink,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Change Number'),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Demo notice
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: BrutalTheme.ink.withOpacity(0.05),
                    border: Border.all(color: BrutalTheme.ink.withOpacity(0.2)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Demo OTP: 123456',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: BrutalTheme.ink.withOpacity(0.6),
                    ),
                    textAlign: TextAlign.center,
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