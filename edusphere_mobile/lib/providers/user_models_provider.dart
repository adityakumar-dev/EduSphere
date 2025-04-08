import 'package:edusphere_mobile/models/user_model.dart';
import 'package:flutter/material.dart';

class UserModelsProvider extends ChangeNotifier{
  
  UserModel? _data;
  UserModel? get data => _data;

  void upUserModel(UserModel model){
    _data = model;
    notifyListeners();
  }

}