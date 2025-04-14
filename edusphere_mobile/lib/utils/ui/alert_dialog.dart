import 'package:flutter/material.dart';

void showProgressDialog(BuildContext context, String title , String message) {
  showDialog(
    context: context,
    builder: (context) => Dialog(
      child: Material(
        borderRadius: BorderRadius.circular(10),
        color: Colors.white,
        child: Container(

          height: 100,
          width: 100,
          decoration: BoxDecoration(
            color: Colors.white,
            // borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(title),
              Text(message),
            ],
          ),
        ),
      ),
    ),
  );
}

void showErrorDialog(BuildContext context, String message) {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Error'),
      content: Text(message),
    ),
  );
}

