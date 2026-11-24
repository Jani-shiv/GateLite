import 'package:flutter/material.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';

class ApprovalSheet extends StatelessWidget {
  final String visitorName;
  final String? visitorPhoto;
  final String purpose;
  final String flatNumber;
  final VoidCallback onApprove;
  final VoidCallback onDeny;
  final VoidCallback onLetGuardDecide;
  
  const ApprovalSheet({
    super.key,
    required this.visitorName,
    this.visitorPhoto,
    required this.purpose,
    required this.flatNumber,
    required this.onApprove,
    required this.onDeny,
    required this.onLetGuardDecide,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: BrutalTheme.paper,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Container(
            width: double.infinity,
            constraints: const BoxConstraints(maxWidth: 400),
            decoration: BoxDecoration(
              color: BrutalTheme.white,
              border: Border.all(color: BrutalTheme.ink, width: 4),
              borderRadius: BrutalTheme.borderRadiusDefault,
              boxShadow: BrutalTheme.shadowHero,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: BrutalTheme.butter,
                    border: Border(
                      bottom: BorderSide(color: BrutalTheme.ink, width: 3),
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(9),
                      topRight: Radius.circular(9),
                    ),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.notifications_active, size: 32, color: BrutalTheme.ink),
                      const SizedBox(height: 8),
                      Text(
                        'New Visitor at Gate',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: BrutalTheme.ink,
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                
                // Content
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Visitor Photo
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: BrutalTheme.sky.withOpacity(0.2),
                          border: Border.all(color: BrutalTheme.sky, width: 3),
                          borderRadius: BrutalTheme.borderRadiusDefault,
                        ),
                        child: ClipRRect(
                          borderRadius: BrutalTheme.borderRadiusDefault,
                          child: visitorPhoto != null
                              ? Image.network(visitorPhoto!, fit: BoxFit.cover, width: 100, height: 100)
                              : const Icon(Icons.person, size: 48, color: BrutalTheme.sky),
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Visitor Name
                      Text(
                        visitorName,
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: BrutalTheme.ink,
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),
                      
                      // Purpose
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: BrutalTheme.sky.withOpacity(0.2),
                          border: Border.all(color: BrutalTheme.sky, width: 2),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          purpose,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: BrutalTheme.sky,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      // Flat Number
                      Text(
                        'Flat $flatNumber',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.6),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      
                      // Action Buttons
                      Row(
                        children: [
                          Expanded(
                            child: BrutalButton.danger(
                              text: 'DENY',
                              leadingIcon: Icons.close,
                              onPressed: onDeny,
                              size: BrutalButtonSize.large,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: BrutalButton.primary(
                              text: 'APPROVE',
                              leadingIcon: Icons.check,
                              onPressed: onApprove,
                              size: BrutalButtonSize.xlarge,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      
                      // Let Guard Decide
                      BrutalButton.ghost(
                        text: 'Let Guard Decide',
                        leadingIcon: Icons.security,
                        onPressed: onLetGuardDecide,
                        size: BrutalButtonSize.medium,
                        width: double.infinity,
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