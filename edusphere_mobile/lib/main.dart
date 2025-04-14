import 'package:edusphere_mobile/providers/auth_state_provider.dart';
import 'package:edusphere_mobile/providers/user_models_provider.dart';
import 'package:edusphere_mobile/screens/auth/forms/forms_details_screen.dart';
import 'package:edusphere_mobile/screens/auth/register_screen.dart';
import 'package:edusphere_mobile/screens/home/assignments/assignments_screen.dart';
import 'package:edusphere_mobile/screens/home/home_screen.dart';
import 'package:edusphere_mobile/screens/home/settings/profile/profile_screen.dart';
import 'package:edusphere_mobile/screens/home/settings/settings_screen.dart';
import 'package:edusphere_mobile/utils/routes/routes.dart';
import 'package:flutter/material.dart';
import 'package:edusphere_mobile/utils/ui/app_theme.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => UserModelsProvider()),
        ChangeNotifierProvider(create: (context) => AuthStateProvider()),
      ],
      child: MaterialApp(
        theme: AppTheme.lightTheme,
        initialRoute: RegisterScreen.routeName,
        onGenerateRoute: Routes.GenerateRoute,
      ),
    );  
  }
}
