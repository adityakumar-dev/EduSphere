class UserModel {
  String name;
  String email;
  String phone;
  String rollNumber;
  String course;
  String semester;
  String gender;
  String dateOfBirth;
  String about;
  String? uid;
  UserModel({required this.name, required this.email, required this.phone, required this.rollNumber, required this.course, required this.semester, required this.gender, required this.dateOfBirth, required this.about,  this.uid});

  // Named factory constructor
  factory UserModel.fromMap(Map<String, dynamic> data) {
    return UserModel(
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'] ?? '',
      rollNumber: data['rollNumber'] ?? '',
      course: data['course'] ?? '',
      semester: data['semester'] ?? '',
      gender: data['gender'] ?? '',
      dateOfBirth: data['dateOfBirth'] ?? '',
      about: data['about'] ?? '',
      uid: data['uid'] ?? '',
    );
  }

  // Convert object to map
  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'rollNumber': rollNumber,
      'course': course,
      'semester': semester,
      'gender': gender,
      'dateOfBirth': dateOfBirth,
      'about': about,
    };
  }
}
