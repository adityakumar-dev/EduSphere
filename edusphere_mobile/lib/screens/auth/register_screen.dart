import 'package:edusphere_mobile/apis/firebase/firebase_auth.dart';
import 'package:edusphere_mobile/apis/firebase/firebase_db.dart';
import 'package:edusphere_mobile/models/user_model.dart';
import 'package:edusphere_mobile/screens/auth/forms/forms_details_screen.dart';
import 'package:edusphere_mobile/utils/ui/alert_dialog.dart';
import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:edusphere_mobile/utils/ui/ui_helper.dart';
import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  static const String routeName = '/register';
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;

  Future<void> _signUpWithEmail() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    showProgressDialog(context, 'Checking User', 'Please wait while we are checking your account');
    //first check existing user
    bool isUserExists = await FirebaseAuthApi.signInWithEmail(
      _emailController.text.trim(),
      _passwordController.text,
    );
    if (isUserExists) {
      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, '/home');
      return;
    }
    Navigator.pop(context);
    showProgressDialog(context, 'Signing up', 'Please wait while we are creating your account');
    bool isSuccess = await FirebaseAuthApi.signUpWithEmail(
      _emailController.text.trim(),
      _passwordController.text,
    );
    Navigator.pop(context);
    if (isSuccess) {
      Navigator.pushReplacementNamed(context, '/user_info');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to sign up')),
      );
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() => _isLoading = true);
    showProgressDialog(context, "Signing in with Google", "Please wait while we are signing in with Google");
    bool isSuccess = await FirebaseAuthApi.signInWithGoogle();

    if (isSuccess) {
    showProgressDialog(context, "Checking User", "Please wait while we are checking your account");
    Map<String, dynamic> userInfo = await FirebaseAuthApi.getUserInfo();
    UserModel user = await FirebaseDb.getUser(userInfo['uid']);
     
     if(user.email == null || user.email.isEmpty){
      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, '/user_info');
     }else{
      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, '/home');
     }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to sign in with Google')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.primaryColor.withOpacity(0.1).withOpacity(0.1),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Header Section
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.accentColor),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.school_rounded,
                            size: 40,
                            color: AppColors.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 16),
                        kText(
                          "Welcome to EduSphere",
                          color: AppColors.primaryColor,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        const SizedBox(height: 8),
                        kText(
                          "Create your account to start learning",
                          color: Colors.grey[600],
                          fontSize: 16,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Form Section
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Name Field
                     

                        // Email Field
                        kTextFormField(
                          "Email",
                          _emailController,
                          prefixIcon: const Icon(Icons.email_outlined),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            }
                            if (!value.contains('@')) {
                              return 'Please enter a valid email';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Password Field
                        kTextFormField(
                          "Password",
                          _passwordController,
                          prefixIcon: const Icon(Icons.lock_outline),
                          isPassword: _obscurePassword,
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your password';
                            }
                            if (value.length < 6) {
                              return 'Password must be at least 6 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // Sign Up Button
                        ElevatedButton(
                          onPressed: (){
                            Navigator.pushNamed(context, FormsDetailsScreen.routeName);
                          },
                          // onPressed: _isLoading ? null : _signUpWithEmail,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 2,
                          ),
                          child: _isLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : const Text(
                                  'Continue With Email',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                        ),
                        const SizedBox(height: 16),

                        // Divider with "OR" text
                        Row(
                          children: [
                            Expanded(
                              child: Divider(
                                color: Colors.grey[300],
                                thickness: 1,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Text(
                                'OR',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Expanded(
                              child: Divider(
                                color: Colors.grey[300],
                                thickness: 1,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Google Sign In Button
                        widget_google_signup(),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  OutlinedButton widget_google_signup() {
    return OutlinedButton.icon(
                        onPressed: _isLoading ? null : _signInWithGoogle,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: BorderSide(color: Colors.grey[300]!),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        icon: Image.asset(
                          'assets/images/google_logo.png',
                          height: 24,
                        ),
                        label: const Text(
                          'Continue with Google',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black87,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    // _nameController.dispose();
    super.dispose();
  }
}
