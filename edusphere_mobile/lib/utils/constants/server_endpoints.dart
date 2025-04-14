class ServerEndpoints {
  static const String baseUrl = 'https://enabled-flowing-bedbug.ngrok-free.app';
  static const String signUp = '$baseUrl/student/create';
  static String login(String id) => '$baseUrl/student/$id';
}

