import 'package:edusphere_mobile/screens/home/settings/settings_screen.dart';
import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:flutter/material.dart';

SliverAppBar widget_appbar(BuildContext context, String title1, String title2, String title, {bool showActionButton = false}) {
    return SliverAppBar(
        expandedHeight: 120,
        floating: false,
        pinned: true,
        automaticallyImplyLeading: false,
        backgroundColor: Colors.white,
        flexibleSpace: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final top = constraints.biggest.height;
            final expandedHeight = 120.0;
            final expandRatio = (top - kToolbarHeight) / (expandedHeight - kToolbarHeight);
            
            return FlexibleSpaceBar(
              titlePadding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (expandRatio > 0.5) ...[
                    Text(
                      title1,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      title2,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryColor,
                      ),
                    ),
                  ] else
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryColor,
                      ),
                    ),
                ],
              ),
            );
          },
        ),
        actions: showActionButton 
            ? [
                IconButton(
                  icon: const Icon(Icons.notifications_outlined),
                  onPressed: () {
                    // Handle notifications
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.settings),
                  onPressed: () {
                    Navigator.pushNamed(context, SettingsScreen.routeName);
                    // Handle search
                  },
                ),
              ]
            : [IconButton(onPressed: (){
              Navigator.pop(context);
            }, icon: Icon(Icons.close))],
      );
  }
