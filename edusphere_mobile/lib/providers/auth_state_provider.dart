import 'dart:async';
import 'dart:convert';

import 'package:edusphere_mobile/apis/firebase/firebase_auth.dart';
import 'package:edusphere_mobile/providers/user_models_provider.dart';
import 'package:edusphere_mobile/screens/auth/forms/forms_details_screen.dart';
import 'package:edusphere_mobile/screens/home/home_screen.dart';
import 'package:edusphere_mobile/utils/constants/server_endpoints.dart';
import 'package:edusphere_mobile/utils/ui/alert_dialog.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
class AuthStateProvider extends ChangeNotifier{
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  
  void setIsLoading(bool value){
    _isLoading = value;
    notifyListeners();
  }
  bool _isSignUp = true;
  bool get isSignUp => _isSignUp;
 
  void setIsSignUp(bool value){
    _isSignUp = value;
    notifyListeners();
  }

  String _errorMessage = '';
  String get errorMessage => _errorMessage;
  void setErrorMessage(String value){
    _errorMessage = value;
    notifyListeners();
  }
  String _successMessage = '';
  String get successMessage => _successMessage;
  void setSuccessMessage(String value){
    _successMessage = value;
    notifyListeners();
  }
  
  void clearMessages(){
    _errorMessage = '';
    _successMessage = '';
    notifyListeners();
  }
  Timer? _timer;
  Timer? get timer => _timer;
  void setTimer(Timer? value){
    _timer = value;
    notifyListeners();
  }
  void cancelTimer(){
    _timer?.cancel();
    notifyListeners();
  }
  Future<void>   signUpWithEmail(BuildContext context, String email, String password) async {
  
    final timeout = Duration(seconds: 10);
    setTimer(Timer(timeout, () {
      if (context.mounted) {
        cancelTimer();
        setIsLoading(false);
        notifyListeners();
        // Navigator.pop(context);
        showProgressDialog(context, 'Failed to sign up', 'Please try again');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to sign up')),
        );
      }
    }));
    setIsLoading(true);
    showProgressDialog(context, 'Signing up', 'Please wait while we are creating your account');
    Map<String, dynamic> userInfo = await FirebaseAuthApi.signUpWithEmail(
      email,
      password,
    );
    Navigator.pop(context);
    if (userInfo['uid'] != null) 
    {
     
      final provider =Provider.of<UserModelsProvider>(context, listen: false);
      provider.setUid(userInfo['uid']);
      provider.setEmail(userInfo['email']);
       ScaffoldMessenger.of(context)..hideCurrentSnackBar()..showSnackBar(
        SnackBar(content: Text(provider.data!.uid.toString())),
      );
      Navigator.pushReplacementNamed(context, FormsDetailsScreen.routeName);
    } else {
      cancelTimer();
      setIsLoading(false);

      ScaffoldMessenger.of(context).showSnackBar(
         SnackBar(content: Text('Failed to sign up ${userInfo['error']}')),
      );
    
    }
    clearMessages();
  }

  Future<void> signInWithEmail(BuildContext context, String email, String password) async {
    setIsLoading(true);
    showProgressDialog(context, 'Signing in', 'Please wait while we are signing in');
    bool isSuccess = await FirebaseAuthApi.signInWithEmail(email, password);
    if(isSuccess){
      final provider =Provider.of<UserModelsProvider>(context, listen: false);
      Navigator.pop(context);
      showProgressDialog(context, "Getting User", "Please wait while we are getting your account");
      // Map<String, dynamic> userInfo = await FirebaseAuthApi.getUserInfo();
     final response = await http.get(Uri.parse(ServerEndpoints.login(email)));
     if(response.statusCode == 200){
      final data = jsonDecode(response.body);
      final user = data['student'][0];
      provider.setUid(user['uid']);
      provider.setEmail(user['email']);
      provider.setName(user['name']);
      provider.setPhone(user['phone']);
      provider.setSemester(user['semester']);
      provider.setGender(user['gender']);
      provider.setDob(user['dob']);
      provider.setUid(user['uid']);
      provider.setEmail(user['email']);
      provider.setPhone(user['phone']);
      provider.setRollNumber(user['rollNumber']);
      provider.setSemester(user['semester']);
      provider.setCourse(user['branchId']);
            Navigator.pushReplacementNamed(context, HomeScreen.routeName);

}else{
  setIsLoading(false);
  setErrorMessage('Failed to Get User Info');
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Failed to Get User Info')),
  );

}
    }else{
      setIsLoading(false);
      setErrorMessage('Failed to sign in');
    }
    
  }


  
}