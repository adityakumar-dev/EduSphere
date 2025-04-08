import 'package:edusphere_mobile/screens/auth/forms/forms_details_screen.dart';
import 'package:edusphere_mobile/screens/auth/register_screen.dart';
import 'package:edusphere_mobile/screens/home/assignments/assignments_screen.dart';
import 'package:edusphere_mobile/screens/home/home_screen.dart';
import 'package:edusphere_mobile/screens/home/settings/settings_screen.dart';
import 'package:flutter/material.dart';
import 'package:page_transition/page_transition.dart';

class Routes {
  static Route<dynamic> GenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RegisterScreen.routeName:
        return PageTransition(child: const RegisterScreen(), type: PageTransitionType.fade);
      case FormsDetailsScreen.routeName:
        return PageTransition(child: const FormsDetailsScreen(), type: PageTransitionType.fade);
      case HomeScreen.routeName:
        return PageTransition(child: const HomeScreen(), type: PageTransitionType.fade);
      case SettingsScreen.routeName:
        return PageTransition(child: const SettingsScreen(), type: PageTransitionType.fade);
      case AssignmentsScreen.routeName:
        return PageTransition(child: const AssignmentsScreen(), type: PageTransitionType.fade);
      default:
        return MaterialPageRoute(builder: (context) => const Scaffold(body: Center(child: Text('No route found'))));
    }
  }
}

