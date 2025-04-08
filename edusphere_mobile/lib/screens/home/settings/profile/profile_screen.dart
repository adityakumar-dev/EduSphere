import 'package:edusphere_mobile/utils/constants/app_constants.dart';
import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:edusphere_mobile/utils/ui/ui_helper.dart';
import 'package:edusphere_mobile/utils/ui/widget_appbar.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  TextEditingController nameController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                widget_appbar(context, "Profile", "Student", "Edit your profile"),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 80), // Add padding for save button
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        buildProfileFormCard("Current Name", "Name", nameController),
                        const SizedBox(height: 8),
                        buildProfileFormCard(
                          "Current Email",
                          "Email",
                          nameController,
                        ),
                        const SizedBox(height: 8),
                        buildProfileFormCard(
                          "Current Phone No.",
                          "Phone number",
                          nameController,
                        ),
                        const SizedBox(height: 8),
                        buildProfileFormCard(
                          "Current about",
                          "About",
                          nameController,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: buildDropDownMenuButtons(
                                AppConstants.genders,
                                "Gender",
                                (value) {},
                              ),
                            ),
                            Expanded(
                              child: buildDropDownMenuButtons(
                                AppConstants.semesters,
                                "Semester",
                                (value) {},
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: buildDatePicker(
                                nameController,
                                Icons.calendar_month,
                                context,
                              ),
                            ),
                            Expanded(
                              child: buildDropDownMenuButtons(
                                AppConstants.branches,
                                "Branch",
                                (value) {},
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                // decoration: BoxDecoration(
                //   color: Colors.white,
                //   boxShadow: [
                //     BoxShadow(
                //       color: Colors.black.withOpacity(0.1),
                //       blurRadius: 10,
                //       offset: const Offset(0, -5),
                //     ),
                //   ],
                // ),
                child: buildElevatedButton("Save", () {}),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

buildProfileFormCard(
  String title,
  String label,
  TextEditingController controller,
) {
  return Container(
    margin: EdgeInsets.symmetric(horizontal: 10),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(10),
      // border: Border.all(color: AppColors.accentColor),
      boxShadow: [
        BoxShadow(
          color: AppColors.accentColor.withOpacity(0.5),
          offset: Offset(0, 3),
        ),
        BoxShadow(color: AppColors.accentColor.withOpacity(0.1),offset: Offset(0, -3)),
      ],
    ),
    child: Column(
      children: [
        // Container(
        //   padding: EdgeInsets.only(left: 8, right: 8, top: 4, bottom: 2),
        //   alignment: Alignment.centerLeft,
        //   child: kText(
        //     title,
        //     fontSize: 16,
        //     fontWeight: FontWeight.bold,
        //     align: TextAlign.start,
        //   ),
        // ),
        Container(
          padding: EdgeInsets.all(10),
          child: kTextFormField(label, controller),
        ),
      ],
    ),
  );
}

buildDropDownMenuButtons(
  List<String> items,
  String label,
  Function(String) onChanged,
) {
  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 10),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.accentColor.withOpacity(0.5)),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
          offset: const Offset(0, 2),
        ),
      ],
    ),
    child: DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: items.first,
        isExpanded: true,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        style: TextStyle(
          color: AppColors.accentColor,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        borderRadius: BorderRadius.circular(12),
        dropdownColor: Colors.white,
        icon: Icon(
          Icons.keyboard_arrow_down_rounded,
          color: AppColors.accentColor,
          size: 24,
        ),
        items: items.map((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(
              item,
              style: TextStyle(
                color: AppColors.textColor,
                fontSize: 16,
              ),
            ),
          );
        }).toList(),
        onChanged: (String? value) {
          if (value != null) {
            onChanged(value);
          }
        },
      ),
    ),
  );
}

buildDatePicker(TextEditingController controller,IconData icon, BuildContext context){
  return Container(
    margin: EdgeInsets.symmetric(horizontal: 10),
    // padding: EdgeInsets.symmetric(vertical: 16),
    child: TextField(
      controller: controller,
      readOnly: true,
      onTap: () async {
        DateTime? pickedDate = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime(1900),
          lastDate: DateTime.now(),
        );
        if (pickedDate != null) {
          // controller.text = DateFormat('dd-MM-yyyy').format(pickedDate);
          //convert date to String as day month name and year
          String formattedDate = DateFormat('dd MMMM yyyy').format(pickedDate);
          controller.text = formattedDate;
        }
      },
      decoration: InputDecoration(
        border: OutlineInputBorder(),
        prefixIcon: Icon(icon),
      ),
    ),
  );
}

buildElevatedButton(String text, Function() onPressed){

  return ElevatedButton(
    style: ElevatedButton.styleFrom(
      backgroundColor: AppColors.accentColor,
      foregroundColor: Colors.white,
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
    onPressed: onPressed, child: kText(text,fontSize: 16,fontWeight: FontWeight.bold,));
}