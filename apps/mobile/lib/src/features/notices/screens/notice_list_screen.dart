import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:intl/intl.dart';

class NoticeListScreen extends ConsumerStatefulWidget {
  const NoticeListScreen({super.key});
  
  @override
  ConsumerState<NoticeListScreen> createState() => _NoticeListScreenState();
}

class _NoticeListScreenState extends ConsumerState<NoticeListScreen> {
  String _searchQuery = '';
  String _filter = 'all'; // all, published, pinned
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Mock notices
    final notices = [
      _NoticeData(
        id: '1',
        title: 'Water Supply Maintenance',
        body: 'Water supply will be shut down on Sunday 10 AM - 2 PM for maintenance. Please store water in advance.',
        pinned: true,
        published: true,
        read: false,
        publishedAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      _NoticeData(
        id: '2',
        title: 'Diwali Celebration',
        body: 'Join us for Diwali celebration at the clubhouse on Nov 12th, 7 PM onwards. Snacks and drinks will be provided.',
        pinned: false,
        published: true,
        read: true,
        publishedAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      _NoticeData(
        id: '3',
        title: 'New Security Guidelines',
        body: 'Please ensure all visitors are pre-approved. Walk-ins will require ID verification at the gate.',
        pinned: true,
        published: true,
        read: false,
        publishedAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
      _NoticeData(
        id: '4',
        title: 'Gym Renovation Notice',
        body: 'Gym will be closed for renovation from Nov 15-30. Alternative arrangements at partner gym.',
        pinned: false,
        published: false,
        read: false,
        publishedAt: null,
      ),
    ];
    
    final filteredNotices = notices.where((notice) {
      final matchesSearch = notice.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          notice.body.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final matchesFilter = _filter == 'all' ||
          (_filter == 'published' && notice.published) ||
          (_filter == 'pinned' && notice.pinned);
      
      return matchesSearch && matchesFilter;
    }).toList();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notice Board'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Admin only - create notice
            },
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
                hintText: 'Search notices...',
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
            child: Row(
              children: [
                _FilterChip(label: 'All', value: 'all', selected: _filter == 'all', onSelected: (v) => setState(() => _filter = v)),
                const SizedBox(width: 8),
                _FilterChip(label: 'Published', value: 'published', selected: _filter == 'published', onSelected: (v) => setState(() => _filter = v)),
                const SizedBox(width: 8),
                _FilterChip(label: 'Pinned', value: 'pinned', selected: _filter == 'pinned', onSelected: (v) => setState(() => _filter = v)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          
          // Notices list
          Expanded(
            child: filteredNotices.isEmpty
                ? _EmptyState(message: 'No notices found')
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredNotices.length,
                    itemBuilder: (context, index) => _NoticeCard(notice: filteredNotices[index]),
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
                color: BrutalTheme.lilac.withOpacity(0.2),
                border: Border.all(color: BrutalTheme.lilac, width: 3),
                borderRadius: BrutalTheme.borderRadiusDefault,
              ),
              child: const Icon(Icons.campaign, size: 48, color: BrutalTheme.lilac),
            ),
            const SizedBox(height: 24),
            Text(
              'No Notices',
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

class _NoticeData {
  final String id;
  final String title;
  final String body;
  final bool pinned;
  final bool published;
  final bool read;
  final DateTime? publishedAt;
  
  const _NoticeData({
    required this.id,
    required this.title,
    required this.body,
    required this.pinned,
    required this.published,
    required this.read,
    this.publishedAt,
  });
}

class _NoticeCard extends StatelessWidget {
  final _NoticeData notice;
  
  const _NoticeCard({super.key, required this.notice});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: notice.published ? BrutalTheme.white : BrutalTheme.ink.withOpacity(0.05),
        border: Border.all(
          color: notice.published ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.3),
          width: 3,
        ),
        borderRadius: BrutalTheme.borderRadiusDefault,
        boxShadow: notice.published ? BrutalTheme.shadowCard : [],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (notice.pinned) ...[
                const Icon(Icons.push_pin, size: 20, color: BrutalTheme.mint),
                const SizedBox(width: 8),
              ],
              Expanded(
                child: Text(
                  notice.title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: notice.read ? BrutalTheme.ink : BrutalTheme.ink,
                    decoration: notice.read ? null : TextDecoration.underline,
                    decorationColor: BrutalTheme.lilac,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: notice.published ? BrutalTheme.mint : BrutalTheme.butter,
                  border: Border.all(color: BrutalTheme.ink, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  notice.published ? 'PUBLISHED' : 'DRAFT',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          Text(
            notice.body,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: BrutalTheme.ink.withOpacity(notice.read ? 0.6 : 0.9),
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 12),
          
          Row(
            children: [
              if (notice.publishedAt != null) ...[
                Icon(Icons.access_time, size: 16, color: BrutalTheme.ink.withOpacity(0.5)),
                const SizedBox(width: 4),
                Text(
                  DateFormat('MMM dd, HH:mm').format(notice.publishedAt!),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: BrutalTheme.ink.withOpacity(0.5),
                    fontFamily: BrutalTheme.fontFamilyMono,
                  ),
                ),
                const SizedBox(width: 16),
              ],
              if (!notice.read) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: BrutalTheme.lilac,
                    border: Border.all(color: BrutalTheme.ink, width: 2),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    'NEW',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: BrutalTheme.ink,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}