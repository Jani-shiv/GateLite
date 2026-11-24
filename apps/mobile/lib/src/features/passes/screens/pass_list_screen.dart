import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/features/passes/screens/create_pass_screen.dart';
import 'package:intl/intl.dart';

class PassListScreen extends ConsumerStatefulWidget {
  const PassListScreen({super.key});
  
  @override
  ConsumerState<PassListScreen> createState() => _PassListScreenState();
}

class _PassListScreenState extends ConsumerState<PassListScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Mock passes data
    final passes = [
      _PassData(
        id: '1',
        visitorName: 'Amit Shah',
        visitorPhone: '+91 98765 43210',
        code: 'A1B2C3',
        validFrom: DateTime.now().subtract(const Duration(days: 1)),
        validTo: DateTime.now().add(const Duration(days: 2)),
        usesLeft: 1,
        status: 'active',
      ),
      _PassData(
        id: '2',
        visitorName: 'Priya Sharma',
        visitorPhone: '+91 98765 43211',
        code: 'D4E5F6',
        validFrom: DateTime.now().subtract(const Duration(days: 5)),
        validTo: DateTime.now().subtract(const Duration(days: 2)),
        usesLeft: 0,
        status: 'expired',
      ),
      _PassData(
        id: '3',
        visitorName: 'Delivery - Zomato',
        visitorPhone: '+91 98765 43212',
        code: 'G7H8I9',
        validFrom: DateTime.now().subtract(const Duration(days: 10)),
        validTo: DateTime.now().add(const Duration(days: 20)),
        usesLeft: 3,
        status: 'active',
      ),
    ];
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Visitor Passes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CreatePassScreen()),
            ),
          ),
        ],
      ),
      body: passes.isEmpty
          ? _EmptyState(
              onCreate: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreatePassScreen()),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: passes.length,
              itemBuilder: (context, index) => _PassCard(pass: passes[index]),
            ),
    );
  }
}

class _PassData {
  final String id;
  final String visitorName;
  final String visitorPhone;
  final String code;
  final DateTime validFrom;
  final DateTime validTo;
  final int usesLeft;
  final String status; // active, expired, revoked
  
  const _PassData({
    required this.id,
    required this.visitorName,
    required this.visitorPhone,
    required this.code,
    required this.validFrom,
    required this.validTo,
    required this.usesLeft,
    required this.status,
  });
}

class _PassCard extends StatelessWidget {
  final _PassData pass;
  
  const _PassCard({super.key, required this.pass});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final now = DateTime.now();
    final isExpired = pass.validTo.isBefore(DateTime.now()) || pass.usesLeft <= 0;
    final isActive = pass.status == 'active' && !isExpired;
    
    Color statusColor;
    String statusLabel;
    
    if (isActive) {
      statusColor = BrutalTheme.mint;
      statusLabel = 'ACTIVE';
    } else if (isExpired) {
      statusColor = BrutalTheme.rose;
      statusLabel = 'EXPIRED';
    } else {
      statusColor = BrutalTheme.butter;
      statusLabel = 'REVOKED';
    }
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BrutalTheme.white,
        border: Border.all(color: BrutalTheme.ink, width: 3),
        borderRadius: BrutalTheme.borderRadiusDefault,
        boxShadow: BrutalTheme.shadowCard,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: BrutalTheme.sky.withOpacity(0.2),
                  border: Border.all(color: BrutalTheme.sky, width: 2),
                  borderRadius: BrutalTheme.borderRadiusDefault,
                ),
                child: const Icon(Icons.person, color: BrutalTheme.sky, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pass.visitorName,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      pass.visitorPhone,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: BrutalTheme.ink.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: statusColor,
                  border: Border.all(color: BrutalTheme.ink, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  statusLabel,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Code
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: BrutalTheme.ink.withOpacity(0.05),
              border: Border.all(color: BrutalTheme.ink, width: 2),
              borderRadius: BrutalTheme.borderRadiusDefault,
            ),
            child: Row(
              children: [
                const Icon(Icons.qr_code, color: BrutalTheme.ink, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pass Code',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: BrutalTheme.ink.withOpacity(0.6),
                        ),
                      ),
                      Text(
                        pass.code,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontFamily: 'JetBrainsMono',
                          fontWeight: FontWeight.w700,
                          letterSpacing: 4,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  children: [
                    const Icon(Icons.content_copy, color: BrutalTheme.ink, size: 20),
                    const SizedBox(height: 4),
                    Text(
                      'Copy',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: BrutalTheme.ink.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          
          // Details
          Row(
            children: [
              Expanded(
                child: _DetailItem(
                  icon: Icons.calendar_today,
                  label: 'Valid From',
                  value: DateFormat('MMM dd, HH:mm').format(pass.validFrom),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _DetailItem(
                  icon: Icons.event,
                  label: 'Valid To',
                  value: DateFormat('MMM dd, HH:mm').format(pass.validTo),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _DetailItem(
                  icon: Icons.repeat,
                  label: 'Uses Left',
                  value: pass.usesLeft.toString(),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Actions
          Row(
            children: [
              Expanded(
                child: BrutalButton.ghost(
                  text: 'Share',
                  leadingIcon: Icons.share,
                  onPressed: () {
                    // Share pass
                  },
                  size: BrutalButtonSize.medium,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: BrutalButton.danger(
                  text: isActive ? 'Revoke' : 'Delete',
                  leadingIcon: isActive ? Icons.block : Icons.delete,
                  onPressed: () {
                    // Revoke/Delete
                  },
                  size: BrutalButtonSize.medium,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _DetailItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  
  const _DetailItem({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: BrutalTheme.ink.withOpacity(0.6)),
            const SizedBox(width: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: BrutalTheme.ink.withOpacity(0.6),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
            fontFamily: BrutalTheme.fontFamilyMono,
          ),
        ),
      ],
    );
  }
}

class _EmptyState extends StatelessWidget {
  final VoidCallback onCreate;
  
  const _EmptyState({super.key, required this.onCreate});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: BrutalTheme.sky.withOpacity(0.2),
                border: Border.all(color: BrutalTheme.sky, width: 3),
                borderRadius: BrutalTheme.borderRadiusDefault,
              ),
              child: const Icon(Icons.qr_code, size: 48, color: BrutalTheme.sky),
            ),
            const SizedBox(height: 24),
            Text(
              'No Passes Yet',
              style: theme.textTheme.headlineMedium?.copyWith(
                color: BrutalTheme.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first visitor pass to get started',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: BrutalTheme.ink.withOpacity(0.6),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            BrutalButton.primary(
              text: 'Create Pass',
              leadingIcon: Icons.add,
              onPressed: onCreate,
              size: BrutalButtonSize.large,
            ),
          ],
        ),
      ),
    );
  }
}