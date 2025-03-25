import 'package:flutter/material.dart';
import 'package:hacktoskill/app/widgets/notification_icon.dart';


class Greet extends StatelessWidget {
  const Greet({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // BlocBuilder<HomeBloc, HomeState>(
        //   builder: (context, state) {
        //     return Text(
        //       'Hi, Jared! ${state.mood}',
        //       style: greetText,
        //     );
        //   },
        // ),
        const NotificationIcon()
      ],
    );
  }
}
