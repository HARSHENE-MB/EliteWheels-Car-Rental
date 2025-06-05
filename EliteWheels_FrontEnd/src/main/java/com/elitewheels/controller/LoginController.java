package com.elitewheels.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

   
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("phoneNumber", "");
        model.addAttribute("verificationCode", "");
        model.addAttribute("otpMessage", "Enter your phone number to log in.");
        return "customer/login"; 
    }
    
    

    @GetMapping("/changePhone")
    public String changePhoneNumber(Model model) {
        model.addAttribute("phoneNumber", "");
        model.addAttribute("verificationCode", "");
        model.addAttribute("otpMessage", "Please enter a different phone number.");
        return "customer/login";
    }
    
    



}
