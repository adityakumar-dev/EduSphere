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

  UserModel(this.name, this.email, this.phone, this.rollNumber, this.course, this.semester, this.gender, this.dateOfBirth, this.about);

  // Named factory constructor
  factory UserModel.fromMap(Map<String, dynamic> data) {
    return UserModel(
      data['name'] ?? '',
      data['email'] ?? '',
      data['phone'] ?? '',
      data['rollNumber'] ?? '',
      data['course'] ?? '',
      data['semester'] ?? '',
      data['gender'] ?? '',
      data['dateOfBirth'] ?? '',
      data['about'] ?? '',
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
