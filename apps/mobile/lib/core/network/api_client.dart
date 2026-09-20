import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guettgui_mobile/core/network/api_endpoints.dart';
import 'package:guettgui_mobile/core/storage/secure_storage.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: ApiEndpoints.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  final storage = ref.watch(secureStorageProvider);

  dio.interceptors.addAll([
    AuthInterceptor(dio: dio, storage: storage),
    if (kDebugMode) LoggingInterceptor(),
    RetryInterceptor(dio: dio),
  ]);

  return dio;
});

class AuthInterceptor extends Interceptor {
  final Dio dio;
  final SecureStorageService storage;

  AuthInterceptor({required this.dio, required this.storage});

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await storage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      try {
        final refreshToken = await storage.getRefreshToken();
        if (refreshToken == null) {
          handler.next(err);
          return;
        }

        final response = await Dio().post(
          '${ApiEndpoints.baseUrl}${ApiEndpoints.refreshToken}',
          data: {'refreshToken': refreshToken},
        );

        final newAccessToken = response.data['data']['accessToken'] as String;
        final newRefreshToken =
            response.data['data']['refreshToken'] as String;

        await storage.saveTokens(
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        );

        err.requestOptions.headers['Authorization'] =
            'Bearer $newAccessToken';

        final retryResponse = await dio.fetch(err.requestOptions);
        handler.resolve(retryResponse);
      } catch (_) {
        await storage.clearTokens();
        handler.next(err);
      }
    } else {
      handler.next(err);
    }
  }
}

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    debugPrint('[API] ${options.method} ${options.path}');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    debugPrint(
      '[API] ${response.statusCode} ${response.requestOptions.path}',
    );
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    debugPrint(
      '[API ERROR] ${err.response?.statusCode} ${err.requestOptions.path}: '
      '${err.message}',
    );
    handler.next(err);
  }
}

class RetryInterceptor extends Interceptor {
  final Dio dio;
  final int maxRetries;

  RetryInterceptor({required this.dio, this.maxRetries = 3});

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final statusCode = err.response?.statusCode;
    if (statusCode != null && statusCode >= 400 && statusCode < 500) {
      handler.next(err);
      return;
    }

    final retryCount =
        err.requestOptions.extra['retryCount'] as int? ?? 0;

    if (retryCount < maxRetries) {
      await Future<void>.delayed(
        Duration(seconds: retryCount + 1),
      );

      err.requestOptions.extra['retryCount'] = retryCount + 1;

      try {
        final response = await dio.fetch(err.requestOptions);
        handler.resolve(response);
      } catch (e) {
        handler.next(err);
      }
    } else {
      handler.next(err);
    }
  }
}
