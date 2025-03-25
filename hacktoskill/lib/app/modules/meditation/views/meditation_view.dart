import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hacktoskill/app/data/theme.dart';
import 'package:hacktoskill/app/modules/meditation/controllers/meditation_controller.dart';
import 'package:hacktoskill/app/widgets/feeling_button.dart';
import 'package:hacktoskill/app/widgets/task_card.dart';

class MeditationView extends GetView<MeditationController> {
  const MeditationView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: DefaultColors.white,
        elevation: 0,
        leading: Image.asset('assets/menu_burger.png'),
        actions: [
          CircleAvatar(
            backgroundImage: AssetImage('assets/profile.png'),
          ),
          SizedBox(width: 16),
        ],
      ),
      backgroundColor: DefaultColors.white,
      body: Container(
        padding: const EdgeInsets.all(16),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome back, Sabrina!',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 32),
              Text(
                'How are you feeling today ?',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  FeelingButton(
                    label: 'Happy',
                    image: 'assets/happy.png',
                    color: DefaultColors.pink,
                    onTap: () {},
                  ),
                  FeelingButton(
                    label: 'Calm',
                    image: 'assets/calm.png',
                    color: DefaultColors.purple,
                    onTap: () {},
                  ),
                  FeelingButton(
                    label: 'Relax',
                    image: 'assets/relax.png',
                    color: DefaultColors.orange,
                    onTap: () {},
                  ),
                  FeelingButton(
                    label: 'Focus',
                    image: 'assets/focus.png',
                    color: DefaultColors.lightteal,
                    onTap: () {},
                  ),
                ],
              ),
              SizedBox(height: 24),
              Text(
                'Today\'s Task',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              SizedBox(height: 16),
              Column(
                children: [
                  TaskCard(
                    title: 'Morning',
                    description: 'Morning task description goes here.',
                    color: DefaultColors.task1,
                  ),
                  SizedBox(height: 16),
                  TaskCard(
                    title: 'Noon',
                    description: 'Noon task description goes here.',
                    color: DefaultColors.task2,
                  ),
                  SizedBox(height: 16),
                  TaskCard(
                    title: 'Evening',
                    description: 'Evening task description goes here.',
                    color: DefaultColors.task3,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
