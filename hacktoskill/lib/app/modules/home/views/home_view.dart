import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:hacktoskill/app/widgets/bottom_sheet_header_title.dart';
import 'package:hacktoskill/app/widgets/date.dart';
import 'package:hacktoskill/app/widgets/emoticon_card.dart';
import 'package:hacktoskill/app/widgets/exercise_tile.dart';
import 'package:hacktoskill/app/widgets/greet.dart';
import 'package:hacktoskill/app/widgets/search_field.dart';

import '../controllers/home_controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () {},
      //   child: BlocBuilder<HomeBloc, HomeState>(
      //     builder: (context, state) {
      //       return Text(
      //         state.mood,
      //         style: const TextStyle(fontSize: 35),
      //       );
      //     },
      //   ),
      // ),
      backgroundColor: Colors.blue[800],
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(
                    height: 25.0,
                  ),
                  const SearchField(),
                  const SizedBox(
                    height: 25.0,
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 10.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text(
                          'How do you feel?',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Icon(
                          Icons.more_horiz,
                          size: 30,
                          color: Colors.white,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: const [
                      EmoticonCard(emoticonFace: '😔', mood: 'Badly'),
                      SizedBox(
                        width: 20,
                      ),
                      EmoticonCard(emoticonFace: '😊', mood: 'Fine'),
                      SizedBox(
                        width: 20,
                      ),
                      EmoticonCard(emoticonFace: '😁', mood: 'Well'),
                      SizedBox(
                        width: 20,
                      ),
                      EmoticonCard(emoticonFace: '😃', mood: 'Excellent'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Expanded(
              child: Container(
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.blueAccent,
                      blurRadius: 10,
                      //offset: Offset.infinite,
                    ),
                  ],
                  color: Colors.grey.shade100,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(
                      35.0,
                    ),
                    topRight: Radius.circular(
                      35.0,
                    ),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const BottomSheetHeaderTitle(
                        titleText: 'Exercises',
                      ),
                      Expanded(
                        child: ListView(
                          //how to use ListView.builder in this?
                          children: const [
                            ExerciseTile(
                              exercise: 'Speaking Skills',
                              subExercise: '16 Exercises',
                              icon: Icons.favorite,
                              color: Colors.orange,
                            ),
                            ExerciseTile(
                              exercise: 'Reading Speed',
                              subExercise: '8 Exercises',
                              icon: Icons.person,
                              color: Colors.pink,
                            ),
                            ExerciseTile(
                              exercise: 'Speaking Skills',
                              subExercise: '16 Exercises',
                              icon: Icons.umbrella,
                              color: Colors.red,
                            ),
                            ExerciseTile(
                              exercise: 'Speaking Skills',
                              subExercise: '16 Exercises',
                              icon: Icons.book,
                              color: Colors.yellow,
                            ),
                            ExerciseTile(
                              exercise: 'Speaking Skills',
                              subExercise: '16 Exercises',
                              icon: Icons.music_note,
                              color: Colors.pink,
                            ),
                            ExerciseTile(
                              exercise: 'Speaking Skills',
                              subExercise: '16 Exercises',
                              icon: Icons.mobile_friendly,
                              color: Colors.green,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
