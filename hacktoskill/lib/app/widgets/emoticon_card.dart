import 'package:flutter/material.dart';



class EmoticonCard extends StatelessWidget {
  const EmoticonCard({super.key, required this.emoticonFace, required this.mood});

  final String emoticonFace;
  final String mood;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
      },
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.only(
              top: 10,
              left: 17,
              right: 17,
              bottom: 10,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(
                10.0,
              ),
              color: Colors.blue[600],
            ),
            child: Text(
              emoticonFace,
              style: const TextStyle(
                fontSize: 30.0,
              ),
            ),
          ),
          const SizedBox(
            height: 15.0,
          ),
          Text(
            mood,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15.0,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
