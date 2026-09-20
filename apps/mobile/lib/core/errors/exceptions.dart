import 'package:dio/dio.dart';

class ServerException implements Exception {
  final String message;
  final int? statusCode;

  const ServerException(this.message, {this.statusCode});

  factory ServerException.fromDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const ServerException(
          'Le serveur met trop de temps a repondre.',
          statusCode: 408,
        );
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;
        final message = data is Map ? data['message'] as String? : null;
        return ServerException(
          message ?? _getMessageFromStatusCode(statusCode),
          statusCode: statusCode,
        );
      case DioExceptionType.cancel:
        return const ServerException('Requete annulee.');
      case DioExceptionType.connectionError:
        return const ServerException(
          'Impossible de se connecter au serveur.',
        );
      default:
        return const ServerException('Une erreur reseau est survenue.');
    }
  }

  static String _getMessageFromStatusCode(int? statusCode) {
    switch (statusCode) {
      case 400:
        return 'Requete invalide.';
      case 401:
        return 'Session expiree. Veuillez vous reconnecter.';
      case 403:
        return 'Vous n\'avez pas la permission d\'effectuer cette action.';
      case 404:
        return 'Ressource introuvable.';
      case 409:
        return 'Conflit avec les donnees existantes.';
      case 422:
        return 'Donnees invalides.';
      case 429:
        return 'Trop de requetes. Veuillez patienter.';
      case 500:
        return 'Erreur interne du serveur.';
      default:
        return 'Une erreur est survenue.';
    }
  }

  @override
  String toString() => 'ServerException: $message (code: $statusCode)';
}

class CacheException implements Exception {
  final String message;
  const CacheException([this.message = 'Erreur de cache local.']);

  @override
  String toString() => 'CacheException: $message';
}

class NetworkException implements Exception {
  final String message;
  const NetworkException([this.message = 'Pas de connexion Internet.']);

  @override
  String toString() => 'NetworkException: $message';
}
