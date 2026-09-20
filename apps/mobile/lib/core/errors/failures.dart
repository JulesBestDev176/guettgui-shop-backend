sealed class Failure {
  final String message;
  const Failure(this.message);

  @override
  String toString() => 'Failure: $message';
}

class ServerFailure extends Failure {
  final int? statusCode;
  const ServerFailure(super.message, {this.statusCode});
}

class CacheFailure extends Failure {
  const CacheFailure(super.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([
    String message = 'Pas de connexion Internet. Verifiez votre reseau.',
  ]) : super(message);
}

class ValidationFailure extends Failure {
  final Map<String, String>? fieldErrors;
  const ValidationFailure(super.message, {this.fieldErrors});
}

class AuthFailure extends Failure {
  const AuthFailure(super.message);
}

class UnknownFailure extends Failure {
  const UnknownFailure([super.message = 'Une erreur inattendue est survenue.']);
}
