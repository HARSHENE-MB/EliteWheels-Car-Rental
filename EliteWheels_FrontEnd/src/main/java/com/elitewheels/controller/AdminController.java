package com.elitewheels.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AdminController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/admin/login")
    public String showLoginPage() {
        return "admin/adminlogin";
    }

    @GetMapping("/admin/users")
    public String showUserManagementPage() {
        return "admin/usermanagement";
    }

    @GetMapping("/admin/carmanagement")
    public String showCarManagementPage() {
        return "admin/carmanagement";
    }

    @GetMapping("/admin/bookings")
    public String showBookingManagementPage() {
        return "admin/bookingmanagement";
    }

    @GetMapping("/admin/reporting")
    public String showReportingPage() {
        return "admin/adminreport";
    }

    @GetMapping("/admin/dashboard")
    public String showDashboardPage() {
        return "admin/adminDashboard";
    }


    @PostMapping("/admin/login")
    public String login(@RequestParam String username, @RequestParam String password, RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return "redirect:/admin/carmanagement";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Invalid credentials. Please try again.");
            return "redirect:/admin/login";
        }
    }
}