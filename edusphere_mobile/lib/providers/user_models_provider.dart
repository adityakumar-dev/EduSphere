import 'package:edusphere_mobile/models/user_model.dart';
import 'package:flutter/material.dart';

class UserModelsProvider extends ChangeNotifier{
  
  UserModel? _data;
  UserModel? get data => _data;

  void upUserModel(UserModel model){
    _data = model;
    notifyListeners();
  }
  setUid(String uid){
    _data!.uid = uid;
    notifyListeners();
  }
  setName(String name){
    _data!.name = name;
    notifyListeners();
  }
  setEmail(String email){
    _data!.email = email;
    notifyListeners();
  }
  setPhone(String phone){
    _data!.phone = phone;
    notifyListeners();
  }
  setRollNumber(String rollNumber){
    _data!.rollNumber = rollNumber;
    notifyListeners();
  }
  setCourse(String course){
    _data!.course = course;
    notifyListeners();
  }
  setSemester(String semester){
    _data!.semester = semester;
    notifyListeners();
  }
  setGender(String gender){
    _data!.gender = gender;
    notifyListeners();
  }
  setDob(String dob){
    _data!.dateOfBirth = dob;
    notifyListeners();
  }
  setAbout(String about){
    _data!.about = about;
    notifyListeners();
  }
  UserModelsProvider(){
    _data = UserModel(
      name: '',
      email: '',
      phone: '',
      rollNumber: '',
      course: '',
      semester: '',
      gender: 'Male',
      dateOfBirth: DateTime.now().toString(),
      about: '',
      uid: '',
    );
  }
}