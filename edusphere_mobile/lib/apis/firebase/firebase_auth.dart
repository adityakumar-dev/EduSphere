import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class FirebaseAuthApi {
  static Future<bool> signInWithEmail(String email, String password) async {
   final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(email: email, password: password);
   return credential.user != null;
  }

  static Future<bool> signUpWithEmail(String email, String password) async {
    final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(email: email, password: password);
    return credential.user != null;
  }

  static Future<bool> signInWithGoogle() async {
    GoogleSignIn googleSignIn =await GoogleSignIn();
    final GoogleSignInAccount? googleSignInAccount = await googleSignIn.signIn();
    if(googleSignInAccount != null){
      final GoogleSignInAuthentication googleSignInAuthentication = await googleSignInAccount.authentication;
      final credential = await FirebaseAuth.instance.signInWithCredential(GoogleAuthProvider.credential(
        accessToken: googleSignInAuthentication.accessToken,
        idToken: googleSignInAuthentication.idToken,
      ));
      return credential.user != null;
    }
    return false;
  }


  static Future<void> signOut() async {
    await FirebaseAuth.instance.signOut();
  }

  static Future<User?> getCurrentUser() async {
    return FirebaseAuth.instance.currentUser;
  }
  static Future<Map<String, dynamic>> getUserInfo() async {
    final user = await getCurrentUser();
   
    return {
      'email': user?.email,
      'uid': user?.uid,
      'displayName': user?.displayName,
      'photoURL': user?.photoURL,
      'phoneNumber': user?.phoneNumber,
    };
  } 
  
}

