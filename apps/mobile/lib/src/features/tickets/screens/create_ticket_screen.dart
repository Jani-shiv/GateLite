import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_input.dart';

class CreateTicketScreen extends ConsumerStatefulWidget {
  const CreateTicketScreen({super.key});
  
  @override
  ConsumerState<CreateTicketScreen> createState() => _CreateTicketScreenState();
}

class _CreateTicketScreenState extends ConsumerState<CreateTicketScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  String _category = 'maintenance';
  String _priority = 'medium';
  bool _isLoading = false;
  
  final _categories = [
    {'value': 'maintenance', 'label': 'Maintenance', 'icon': Icons.build},
    {'value': 'noise', 'label': 'Noise', 'icon': Icons.volume_up},
    {'value': 'security', 'label': 'Security', 'icon': Icons.security},
    {'value': 'other', 'label': 'Other', 'icon': Icons.help_outline},
  ];
  
  final _priorities = [
    {'value': 'critical', 'label': 'Critical', 'color': BrutalTheme.rose},
    {'value': 'high', 'label': 'High', 'color': BrutalTheme.rose},
    {'value': 'medium', 'label': 'Medium', 'color': BrutalTheme.butter},
    {'value': 'low', 'label': 'Low', 'color': BrutalTheme.lilac},
  ];
  
  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
  
  Future<void> _createTicket() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      // In real app, call API
      // await ref.read(ticketProvider.notifier).createTicket(...);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Ticket created successfully!'),
            backgroundColor: BrutalTheme.mint,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to create ticket: $e'),
          backgroundColor: BrutalTheme.rose,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Ticket'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Ticket Details', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 16),
              
              BrutalInput(
                controller: _titleController,
                labelText: 'Title',
                hintText: 'Brief description of the issue',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Title is required';
                  }
                  if (value.trim().length < 5) {
                    return 'Title must be at least 5 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              BrutalInput(
                controller: _descriptionController,
                labelText: 'Description',
                hintText: 'Describe the issue in detail...',
                maxLines: 4,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Description is required';
                  }
                  if (value.trim().length < 20) {
                    return 'Description must be at least 20 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              
              // Category
              Text('Category', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: _categories.map((cat) {
                  final isSelected = _category == cat['value'];
                  return ChoiceChip(
                    label: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(cat['icon'] as IconData, size: 18, color: isSelected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.6)),
                        const SizedBox(width: 8),
                        Text(cat['label'] as String),
                      ],
                    ),
                    selected: isSelected,
                    onSelected: (selected) => setState(() => _category = cat['value'] as String),
                    selectedColor: BrutalTheme.mint,
                    backgroundColor: BrutalTheme.white,
                    labelStyle: TextStyle(
                      color: isSelected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.6),
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    ),
                    side: BorderSide(
                      color: isSelected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.3),
                      width: 2,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(999),
                      side: BorderSide(
                        color: isSelected ? BrutalTheme.ink : BrutalTheme.ink.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              
              // Priority
              Text('Priority', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 12),
              Row(
                children: _priorities.map((pri) {
                  final isSelected = _priority == pri['value'];
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ChoiceChip(
                        label: Text(
                          pri['label'] as String,
                          style: TextStyle(
                            color: isSelected ? BrutalTheme.ink : (pri['color'] as Color).withOpacity(0.8),
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                          ),
                        ),
                        selected: isSelected,
                        onSelected: (selected) => setState(() => _priority = pri['value'] as String),
                        selectedColor: (pri['color'] as Color).withOpacity(0.2),
                        backgroundColor: BrutalTheme.white,
                        labelStyle: TextStyle(
                          color: isSelected ? BrutalTheme.ink : (pri['color'] as Color),
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                        ),
                        side: BorderSide(
                          color: isSelected ? BrutalTheme.ink : (pri['color'] as Color).withOpacity(0.5),
                          width: isSelected ? 3 : 2,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(999),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    );
                }).toList(),
              ),
              const SizedBox(height: 24),
              
              // Submit Button
              BrutalButton.primary(
                text: _isLoading ? 'Creating...' : 'Create Ticket',
                onPressed: _isLoading ? null : _createTicket,
                isLoading: _isLoading,
                size: BrutalButtonSize.large,
                width: double.infinity,
              ),
              const SizedBox(height: 16),
              
              // Info
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: BrutalTheme.ink.withOpacity(0.05),
                  border: Border.all(color: BrutalTheme.ink.withOpacity(0.2)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'What happens next?',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: BrutalTheme.ink,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text('• Your ticket will be reviewed by the admin team'),
                    const Text('• You\'ll receive updates via push notifications'),
                    const Text('• Critical issues are prioritized for immediate attention'),
                    const Text('• You can track status in the Tickets tab'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}