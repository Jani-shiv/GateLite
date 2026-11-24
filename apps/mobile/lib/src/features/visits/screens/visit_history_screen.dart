import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:intl/intl.dart';

class VisitHistoryScreen extends ConsumerStatefulWidget {
  const VisitHistoryScreen({super.key});
  
  @override
  ConsumerState<VisitHistoryScreen> createState() => _VisitHistoryScreenState();
}

class _VisitHistoryScreenState extends ConsumerState<VisitHistoryScreen> {
  String _filter = 'all'; // all, today, week, month
  String _searchQuery = '';
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Mock visit data
    final visits = [
      _VisitData(
        id: '1',
        visitorName: 'Amit Shah',
        visitorPhone: '+91 98765 43210',
        flatNumber: 'A-101',
        type: 'visitor',
        status: 'approved',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        inAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 30)),
        outAt: DateTime.now().subtract(const Duration(hours: 1)),
      ),
      _VisitData(
        id: '2',
        visitorName: 'Zomato Delivery',
        visitorPhone: '+91 98765 43211',
        flatNumber: 'B-205',
        type: 'delivery',
        status: 'left_at_gate',
        timestamp: DateTime.now().subtract(const Duration(hours: 3)),
        inAt: DateTime.now().subtract(const Duration(hours: 2, minutes: 45)),
        outAt: DateTime.now().subtract(const Duration(hours: 2, minutes: 30)),
      ),
      _VisitData(
        id: '3',
        visitorName: 'Rohit Verma',
        visitorPhone: '+91 98765 43212',
        flatNumber: 'C-312',
        type: 'visitor',
        status: 'denied',
        timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      _VisitData(
        id: '4',
        visitorName: 'Uber Cab',
        visitorPhone: '+91 98765 43213',
        flatNumber: 'A-150',
        type: 'cab',
        status: 'approved',
        timestamp: DateTime.now().subtract(const Duration(hours: 6)),
        inAt: DateTime.now().subtract(const Duration(hours: 5, minutes: 30)),
        outAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      _VisitData(
        id: '5',
        visitorName: 'Pre-approved: Dr. Mehta',
        visitorPhone: '+91 98765 43214',
        flatNumber: 'B-201',
        type: 'visitor',
        status: 'entered',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        inAt: DateTime.now().subtract(const Duration(days: 1, hours: 2)),
      ),
      _VisitData(
        id: '6',
        visitorName: 'Amazon Delivery',
        visitorPhone: '+91 98765 43215',
        flatNumber: 'C-305',
        type: 'delivery',
        status: 'approved',
        timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
        inAt: DateTime.now().subtract(const Duration(days: 1, hours: 2, minutes: 30)),
        outAt: DateTime.now().subtract(const Duration(days: 1, hours: 2)),
      ),
    ];
    
    final filteredVisits = visits.where((visit) {
      final matchesSearch = visit.visitorName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          visit.flatNumber.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final matchesFilter = _filter == 'all' ||
          (_filter == 'today' && visit.timestamp.isAfter(DateTime.now().subtract(const Duration(days: 1)))) ||
          (_filter == 'week' && visit.timestamp.isAfter(DateTime.now().subtract(const Duration(days: 7)))) ||
          (_filter == 'month' && visit.timestamp.isAfter(DateTime.now().subtract(const Duration(days: 30))));
      
      return matchesSearch && matchesFilter;
    }).toList();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Visit History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search visitors...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: BrutalTheme.white,
                border: OutlineInputBorder(
                  borderRadius: BrutalTheme.borderRadiusDefault,
                  borderSide: const BorderSide(color: BrutalTheme.ink, width: 3),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BrutalTheme.borderRadiusDefault,
                  borderSide: const BorderSide(color: BrutalTheme.lilac, width: 3),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              ),
              onChanged: (value) => setState(() => _searchQuery = value),
            ),
          ),
          
          // Filter chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(label: 'All', value: 'all', selected: _filter == 'all', onSelected: (v) => setState(() => _filter = v)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'Today', value: 'today', selected: _filter == 'today', onSelected: (v) => setState(() => _filter = v)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'Week', value: 'week', selected: _filter == 'week', onSelected: (v) => setState(() => _filter = v)),
                  const SizedBox(width: 8),
                  _FilterChip(label: 'Month', value: 'month', selected: _filter == 'month', onSelected: (v) => setState(() => _filter = v)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Visits list
          Expanded(
            child: filteredVisits.isEmpty
                ? _EmptyState(
                    message: _searchQuery.isNotEmpty ? 'No visitors found' : 'No visits recorded yet',
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredVisits.length,
                    itemBuilder: (context, index) => _VisitCard(visit: filteredVisits[index]),
                  ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final String value;
  final bool selected;
  final Function(String) onSelected;
  
  const _FilterChip({
    super.key,
    required this.label,
    required this.value,
    required this.selected,
    required this.onSelected,
  });
  
  @override
  Widget build(BuildContext context) {
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (selected) => onSelected(value),
      backgroundColor: BrutalTheme.white,
      selectedColor: BrutalTheme.mint,
      checkmarkColor: BrutalTheme.ink,
      labelStyle: TextStyle(
        color: selected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.6),
        fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
      ),
      side: BorderSide(
        color: selected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.3),
        width: 2,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(999),
        side: BorderSide(
          color: selected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.3),
          width: 2,
        ),
      ),
      showCheckmark: false,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String message;
  
  const _EmptyState({super.key, required this.message});
  
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
              child: const Icon(Icons.history, size: 48, color: BrutalTheme.sky),
            ),
            const SizedBox(height: 24),
            Text(
              'No Visits Found',
              style: theme.textTheme.headlineMedium?.copyWith(
                color: BrutalTheme.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: BrutalTheme.ink.withOpacity(0.6),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _VisitData {
  final String id;
  final String visitorName;
  final String visitorPhone;
  final String flatNumber;
  final String type; // visitor, delivery, cab
  final String status; // approved, denied, entered, exited, left_at_gate, pending
  final DateTime timestamp;
  final DateTime? inAt;
  final DateTime? outAt;
  
  const _VisitData({
    required this.id,
    required this.visitorName,
    required this.visitorPhone,
    required this.flatNumber,
    required this.type,
    required this.status,
    required this.timestamp,
    this.inAt,
    this.outAt,
  });
}

class _VisitCard extends StatelessWidget {
  final _VisitData visit;
  
  const _VisitCard({super.key, required this.visit});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    final typeConfig = {
      'visitor': {'label': 'VISITOR', 'color': BrutalTheme.sky, 'icon': Icons.person},
      'delivery': {'label': 'DELIVERY', 'color': BrutalTheme.peach, 'icon': Icons.local_shipping},
      'cab': {'label': 'CAB', 'color': BrutalTheme.lilac, 'icon': Icons.local_taxi},
    };
    
    final statusConfig = {
      'approved': {'label': 'APPROVED', 'color': BrutalTheme.mint},
      'denied': {'label': 'DENIED', 'color': BrutalTheme.rose},
      'entered': {'label': 'ENTERED', 'color': BrutalTheme.mint},
      'exited': {'label': 'EXITED', 'color': BrutalTheme.sky},
      'left_at_gate': {'label': 'LEFT AT GATE', 'color': BrutalTheme.butter},
      'pending': {'label': 'PENDING', 'color': BrutalTheme.butter},
    };
    
    final type = typeConfig[visit.type] ?? {'label': visit.type.toUpperCase(), 'color': BrutalTheme.ink, 'icon': Icons.help};
    final status = statusConfig[visit.status] ?? {'label': visit.status.toUpperCase(), 'color': BrutalTheme.ink};
    
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
                  color: (type['color'] as Color).withOpacity(0.2),
                  border: Border.all(color: type['color'] as Color, width: 2),
                  borderRadius: BrutalTheme.borderRadiusDefault,
                ),
                child: Icon(type['icon'] as IconData, color: type['color'] as Color, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      visit.visitorName,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      visit.visitorPhone,
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
                  color: status['color'] as Color,
                  border: Border.all(color: BrutalTheme.ink, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  status['label'] as String,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          Row(
            children: [
              Expanded(
                child: _DetailItem(
                  icon: Icons.calendar_today,
                  label: 'Time',
                  value: DateFormat('MMM dd, HH:mm').format(visit.timestamp),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _DetailItem(
                  icon: Icons.home,
                  label: 'Flat',
                  value: visit.flatNumber,
                ),
              ),
            ],
          ),
          if (visit.inAt != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _DetailItem(
                    icon: Icons.login,
                    label: 'In',
                    value: DateFormat('HH:mm').format(visit.inAt!),
                  ),
                ),
                const SizedBox(width: 12),
                if (visit.outAt != null)
                  Expanded(
                    child: _DetailItem(
                      icon: Icons.logout,
                      label: 'Out',
                      value: DateFormat('HH:mm').format(visit.outAt!),
                    ),
                  ),
              ],
            ),
          ],
        ),
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