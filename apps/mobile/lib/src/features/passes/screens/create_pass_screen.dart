import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/shared/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_button.dart';
import 'package:gatelite_mobile/src/shared/widgets/brutal_input.dart';
import 'package:intl/intl.dart';

class CreatePassScreen extends ConsumerStatefulWidget {
  const CreatePassScreen({super.key});
  
  @override
  ConsumerState<CreatePassScreen> createState() => _CreatePassScreenState();
}

class _CreatePassScreenState extends ConsumerState<CreatePassScreen> {
  final _formKey = GlobalKey<FormState>();
  final _visitorNameController = TextEditingController();
  final _visitorPhoneController = TextEditingController();
  final _purposeController = TextEditingController();
  
  DateTime _validFrom = DateTime.now();
  DateTime _validTo = DateTime.now().add(const Duration(days: 1));
  int _usesLeft = 1;
  bool _isLoading = false;
  
  @override
  void dispose() {
    _visitorNameController.dispose();
    _visitorPhoneController.dispose();
    _purposeController.dispose();
    super.dispose();
  }
  
  Future<void> _selectDate(BuildContext context, bool isFrom) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _validFrom : _validTo,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    
    if (picked != null && mounted) {
      final time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(isFrom ? _validFrom : _validTo),
      );
      
      if (time != null && mounted) {
        final newDate = DateTime(
          picked.year,
          picked.month,
          picked.day,
          time.hour,
          time.minute,
        );
        setState(() {
          if (isFrom) {
            _validFrom = newDate;
            if (_validTo.isBefore(_validFrom)) {
              _validTo = _validFrom.add(const Duration(hours: 1));
            }
          } else {
            _validTo = newDate;
            if (_validTo.isBefore(_validFrom)) {
              _validFrom = _validTo.subtract(const Duration(hours: 1));
            }
          }
        });
      }
    }
  }
  
  Future<void> _createPass() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      // In real app, call API
      // await ref.read(passProvider.notifier).createPass(...);
      
      // Show success
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Pass created successfully!'),
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
          content: Text('Failed to create pass: $e'),
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
        title: const Text('Create Visitor Pass'),
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
              // Visitor Info
              Text('Visitor Details', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 16),
              
              BrutalInput(
                controller: _visitorNameController,
                labelText: 'Visitor Name',
                hintText: 'Enter visitor name',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Visitor name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              BrutalInput(
                controller: _visitorPhoneController,
                labelText: 'Visitor Phone (Optional)',
                hintText: '+91 98765 43210',
                keyboardType: TextInputType.phone,
                prefixText: '+91 ',
              ),
              const SizedBox(height: 16),
              
              BrutalInput(
                controller: _purposeController,
                labelText: 'Purpose',
                hintText: 'e.g., Personal visit, Delivery, Meeting',
                maxLines: 2,
              ),
              const SizedBox(height: 24),
              
              // Validity
              Text('Validity Period', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectDate(context, true),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: BrutalTheme.white,
                          border: Border.all(color: BrutalTheme.ink, width: 3),
                          borderRadius: BrutalTheme.borderRadiusDefault,
                          boxShadow: BrutalTheme.shadowChip,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Valid From',
                              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                color: BrutalTheme.ink.withOpacity(0.6),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              DateFormat('MMM dd, yyyy HH:mm').format(_validFrom),
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.w500,
                                fontFamily: BrutalTheme.fontFamilyMono,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: InkWell(
                      onTap: () => _selectDate(context, false),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: BrutalTheme.white,
                          border: Border.all(color: BrutalTheme.ink, width: 3),
                          borderRadius: BrutalTheme.borderRadiusDefault,
                          boxShadow: BrutalTheme.shadowChip,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Valid To',
                              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                color: BrutalTheme.ink.withOpacity(0.6),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              DateFormat('MMM dd, yyyy HH:mm').format(_validTo),
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.w500,
                                fontFamily: BrutalTheme.fontFamilyMono,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Uses Left
              BrutalInput(
                initialValue: _usesLeft.toString(),
                labelText: 'Number of Uses',
                hintText: '1',
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  _usesLeft = int.tryParse(value) ?? 1;
                },
                validator: (value) {
                  final val = int.tryParse(value ?? '');
                  if (val == null || val < 1) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              
              // Create Button
              BrutalButton.primary(
                text: _isLoading ? 'Creating...' : 'Create Pass',
                onPressed: _isLoading ? null : _createPass,
                isLoading: _isLoading,
                size: BrutalButtonSize.large,
                width: double.infinity,
              ),
              const SizedBox(height: 24),
              
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
                      'How it works',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: BrutalTheme.ink,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text('• A 6-digit code and QR will be generated'),
                    const Text('• Share with your visitor via WhatsApp/SMS'),
                    const Text('• Guard can verify offline using the code'),
                    const Text('• Pass expires automatically'),
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