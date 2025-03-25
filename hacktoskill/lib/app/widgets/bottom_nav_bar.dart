import 'package:flutter/material.dart';


class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  const BottomNavBar({
    super.key,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      items: [
        BottomNavigationBarItem(
          label: '',
          // icon: Icon(
          //   Icons.home,
          // ),
          icon: IconButton(
            onPressed: () {
            },
            icon: const Icon(
              Icons.home,
            ),
          ),
        ),
        BottomNavigationBarItem(
          label: '',
          // icon: Icon(
          //   Icons.message,
          // ),
          icon: IconButton(
            onPressed: () {

            },
            icon: const Icon(
              Icons.message,
            ),
          ),
        ),
      ],
    );
  }
}
