import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:hacktoskill/app/routes/app_pages.dart';

import '../controllers/onboarding_controller.dart';

class OnboardingView extends GetView<OnboardingController> {
  const OnboardingView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Transform.scale(
              scale: 1.1, // Adjust the scale factor to zoom in or out
              child: Image.asset(
                'assets/onboarding.png',
                fit: BoxFit
                    .contain, // Keep this as BoxFit.contain or change it as needed
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: SizedBox(
                height: 70,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigator.pushAndRemoveUntil(
                    //     context,
                    //     MaterialPageRoute(
                    //         builder: (BuildContext context) => HomeScreen()),
                    //     (Route<dynamic> route) => false);
                    Get.toNamed(Routes.MEDITATION);
                  },
                  child: Text(
                    'Let us help you',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).focusColor,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12))),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
