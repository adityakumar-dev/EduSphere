import 'package:edusphere_mobile/utils/ui/colors.dart';
import 'package:flutter/material.dart';

   Widget kText(String text, {Color? color, double? fontSize, FontWeight? fontWeight, TextAlign align = TextAlign.center}) {
    return Text(
      text,
      textAlign: align,
      style: TextStyle(
      
        color: color, fontSize: fontSize, fontWeight: fontWeight),
    );
  }

  Widget kTextFormField(String labelText, TextEditingController controller, {Icon? prefixIcon, IconButton? suffixIcon, bool isPassword = false, String? Function(String?)? validator}) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword,

      validator: validator,
      decoration: InputDecoration(
        labelText: labelText,
        prefixIcon: prefixIcon,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: AppColors.primaryColor),
        ),

        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: AppColors.borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
            width: 2,
            color: AppColors.primaryColor),
        
        ),
        
        suffixIcon: suffixIcon,
      ),
    );
  }

  Widget kElevatedButton(String text, VoidCallback onPressed) {
    return ElevatedButton(onPressed: onPressed, child: Text(text));
  }
  

