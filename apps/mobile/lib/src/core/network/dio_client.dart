import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

part 'dio_client.g.dart';

@riverpod
Dio dio(DioRef ref) {
  final dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2:4000/v1', // Android emulator uses 10.0.2.2 for localhost
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ));
  
  // Add auth interceptor
  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      final storage = const FlutterSecureStorage();
      // In a real app, you'd get tokens from secure storage
      handler.next(options);
    },
    onError: (error, handler) {
      if (error.response?.statusCode == 401) {
        // Token expired, trigger refresh
        // In a real app, you'd trigger a token refresh here
      }
      handler.next(error);
    },
  ));
  
  return dio;
}

class DioClient {
  late final Dio _dio;
  String? _accessToken;
  String? _refreshToken;
  
  DioClient() {
    _dio = Dio(BaseOptions(
      baseUrl: 'http://10.0.2.2:4000/v1',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_accessToken != null) {
          options.headers['Authorization'] = 'Bearer $_accessToken';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401 && _refreshToken != null) {
          try {
            await _refreshToken();
            // Retry original request
            final options = error.requestOptions;
            options.headers['Authorization'] = 'Bearer $_accessToken';
            final response = await _dio.fetch(options);
            return handler.resolve(response);
          } catch (e) {
            // Refresh failed, clear tokens
            await _clearTokens();
          }
        }
        handler.next(error);
      },
    ));
  }
  
  void setTokens(String accessToken, String refreshToken) {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  }
  
  Future<void> _refreshToken() async {
    final response = await _dio.post('/auth/refresh', data: {
      'refresh_token': _refreshToken,
      // device_id would be passed in real implementation
    });
    
    final data = response.data['data'];
    _accessToken = data['accessToken'];
    _refreshToken = data['refreshToken'];
  }
  
  Future<void> _clearTokens() async {
    _accessToken = null;
    _refreshToken = null;
    // Clear from secure storage
  }
  
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    return _dio.get(path, queryParameters: queryParameters);
  }
  
  Future<Response> post(String path, {dynamic data}) async {
    return _dio.post(path, data: data);
  }
  
  Future<Response> put(String path, {dynamic data}) async {
    return _dio.put(path, data: data);
  }
  
  Future<Response> delete(String path) async {
    return _dio.delete(path);
  }
}