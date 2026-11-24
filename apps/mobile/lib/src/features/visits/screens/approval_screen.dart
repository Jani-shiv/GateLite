import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/approval_sheet.dart';
import 'package:vibration/vibration.dart';

class ApprovalScreen extends ConsumerStatefulWidget {
  final String visitId;
  
  const ApprovalScreen({super.key, required this.visitId});
  
  @override
  ConsumerState<ApprovalScreen> createState() => _ApprovalScreenState();
}

class _ApprovalScreenState extends ConsumerState<ApprovalScreen> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _hasResponded = false;
  
  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.elasticOut),
    );
    _animationController.forward();
    
    // Trigger haptic feedback
    Vibration.vibrate(pattern: [0, 100, 50, 100]);
  }
  
  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
  
  Future<void> _respond(bool approved) async {
    if (_hasResponded) return;
    setState(() => _hasResponded = true);
    
    // In real app, call API
    // await ref.read(visitProvider.notifier).respond(widget.visitId, approved);
    
    // Haptic feedback
    if (approved) {
      Vibration.vibrate(pattern: [0, 50, 20, 50]);
    } else {
      Vibration.vibrate(duration: 200);
    }
    
    // Show result
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: BrutalTheme.ink, width: 3),
          ),
          backgroundColor: BrutalTheme.white,
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: approved ? BrutalTheme.mint : BrutalTheme.rose,
                  border: Border.all(color: BrutalTheme.ink, width: 3),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  approved ? Icons.check : Icons.close,
                  size: 40,
                  color: BrutalTheme.ink,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                approved ? 'Visitor Approved' : 'Visitor Denied',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: BrutalTheme.ink,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                approved
                    ? 'The guard has been notified. The visitor may now enter.'
                    : 'The guard has been notified. The visitor will not be allowed entry.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: BrutalTheme.ink.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              BrutalButton.primary(
                text: 'Done',
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context); // Close approval screen
                },
                size: BrutalButtonSize.large,
              ),
            ],
          ),
        ),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Mock visit data
    final visit = _VisitData(
      id: widget.visitId,
      visitorName: 'Amit Shah',
      visitorPhoto: null,
      purpose: 'Personal visit',
      flatNumber: 'A-101',
      visitorType: 'visitor',
      timestamp: DateTime.now(),
    );
    
    return Scaffold(
      backgroundColor: BrutalTheme.paper,
      body: SafeArea(
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: ApprovalSheet(
            visitorName: visit.visitorName,
            visitorPhoto: visit.visitorPhoto,
            purpose: visit.purpose,
            flatNumber: visit.flatNumber,
            onApprove: () => _respond(true),
            onDeny: () => _respond(false),
            onLetGuardDecide: () => _respond(false), // Same as deny for now
          ),
        ),
      ),
    );
  }
}

class _VisitData {
  final String id;
  final String visitorName;
  final String? visitorPhoto;
  final String purpose;
  final String flatNumber;
  final String visitorType;
  final DateTime timestamp;
  
  const _VisitData({
    required this.id,
    required this.visitorName,
    this.visitorPhoto,
    required this.purpose,
    required this.flatNumber,
    required this.visitorType,
    required this.timestamp,
  });
}