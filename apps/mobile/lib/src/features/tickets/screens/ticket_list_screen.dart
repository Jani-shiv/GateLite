import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_input.dart';
import 'package:gatelite_mobile/src/features/tickets/screens/create_ticket_screen.dart';
import 'package:intl/intl.dart';

class TicketListScreen extends ConsumerStatefulWidget {
  const TicketListScreen({super.key});
  
  @override
  ConsumerState<TicketListScreen> createState() => _TicketListScreenState();
}

class _TicketListScreenState extends ConsumerState<TicketListScreen> {
  String _searchQuery = '';
  String _statusFilter = 'all';
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Mock tickets
    final tickets = [
      _TicketData(
        id: '#124',
        title: 'Water leakage in bathroom',
        flat: 'A-401',
        category: 'maintenance',
        priority: 'high',
        status: 'open',
        assignee: 'Unassigned',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      _TicketData(
        id: '#123',
        title: 'Noise complaint - loud music',
        flat: 'B-205',
        category: 'noise',
        priority: 'medium',
        status: 'in_progress',
        assignee: 'Security Team',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      _TicketData(
        id: '#122',
        title: 'Lift not working',
        flat: 'C-312',
        category: 'maintenance',
        priority: 'critical',
        status: 'open',
        assignee: 'Maintenance',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      _TicketData(
        id: '#121',
        title: 'Parking space dispute',
        flat: 'A-102',
        category: 'other',
        priority: 'low',
        status: 'resolved',
        assignee: 'Admin',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      _TicketData(
        id: '#120',
        title: 'Security guard rude behavior',
        flat: 'B-201',
        category: 'security',
        priority: 'medium',
        status: 'in_progress',
        assignee: 'Security Head',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
    
    final filteredTickets = tickets.where((ticket) {
      final matchesSearch = ticket.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          ticket.flat.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final matchesStatus = _statusFilter == 'all' || ticket.status == _statusFilter;
      
      return matchesSearch && matchesStatus;
    }).toList();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tickets & Complaints'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CreateTicketScreen()),
            ),
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
                hintText: 'Search tickets...',
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
          
          // Status filter
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _StatusChip(label: 'All', value: 'all', selected: _statusFilter == 'all', onSelected: (v) => setState(() => _statusFilter = v)),
                const SizedBox(width: 8),
                _StatusChip(label: 'Open', value: 'open', selected: _statusFilter == 'open', onSelected: (v) => setState(() => _statusFilter = v)),
                const SizedBox(width: 8),
                _StatusChip(label: 'In Progress', value: 'in_progress', selected: _statusFilter == 'in_progress', onSelected: (v) => setState(() => _statusFilter = v)),
                const SizedBox(width: 8),
                _StatusChip(label: 'Resolved', value: 'resolved', selected: _statusFilter == 'resolved', onSelected: (v) => setState(() => _statusFilter = v)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          
          Expanded(
            child: filteredTickets.isEmpty
                ? _EmptyState(message: 'No tickets found')
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredTickets.length,
                    itemBuilder: (context, index) => _TicketCard(ticket: filteredTickets[index]),
                  ),
          ),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final String value;
  final bool selected;
  final Function(String) onSelected;
  
  const _StatusChip({
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
                color: BrutalTheme.rose.withOpacity(0.2),
                border: Border.all(color: BrutalTheme.rose, width: 3),
                borderRadius: BrutalTheme.borderRadiusDefault,
              ),
              child: const Icon(Icons.report_problem, size: 48, color: BrutalTheme.rose),
            ),
            const SizedBox(height: 24),
            Text(
              'No Tickets',
              style: theme.textTheme.headlineMedium?.copyWith(
                color: BrutalTheme.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No tickets found matching your criteria',
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

class _TicketData {
  final String id;
  final String title;
  final String flat;
  final String category;
  final String priority;
  final String status;
  final String assignee;
  final DateTime createdAt;
  
  const _TicketData({
    required this.id,
    required this.title,
    required this.flat,
    required this.category,
    required this.priority,
    required this.status,
    required this.assignee,
    required this.createdAt,
  });
}

class _TicketCard extends StatelessWidget {
  final _TicketData ticket;
  
  const _TicketCard({super.key, required this.ticket});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    final categoryConfig = {
      'maintenance': {'label': 'MAINTENANCE', 'color': BrutalTheme.sky, 'icon': Icons.build},
      'noise': {'label': 'NOISE', 'color': BrutalTheme.butter, 'icon': Icons.volume_up},
      'security': {'label': 'SECURITY', 'color': BrutalTheme.rose, 'icon': Icons.security},
      'other': {'label': 'OTHER', 'color': BrutalTheme.lilac, 'icon': Icons.help_outline},
    };
    
    final priorityConfig = {
      'critical': {'label': 'CRITICAL', 'color': BrutalTheme.rose},
      'high': {'label': 'HIGH', 'color': BrutalTheme.rose},
      'medium': {'label': 'MEDIUM', 'color': BrutalTheme.butter},
      'low': {'label': 'LOW', 'color': BrutalTheme.lilac},
    };
    
    final statusConfig = {
      'open': {'label': 'OPEN', 'color': BrutalTheme.butter},
      'in_progress': {'label': 'IN PROGRESS', 'color': BrutalTheme.lilac},
      'resolved': {'label': 'RESOLVED', 'color': BrutalTheme.mint},
      'closed': {'label': 'CLOSED', 'color': BrutalTheme.sky},
    };
    
    final cat = categoryConfig[ticket.category] ?? {'label': ticket.category.toUpperCase(), 'color': BrutalTheme.ink, 'icon': Icons.help};
    final pri = priorityConfig[ticket.priority] ?? {'label': ticket.priority.toUpperCase(), 'color': BrutalTheme.ink};
    final stat = statusConfig[ticket.status] ?? {'label': ticket.status.toUpperCase(), 'color': BrutalTheme.ink};
    
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
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (cat['color'] as Color).withOpacity(0.2),
                  border: Border.all(color: cat['color'] as Color, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(cat['icon'] as IconData, size: 12, color: cat['color'] as Color),
                    const SizedBox(width: 4),
                    Text(
                      cat['label'] as String,
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: cat['color'] as Color,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (pri['color'] as Color).withOpacity(0.2),
                  border: Border.all(color: pri['color'] as Color, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  pri['label'] as String,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: pri['color'] as Color,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const Spacer(),
              Text(
                ticket.id,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontFamily: BrutalTheme.fontFamilyMono,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          Text(
            ticket.title,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          
          Row(
            children: [
              Expanded(
                child: _DetailItem(
                  icon: Icons.home,
                  label: 'Flat',
                  value: ticket.flat,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _DetailItem(
                  icon: Icons.person,
                  label: 'Assignee',
                  value: ticket.assignee,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          Row(
            children: [
              Expanded(
                child: _DetailItem(
                  icon: Icons.access_time,
                  label: 'Created',
                  value: DateFormat('MMM dd, HH:mm').format(ticket.createdAt),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: (stat['color'] as Color).withOpacity(0.2),
                    border: Border.all(color: stat['color'] as Color, width: 2),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    stat['label'] as String,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: stat['color'] as Color,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
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
                color: BrutalTheme.rose.withOpacity(0.2),
                border: Border.all(color: BrutalTheme.rose, width: 3),
                borderRadius: BrutalTheme.borderRadiusDefault,
              ),
              child: const Icon(Icons.report_problem, size: 48, color: BrutalTheme.rose),
            ),
            const SizedBox(height: 24),
            Text(
              'No Tickets',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: BrutalTheme.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No tickets found matching your criteria',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
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