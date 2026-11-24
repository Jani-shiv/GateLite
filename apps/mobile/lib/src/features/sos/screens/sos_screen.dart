import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:vibration/vibration.dart';

class SosScreen extends ConsumerStatefulWidget {
  const SosScreen({super.key});
  
  @override
  ConsumerState<SosScreen> createState() => _SosScreenState();
}

class _SosScreenState extends ConsumerState<SosScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  bool _sosActivated = false;
  bool _isLoading = false;
  int _acknowledgedCount = 0;
  int _totalRecipients = 3;
  
  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }
  
  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }
  
  Future<void> _activateSos() async {
    setState(() {
      _sosActivated = true;
      _isLoading = true;
    });
    
    // Trigger strong haptic feedback
    await Vibration.vibrate(pattern: [0, 200, 100, 200, 100, 200]);
    
    // In real app, call API
    // await ref.read(sosProvider.notifier).activateSos();
    
    // Simulate acknowledgment flow
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _isLoading = false;
      _acknowledgedCount = 1;
    });
    
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _acknowledgedCount = 2);
    }
    
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      setState(() => _acknowledgedCount = 3);
    }
  }
  
  Future<void> _cancelSos() async {
    // In real app, call API to cancel
    if (mounted) {
      setState(() {
        _sosActivated = false;
        _acknowledgedCount = 0;
      });
    }
  }
  
  @override
  void dispose() {
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    if (!_sosActivated) {
      return Scaffold(
        backgroundColor: BrutalTheme.paper,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // SOS Button
                AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _pulseAnimation.value,
                      child: Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          color: BrutalTheme.tomato,
                          border: Border.all(color: BrutalTheme.ink, width: 4),
                          borderRadius: BrutalTheme.borderRadiusDefault,
                          boxShadow: [
                            BoxShadow(
                              color: BrutalTheme.tomato.withOpacity(0.5),
                              blurRadius: 30,
                              spreadRadius: 10,
                            ),
                            ...BrutalTheme.shadowHero,
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: _activateSos,
                            borderRadius: BrutalTheme.borderRadiusDefault,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.emergency, size: 64, color: BrutalTheme.ink),
                                const SizedBox(height: 16),
                                Text(
                                  'SOS',
                                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                                    color: BrutalTheme.ink,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 4,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Hold to activate',
                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: BrutalTheme.ink.withOpacity(0.7),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 48),
                
                // Info
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: BrutalTheme.tomato.withOpacity(0.1),
                    border: Border.all(color: BrutalTheme.tomato, width: 3),
                    borderRadius: BrutalTheme.borderRadiusDefault,
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.info_outline, size: 32, color: BrutalTheme.tomato),
                      const SizedBox(height: 16),
                      Text(
                        'Emergency SOS',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: BrutalTheme.tomato,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Tap the SOS button to immediately alert all guards and admins. Your flat location will be shared automatically.',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.7),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _InfoItem(icon: Icons.security, label: 'Guards Alerted'),
                          const SizedBox(width: 24),
                          _InfoItem(icon: Icons.admin_panel_settings, label: 'Admins Notified'),
                          const SizedBox(width: 24),
                          _InfoItem(icon: Icons.location_on, label: 'Location Shared'),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Works even with poor network connectivity',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.5),
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
      );
    }
    
    // SOS Activated State
    return Scaffold(
      backgroundColor: BrutalTheme.tomato.withOpacity(0.1),
      appBar: AppBar(
        title: const Text('SOS ACTIVE', style: TextStyle(color: BrutalTheme.tomato)),
        backgroundColor: BrutalTheme.tomato.withOpacity(0.1),
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Status indicator
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: BrutalTheme.tomato,
                      border: Border.all(color: BrutalTheme.ink, width: 4),
                      borderRadius: BrutalTheme.borderRadiusDefault,
                      boxShadow: [
                        BoxShadow(
                          color: BrutalTheme.tomato.withOpacity(0.5),
                          blurRadius: 30,
                          spreadRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.emergency, size: 48, color: BrutalTheme.ink),
                        const SizedBox(height: 8),
                        Text(
                          'SOS ACTIVE',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: BrutalTheme.ink,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            
            // Status
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: BrutalTheme.white,
                border: Border.all(color: BrutalTheme.ink, width: 3),
                borderRadius: BrutalTheme.borderRadiusDefault,
                boxShadow: BrutalTheme.shadowCard,
              ),
              child: Column(
                children: [
                  Text(
                    'Help is on the way',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: BrutalTheme.mint,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$_acknowledgedCount of $_totalRecipients responders acknowledged',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: BrutalTheme.ink.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(
                    value: _acknowledgedCount / _totalRecipients,
                    backgroundColor: BrutalTheme.ink.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(BrutalTheme.mint),
                    minHeight: 8,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Details
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: BrutalTheme.sky.withOpacity(0.1),
                border: Border.all(color: BrutalTheme.sky, width: 2),
                borderRadius: BrutalTheme.borderRadiusDefault,
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: BrutalTheme.sky),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your location: Flat A-101, Green Valley Society',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: BrutalTheme.sky,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.access_time, color: BrutalTheme.sky),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Activated: ${DateFormat('HH:mm:ss').format(DateTime.now())}',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: BrutalTheme.sky,
                            fontWeight: FontWeight.w500,
                            fontFamily: BrutalTheme.fontFamilyMono,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Cancel button
            BrutalButton.ghost(
              text: 'Cancel SOS',
              leadingIcon: Icons.close,
              onPressed: _cancelSos,
              size: BrutalButtonSize.large,
              width: double.infinity,
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  
  const _InfoItem({super.key, required this.icon, required this.label});
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: BrutalTheme.white,
            border: Border.all(color: BrutalTheme.tomato, width: 2),
            borderRadius: BrutalTheme.borderRadiusDefault,
          ),
          child: Icon(icon, size: 24, color: BrutalTheme.tomato),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: BrutalTheme.tomato,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}