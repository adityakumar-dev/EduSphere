import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:edusphere_mobile/utils/ui/widget_appbar.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  static const String routeName = '/settings';
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
     body: SafeArea(
       child: CustomScrollView(
        slivers: [
          widget_appbar(context, "Edusphere", "Settings", "Edusphere Settings")
          ,SliverToBoxAdapter(
            child: Column(
              children: [
                SizedBox(height: 10),
                buildOptionsCard("Profile", "Manage your profile", Icons.person, () {}),
                SizedBox(height: 10),
                buildOptionsCard("Google Drive", "Manage your Google Drive", Icons.drive_folder_upload_outlined, () {}),
                SizedBox(height: 10),
                buildOptionsCard("Help & Support", "Contact us for help", Icons.help_outline, () {}),
              ],
            ),
          )
        ],
       ),
     ),
    );
  }
}

  buildOptionsCard(String title, String subtitle,IconData icon, Function() onTap){
  return Container(
    margin: EdgeInsets.symmetric(horizontal: 10),
decoration: BoxDecoration(
  border: Border.all(color: AppColors.primaryColor,),
  
  color: Colors.white,
  borderRadius: BorderRadius.circular(10),
  boxShadow: [
    BoxShadow(
      color: AppColors.primaryColor.withOpacity(0.5),
      spreadRadius: 2,
      blurRadius: 5,
      offset: Offset(0, 3),
    ),

  ],

),
child: Card(
  child: ListTile(
    title: Text(title),
    subtitle: Text(subtitle),
    leading: Icon(icon),
    onTap: onTap,
  ),
),

  );
}