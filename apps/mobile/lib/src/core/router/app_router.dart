import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod/riverpod.dart';
import 'package:gatelite_mobile/src/features/auth/screens/login_screen.dart';
import 'package:gatelite_mobile/src/features/auth/screens/otp_screen.dart';
import 'package:gatelite_mobile/src/features/auth/providers/auth_provider.dart';
import 'package:gatelite_mobile/src/features/passes/screens/create_pass_screen.dart';
import 'package:gatelite_mobile/src/features/passes/screens/pass_list_screen.dart';
import 'package:gatelite_mobile/src/features/visits/screens/approval_screen.dart';
import 'package:gatelite_mobile/src/features/visits/screens/visit_history_screen.dart';
import 'package:gatelite_mobile/src/features/notices/screens/notice_list_screen.dart';
import 'package:gatelite_mobile/src/features/tickets/screens/ticket_list_screen.dart';
import 'package:gatelite_mobile/src/features/tickets/screens/create_ticket_screen.dart';
import 'package:gatelite_mobile/src/features/sos/screens/sos_screen.dart';
import 'package:gatelite_mobile/src/features/settings/screens/settings_screen.dart';
import 'package:gatelite_mobile/src/shared/widgets/bottom_nav.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_router.g.dart';

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  final authState = ref.watch(authStateProvider);
  
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggedIn = authState.value?.isAuthenticated ?? false;
      final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/otp';
      
      if (!isLoggedIn && !isLoggingIn) {
        return '/login';
      }
      
      if (isLoggedIn && isLoggingIn) {
        return '/home';
      }
      
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/otp',
        builder: (context, state) => const OtpScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) {
          return ScaffoldWithNavBar(child: child);
        },
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/passes',
            builder: (context, state) => const PassListScreen(),
            routes: [
              GoRoute(
                path: 'create',
                builder: (context, state) => const CreatePassScreen(),
              ),
            ],
          ),
          GoRoute(
            path: '/visits',
            builder: (context, state) => const VisitHistoryScreen(),
          ),
          GoRoute(
            path: '/approval/:visitId',
            builder: (context, state) {
              final visitId = state.pathParameters['visitId']!;
              return ApprovalScreen(visitId: visitId);
            },
          ),
          GoRoute(
            path: '/notices',
            builder: (context, state) => const NoticeListScreen(),
          ),
          GoRoute(
            path: '/tickets',
            builder: (context, state) => const TicketListScreen(),
            routes: [
              GoRoute(
                path: 'create',
                builder: (context, state) => const CreateTicketScreen(),
              ),
            ],
          ),
          GoRoute(
            path: '/sos',
            builder: (context, state) => const SosScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
  );
}

class ScaffoldWithNavBar extends StatefulWidget {
  final Widget child;
  
  const ScaffoldWithNavBar({super.key, required this.child});
  
  @override
  State<ScaffoldWithNavBar> createState() => _ScaffoldWithNavBarState();
}

class _ScaffoldWithNavBarState extends State<ScaffoldWithNavBar> {
  int _currentIndex = 0;
  
  static const List<String> _routes = [
    '/home',
    '/passes',
    '/visits',
    '/notices',
    '/tickets',
    '/sos',
    '/settings',
  ];
  
  void _onItemTapped(int index) {
    if (index != _currentIndex) {
      setState(() => _currentIndex = index);
      context.go(_routes[index]);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNav(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GateLite'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.go('/notices'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _GreetingCard(),
            const SizedBox(height: 16),
            const _QuickActionsGrid(),
            const SizedBox(height: 24),
            const _TodayAtGateSection(),
          ],
        ),
      ),
    );
  }
}

class _GreetingCard extends StatelessWidget {
  const _GreetingCard();
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: BrutalTheme.peach,
        border: Border.all(color: BrutalTheme.ink, width: 3),
        borderRadius: BrutalTheme.borderRadiusDefault,
        boxShadow: BrutalTheme.shadowCard,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome back!',
            style: theme.textTheme.headlineMedium?.copyWith(
              color: BrutalTheme.ink,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Flat A-101 • Green Valley Society',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: BrutalTheme.ink.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionsGrid extends StatelessWidget {
  const _QuickActionsGrid();
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final actions = [
      _QuickAction(
        icon: Icons.person_add,
        label: 'Invite Guest',
        color: BrutalTheme.mint,
        onTap: () => context.go('/passes/create'),
      ),
      _QuickAction(
        icon: Icons.local_shipping,
        label: 'Deliveries',
        color: BrutalTheme.peach,
        onTap: () => context.go('/visits'),
      ),
      _QuickAction(
        icon: Icons.report_problem,
        label: 'Complaints',
        color: BrutalTheme.lilac,
        onTap: () => context.go('/tickets/create'),
      ),
      _QuickAction(
        icon: Icons.emergency,
        label: 'SOS',
        color: BrutalTheme.rose,
        onTap: () => context.go('/sos'),
      ),
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Quick Actions', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.2,
          ),
          itemCount: actions.length,
          itemBuilder: (context, index) => actions[index],
        ),
      ],
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BrutalTheme.borderRadiusDefault,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          border: Border.all(color: BrutalTheme.ink, width: 3),
          borderRadius: BrutalTheme.borderRadiusDefault,
          boxShadow: BrutalTheme.shadowCard,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: BrutalTheme.ink),
            const SizedBox(height: 12),
            Text(
              label,
              style: theme.textTheme.titleMedium?.copyWith(
                color: BrutalTheme.ink,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _TodayAtGateSection extends StatelessWidget {
  const _TodayAtGateSection();
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Today at the Gate', style: theme.textTheme.headlineSmall),
            TextButton(
              onPressed: () => context.go('/visits'),
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ..._mockVisits.map((visit) => _VisitCard(visit: visit)).toList(),
      ],
    );
  }
}

final _mockVisits = [
  _VisitData(
    time: '09:15',
    visitor: 'Amit Shah',
    flat: 'A-101',
    status: 'approved',
  ),
  _VisitData(
    time: '09:08',
    visitor: 'Zomato Delivery',
    flat: 'B-205',
    status: 'left_at_gate',
  ),
  _VisitData(
    time: '08:52',
    visitor: 'Rohit Verma',
    flat: 'C-312',
    status: 'denied',
  ),
];

class _VisitData {
  final String time;
  final String visitor;
  final String flat;
  final String status;
  
  const _VisitData({
    required this.time,
    required this.visitor,
    required this.flat,
    required this.status,
  });
}

class _VisitCard extends StatelessWidget {
  final _VisitData visit;
  
  const _VisitCard({super.key, required this.visit});
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusConfig = {
      'approved': {'label': 'APPROVED', 'color': BrutalTheme.mint},
      'denied': {'label': 'DENIED', 'color': BrutalTheme.rose},
      'left_at_gate': {'label': 'LEFT AT GATE', 'color': BrutalTheme.butter},
      'pending': {'label': 'PENDING', 'color': BrutalTheme.butter},
    };
    
    final config = statusConfig[visit.status] ?? {'label': visit.status.toUpperCase(), 'color': BrutalTheme.ink};
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: BrutalTheme.white,
        border: Border.all(color: BrutalTheme.ink, width: 3),
        borderRadius: BrutalTheme.borderRadiusDefault,
        boxShadow: BrutalTheme.shadowCard,
      ),
      child: Row(
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
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  visit.visitor,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  'Flat ${visit.flat}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: BrutalTheme.ink.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                visit.time,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontFamily: 'JetBrainsMono',
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: config['color'] as Color,
                  border: Border.all(color: BrutalTheme.ink, width: 2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  config['label'] as String,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: BrutalTheme.ink,
                    fontWeight: FontWeight.w700,
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