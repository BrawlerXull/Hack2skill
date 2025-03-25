import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:hacktoskill/app/modules/challenge/views/challenge_content.dart';

import '../controllers/challenge_controller.dart';




import 'package:flutter/material.dart';

class ChallengeView extends GetView<ChallengeController> {
  const ChallengeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromRGBO(0, 0, 0, 0),
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.menu, color: Theme.of(context).colorScheme.primary),
          onPressed: () {
            // Logic for opening the drawer
          },
        ),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildCounter(Icons.local_fire_department, 5, context),
            SizedBox(width: 16),
            _buildCounter(Icons.local_play, 100, context),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.person, color: Theme.of(context).colorScheme.primary),
            onPressed: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => ProfileScreen()),
              // );
            },
          ),
        ],
      ),
      drawer: _buildDrawer(context),
      body: HomeContent(), // This will be the screen you want to display in the body
      backgroundColor: Theme.of(context).colorScheme.surface,
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.background,
            ),
            child: Text(
              'Emo',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onPrimary,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.settings),
            title: Text('Settings'),
            onTap: () {
              // Handle settings tap
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.help),
            title: Text('Help'),
            onTap: () {
              // Handle help tap
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: Icon(Icons.logout),
            title: Text('Logout'),
            onTap: () {
              // Handle logout
            },
          ),
          ListTile(
            leading: Icon(Icons.sunny),
            title: Text('Theme'),
            onTap: () {
              // Handle theme toggle
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCounter(IconData icon, int count, BuildContext context, {Color? iconColor}) {
    Color getIconColor() {
      if (icon == Icons.local_fire_department) return Colors.orange;
      if (icon == Icons.local_play) return Colors.blue;
      return iconColor ?? Theme.of(context).colorScheme.onBackground;
    }

    return Row(
      children: [
        Icon(icon, color: getIconColor(), size: 20),
        SizedBox(width: 4),
        Text(
          count.toString(),
          style: TextStyle(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
