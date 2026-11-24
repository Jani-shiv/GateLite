import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:gatelite_mobile/src/core/theme/brutal_theme.dart';
import 'package:gatelite_mobile/src/core/router/app_router.dart';
import 'package:gatelite_mobile/src/core/network/dio_client.dart';
import 'package:gatelite_mobile/src/core/notifications/notification_service.dart';
import 'package:gatelite_mobile/src/core/database/drift_database.dart';
import 'package:gatelite_mobile/src/features/auth/providers/auth_provider.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app.g.dart';

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  return createAppRouter(ref);
}

@riverpod
DioClient dioClient(DioClientRef ref) {
  return DioClient();
}

@riverpod
NotificationService notificationService(NotificationServiceRef ref) {
  return NotificationService();
}

@riverpod
AppDatabase appDatabase(AppDatabaseRef ref) {
  return AppDatabase();
}

class GateLiteApp extends ConsumerWidget {
  const GateLiteApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final theme = BrutalTheme.light;
    
    return MaterialApp.router(
      title: 'GateLite',
      debugShowCheckedModeBanner: false,
      theme: theme,
      darkTheme: BrutalTheme.dark,
      themeMode: ThemeMode.system,
      routerConfig: router,
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(MediaQuery.of(context).textScaler.scale(1.0).clamp(1.0, 1.3)),
          ),
          child: child!,
        );
      },
    );
  }
}