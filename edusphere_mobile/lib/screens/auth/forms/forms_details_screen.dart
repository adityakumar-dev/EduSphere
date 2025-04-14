import 'dart:convert';

import 'package:edusphere_mobile/apis/firebase/firebase_auth.dart';
import 'package:edusphere_mobile/apis/firebase/firebase_db.dart';
import 'package:edusphere_mobile/models/user_model.dart';
import 'package:edusphere_mobile/providers/user_models_provider.dart';
import 'package:edusphere_mobile/screens/home/home_screen.dart';
import 'package:edusphere_mobile/utils/constants/app_constants.dart';
import 'package:edusphere_mobile/utils/constants/server_endpoints.dart';
import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:edusphere_mobile/utils/ui/ui_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

class FormsDetailsScreen extends StatefulWidget {
  static const String routeName = '/forms-details';
  const FormsDetailsScreen({super.key});

  @override
  State<FormsDetailsScreen> createState() => _FormsDetailsScreenState();
}

class _FormsDetailsScreenState extends State<FormsDetailsScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  // final _nameController = TextEditingController();
  // final _rollNumberController = TextEditingController();
  // final _phoneController = TextEditingController();
  // final _courseController = TextEditingController();
  // final _semesterController = TextEditingController();
  bool _isLoading = false;
  String _selectedGender = 'Male';
  DateTime? _selectedDate;
  String? _selectedSemester;
  String? _selectedCourse;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  String generateYear() {
    if (_selectedSemester == '1st' || _selectedSemester == '2nd') {
      return '1';
    } else if (_selectedSemester == '3rd' || _selectedSemester == '4th') {
      return '2';
    } else if (_selectedSemester == '5th' || _selectedSemester == '6th') {
      return '3';
    } else if (_selectedSemester == '7th' || _selectedSemester == '8th') {
      return '4';
    } else if (_selectedSemester == '9th' || _selectedSemester == '10th') {
      return '5';
    } else if (_selectedSemester == '11th' || _selectedSemester == '12th') {
      return '6';
    }
    return '0';
  }

  @override
  void dispose() {
    _animationController.dispose();

    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      UserModel user = Provider.of<UserModelsProvider>(context, listen: false).data!;
     

      Map<String, dynamic> jsonData = {
        'app_auth_cert': 'linmar_dev_crt',
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'rollNumber': user.rollNumber,
        'branchId': user.course,
        'yearId': generateYear(),
        'semester': user.semester,
        'sectionId': 'A',
        'gender': user.gender,
        'dob': user.dateOfBirth,
        'uid': user.uid,
      };
      var response = await http.post(
        Uri.parse(ServerEndpoints.signUp),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(jsonData),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        Navigator.pushReplacementNamed(context, HomeScreen.routeName);
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: ${response.body}')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
    // ScaffoldMessenger.of(context)
    //   ..hideCurrentSnackBar()
    //   ..showSnackBar(SnackBar(content: Text(widget.uid.toString())));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomCenter,
            colors: [AppColors.primaryColor.withOpacity(0.1), Colors.white],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 32.0,
            ),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
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
                          // Progress Indicator
                          LinearProgressIndicator(
                            value: 0.8,
                            backgroundColor: Colors.grey[200],
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppColors.primaryColor,
                            ),
                            minHeight: 6,
                          ),
                          const SizedBox(height: 24),

                          // Form Fields
                          _buildFormField(
                            "Full Name",
                            Icons.person_outline,

                            (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your name';
                              }
                              return null;
                            },
                            (value) {
                              Provider.of<UserModelsProvider>(
                                context,
                                listen: false,
                              ).setName(value);
                            },
                          ),
                          const SizedBox(height: 16),

                          _buildFormField(
                            "Roll Number",
                            Icons.numbers,
                            (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your roll number';
                              }
                              return null;
                            },
                            (value) {
                              Provider.of<UserModelsProvider>(
                                context,
                                listen: false,
                              ).setRollNumber(value);
                            },
                          ),
                          const SizedBox(height: 16),

                          _buildFormField(
                            "Phone Number",
                            Icons.phone_outlined,
                            (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your phone number';
                              }
                              if (value.length < 10) {
                                return 'Please enter a valid phone number';
                              }
                              return null;
                            },
                            (value) {
                              Provider.of<UserModelsProvider>(
                                context,
                                listen: false,
                              ).setPhone(value);
                            },
                          ),
                          const SizedBox(height: 16),

                          DropdownButtonFormField<String>(
                            onChanged: (String? newValue) {
                              setState(() {
                                _selectedCourse = newValue;
                                ScaffoldMessenger.of(
                                  context,
                                ).hideCurrentSnackBar();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Course: ${Provider.of<UserModelsProvider>(context, listen: false).data!.course}',
                                    ),
                                  ),
                                );
                              });
                              Provider.of<UserModelsProvider>(
                                context,
                                listen: false,
                              ).setCourse(newValue ?? '');
                            },
                            value: _selectedCourse,
                            decoration: const InputDecoration(
                              labelText: 'Course',
                              border: InputBorder.none,
                              prefixIcon: Icon(Icons.school_outlined),
                            ),
                            items:
                                AppConstants.branches.map((String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Text(value),
                                  );
                                }).toList(),
                          ),
                          const SizedBox(height: 16),

                          // Semester and Gender Row
                          Row(
                            children: [
                              Expanded(
                                child: DropdownButtonFormField<String>(
                                  value: _selectedSemester,
                                  decoration: const InputDecoration(
                                    labelText: 'Semester',
                                    border: InputBorder.none,
                                  ),
                                  items:
                                      AppConstants.semesters.map((
                                        String value,
                                      ) {
                                        return DropdownMenuItem<String>(
                                          value: value,
                                          child: Text(value),
                                        );
                                      }).toList(),
                                  onChanged: (String? newValue) {
                                    setState(() {
                                      _selectedSemester = newValue;
                                      Provider.of<UserModelsProvider>(context, listen: false).setSemester(newValue ?? '');
                                      ScaffoldMessenger.of(context)
                                        ..hideCurrentSnackBar()
                                        ..showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Semester: ${Provider.of<UserModelsProvider>(context, listen: false).data!.semester}',
                                            ),
                                          ),
                                        );
                                    });
                                  },
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: DropdownButtonFormField<String>(
                                  value: _selectedGender,
                                  decoration: const InputDecoration(
                                    labelText: 'Gender',
                                    // prefixIcon: Icon(Icons.people_outline),
                                    border: InputBorder.none,
                                  ),
                                  items:
                                      AppConstants.genders.map((String value) {
                                        return DropdownMenuItem<String>(
                                          value: value,
                                          child: Text(value),
                                        );
                                      }).toList(),
                                  onChanged: (String? newValue) {
                                    if (newValue != null) {
                                      setState(() {
                                        _selectedGender = newValue;
                                        Provider.of<UserModelsProvider>(context, listen: false).setGender(newValue ?? '');
                                      });
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Date of Birth Field
                          InkWell(
                            onTap: () => _selectDate(context),
                            child: InputDecorator(
                              decoration: const InputDecoration(
                                labelText: 'Date of Birth',
                                prefixIcon: Icon(Icons.cake_outlined),
                                border: InputBorder.none,
                              ),
                              child: Text(
                                _selectedDate == null
                                    ? 'Select Date'
                                    : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),

                          // Submit Button
                          ElevatedButton(
                            onPressed: _isLoading ? null : _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryColor,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 2,
                            ),
                            child:
                                _isLoading
                                    ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                              Colors.white,
                                            ),
                                      ),
                                    )
                                    : const Text(
                                      'Complete Profile',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormField(
    String label,
    IconData icon,
    String? Function(String?)? validator,
    Function(String) onChanged,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(10),
      ),
      child: TextFormField(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: AppColors.primaryColor),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.grey[50],
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
        ),
        validator: validator,
        onChanged: (value) {
          onChanged(value);
          // ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value)));
        },
      ),
    );
  }
}
