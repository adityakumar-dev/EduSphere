import 'package:edusphere_mobile/apis/firebase/firebase_auth.dart';
import 'package:edusphere_mobile/providers/user_models_provider.dart';
import 'package:edusphere_mobile/screens/home/assignments/assignments_screen.dart';
import 'package:edusphere_mobile/screens/home/settings/settings_screen.dart';
import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:edusphere_mobile/utils/ui/ui_helper.dart';
import 'package:edusphere_mobile/utils/ui/widget_appbar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  static const String routeName = '/home';
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // int _selectedIndex = 0;
  String _userName = '';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      Map<String, dynamic> userInfo = await FirebaseAuthApi.getUserInfo();
      setState(() {
        _userName = userInfo['name'] ?? 'Student';
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _userName = 'Student';
        _isLoading = false;
      });
    }
  }

  // void _onItemTapped(int index) {
  //   setState(() {
  //     _selectedIndex = index;
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<UserModelsProvider>(context, listen: false);
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          :   _buildHomeTab(),
     
    );
  }
// bool _isExpanded = false;
  Widget _buildHomeTab() {
    final provider = Provider.of<UserModelsProvider>(context, listen: false);
    return CustomScrollView(
      slivers: [
        // App Bar with Greeting
        widget_appbar(context, "Hello",provider.data!.name,"Welcome back, ${provider.data!.name}",showActionButton: true),

        // Main Content
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Today's Schedule Card
                _buildScheduleCard(),
                const SizedBox(height: 20),

                // Quick Actions
                _buildQuickActions(),
                const SizedBox(height: 20),

                // Upcoming Events
                _buildUpcomingEvents(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildScheduleCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Today's Schedule",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to full schedule
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildScheduleItem(
            'Mathematics',
            '09:00 AM - 10:30 AM',
            'Room 101',
            Icons.calculate_rounded,
          ),
          const Divider(height: 24),
          _buildScheduleItem(
            'Physics',
            '11:00 AM - 12:30 PM',
            'Room 203',
            Icons.science_rounded,
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleItem(String title, String time, String location, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.primaryColor),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                time,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                location,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 3,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 1.2,
          children: [
            _buildActionItem(Icons.assignment_rounded, 'Assignments', (){
          Navigator.pushNamed(context, AssignmentsScreen.routeName);
            }),
            _buildActionItem(Icons.quiz_rounded, 'Quizzes', (){}),
            _buildActionItem(Icons.check_circle_outline_rounded, 'Attendance', (){}),
            _buildActionItem(Icons.calendar_today_rounded, 'Calendar', (){}),
            _buildActionItem(Icons.book_rounded, 'Study Materials', (){}),
            _buildActionItem(Icons.settings_rounded, 'Settings', (){
              Navigator.pushNamed(context, SettingsScreen.routeName);
            }),
          ],
        ),
      ],
    );
  }

  Widget _buildActionItem(IconData icon, String label, Function() onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.primaryColor, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingEvents() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Upcoming Events',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildEventItem(
            'Mid-term Examination',
            'Next Week',
            Icons.event_rounded,
          ),
          const Divider(height: 24),
          _buildEventItem(
            'Project Submission',
            'In 3 days',
            Icons.assignment_turned_in_rounded,
          ),
        ],
      ),
    );
  }

  Widget _buildEventItem(String title, String date, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.primaryColor),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                date,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

}
