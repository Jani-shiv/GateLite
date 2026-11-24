import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gatelite_mobile/src/core/network/dio_client.dart';
import 'package:gatelite_mobile/src/shared/models/user.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

part 'auth_provider.g.dart';

@riverpod
class AuthState extends _$AuthState {
  @override
  Future<AuthData?> build() async {
    // Check for stored tokens on app start
    final storage = const FlutterSecureStorage();
    final accessToken = await storage.read(key: 'access_token');
    final refreshToken = await storage.read(key: 'refresh_token');
    final deviceId = await storage.read(key: 'device_id');
    
    if (accessToken != null && refreshToken != null && deviceId != null) {
      try {
        final dio = DioClient();
        dio.setTokens(accessToken, refreshToken);
        
        final response = await dio.get('/v1/auth/me');
        if (response.statusCode == 200) {
          final user = User.fromJson(response.data['data']);
          return AuthData(
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
            deviceId: deviceId,
          );
        }
      } catch (e) {
        // Tokens invalid, clear storage
        await _clearStorage();
      }
    }
    return null;
  }
  
  Future<void> sendOtp(String phone, String deviceId) async {
    state = const AsyncLoading();
    try {
      final dio = DioClient();
      await dio.post('/v1/auth/otp/send', data: {
        'phone': phone,
        'device_id': deviceId,
      });
      state = AsyncData(state.value); // Keep current state, just trigger success
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    }
  }
  
  Future<void> verifyOtp(String phone, String code, String deviceId) async {
    state = const AsyncLoading();
    try {
      final dio = DioClient();
      final response = await dio.post('/v1/auth/otp/verify', data: {
        'phone': phone,
        'code': code,
        'device_id': deviceId,
      });
      
      final data = response.data['data'];
      final user = User.fromJson(data['user']);
      final accessToken = data['accessToken'];
      final refreshToken = data['refreshToken'];
      
      final storage = const FlutterSecureStorage();
      await storage.write(key: 'access_token', value: accessToken);
      await storage.write(key: 'refresh_token', value: refreshToken);
      await storage.write(key: 'device_id', value: deviceId);
      
      dio.setTokens(accessToken, refreshToken);
      
      state = AsyncData(AuthData(
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        deviceId: deviceId,
      ));
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    }
  }
  
  Future<void> refreshTokens() async {
    final currentState = state.value;
    if (currentState == null) return;
    
    try {
      final dio = DioClient();
      dio.setTokens(currentState.accessToken, currentState.refreshToken);
      
      final response = await dio.post('/v1/auth/refresh', data: {
        'refresh_token': currentState.refreshToken,
        'device_id': currentState.deviceId,
      });
      
      final data = response.data['data'];
      final accessToken = data['accessToken'];
      final refreshToken = data['refreshToken'];
      
      final storage = const FlutterSecureStorage();
      await storage.write(key: 'access_token', value: accessToken);
      await storage.write(key: 'refresh_token', value: refreshToken);
      
      dio.setTokens(accessToken, refreshToken);
      
      state = AsyncData(currentState.copyWith(
        accessToken: accessToken,
        refreshToken: refreshToken,
      ));
    } catch (e) {
      await logout();
      rethrow;
    }
  }
  
  Future<void> logout() async {
    final currentState = state.value;
    if (currentState != null) {
      final dio = DioClient();
      dio.setTokens(currentState.accessToken, currentState.refreshToken);
      try {
        await dio.post('/v1/auth/revoke');
      } catch (e) {
        // Ignore errors on logout
      }
    }
    await _clearStorage();
    state = const AsyncData(null);
  }
  
  Future<void> _clearStorage() async {
    final storage = const FlutterSecureStorage();
    await storage.delete(key: 'access_token');
    await storage.delete(key: 'refresh_token');
    await storage.delete(key: 'device_id');
  }
}

class AuthData {
  final User user;
  final String accessToken;
  final String refreshToken;
  final String deviceId;
  
  const AuthData({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
    required this.deviceId,
  });
  
  bool get isAuthenticated => true;
  
  AuthData copyWith({
    User? user,
    String? accessToken,
    String? refreshToken,
    String? deviceId,
  }) {
    return AuthData(
      user: user ?? this.user,
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      deviceId: deviceId ?? this.deviceId,
    );
  }
}