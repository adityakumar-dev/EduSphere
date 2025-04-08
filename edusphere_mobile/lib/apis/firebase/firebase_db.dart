import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:edusphere_mobile/models/user_model.dart';

class FirebaseDb {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static Future<void> createUser(String id,UserModel user) async {

    await _firestore.collection('users').doc(id).set(user.toMap());
  }

  static Future<void> updateUser(String id,UserModel user) async {
    await _firestore.collection('users').doc(id).update(user.toMap());
  }

  static Future<void> deleteUser(String id) async {
    await _firestore.collection('users').doc(id).delete();
  }

  static Future<UserModel> getUser(String id) async {
    final doc = await _firestore.collection('users').doc(id).get();
    return UserModel.fromMap(doc.data() ?? {});
  }
}

