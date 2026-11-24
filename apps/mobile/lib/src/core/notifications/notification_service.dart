import 'dart:async';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:gatelite_mobile/src/core/database/drift_database.dart';
import 'package:gatelite_mobile/src/core/network/dio_client.dart';

part 'notification_service.g.dart';

@riverpod
NotificationService notificationService(NotificationServiceRef ref) {
  return NotificationService();
}

class NotificationService {
  static final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  
  bool _initialized = false;
  
  Future<void> initialize() async {
    if (_initialized) return;
    
    // Initialize local notifications
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );
    
    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
    );
    
    // Request permissions
    await _requestPermissions();
    
    // Get FCM token
    final token = await _firebaseMessaging.getToken();
    if (token != null) {
      await _sendTokenToServer(token);
    }
    
    // Listen for token refresh
    _firebaseMessaging.onTokenRefresh.listen(_sendTokenToServer);
    
    // Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    
    // Handle background taps
    FirebaseMessaging.onMessageOpenedApp.listen(_onNotificationTap);
    
    _initialized = true;
  }
  
  Future<void> _requestPermissions() async {
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );
    
    await _localNotifications
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
  }
  
  Future<void> _sendTokenToServer(String token) async {
    try {
      final dio = DioClient();
      await dio.post('/v1/devices/register', data: {
        'fcm_token': token,
        'platform': 'android', // or ios
      });
    } catch (e) {
      // Silently fail, token will be sent on next login
    }
  }
  
  void _handleForegroundMessage(RemoteMessage message) {
    _showLocalNotification(
      title: message.notification?.title ?? 'GateLite',
      body: message.notification?.body ?? '',
      payload: message.data,
    );
  }
  
  void _onNotificationTap(NotificationResponse response) {
    final payload = response.payload;
    if (payload != null) {
      _handleNotificationPayload(payload);
    }
  }
  
  void _onNotificationTap(RemoteMessage message) {
    final data = message.data;
    if (data.isNotEmpty) {
      _handleNotificationPayload(data);
    }
  }
  
  void _handleNotificationPayload(Map<String, dynamic> payload) {
    // Navigate based on payload type
    // In a real app, you'd use a navigator key or router
    final type = payload['type'] as String?;
    final id = payload['id'] as String?;
    
    switch (type) {
      case 'visit':
        // Navigate to approval screen
        break;
      case 'notice':
        // Navigate to notice
        break;
      case 'ticket':
        // Navigate to ticket
        break;
      case 'sos':
        // Navigate to SOS screen
        break;
    }
  }
  
  Future<void> _showLocalNotification({
    required String title,
    required String body,
    Map<String, dynamic>? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'gatelite_channel',
      'GateLite Notifications',
      channelDescription: 'Notifications for GateLite app',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: 0xFFB8F2D0, // mint
      enableVibration: true,
      playSound: true,
    );
    
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );
    
    await _localNotifications.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      title,
      body,
      details,
      payload: payload?.toString(),
    );
  }
  
  // Show SOS alert
  Future<void> showSosAlert({
    required String flatNumber,
    required String societyName,
  }) async {
    await _showLocalNotification(
      title: '🚨 SOS ALERT',
      body: 'Emergency at Flat $flatNumber in $societyName',
      payload: {'type': 'sos', 'flat': flatNumber, 'society': societyName},
    );
  }
  
  // Show visit approval notification
  Future<void> showVisitApproval({
    required String visitorName,
    required String flatNumber,
    required String visitId,
  }) async {
    await _showLocalNotification(
      title: 'New Visitor',
      body: '$visitorName is at the gate for Flat $flatNumber',
      payload: {'type': 'visit', 'id': visitId, 'flat': flatNumber},
    );
  }
  
  // Show notice notification
  Future<void> showNotice({
    required String title,
    required String body,
    String? noticeId,
  }) async {
    await _showLocalNotification(
      title: title,
      body: body,
      payload: noticeId != null ? {'type': 'notice', 'id': noticeId} : null,
    );
  }
}