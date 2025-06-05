package com.elitewheels.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.elitewheels.dto.SupportTicket;
import com.elitewheels.dto.TicketResponse;

import java.util.Arrays;
import java.util.List;

@Controller
public class SupportController {
    private final RestTemplate restTemplate;

    @Value("${backend.api.url}")
    private String backendUrl;

    public SupportController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/support")
    public String showSupportPage(Model model) {
        model.addAttribute("supportTicket", new SupportTicket());
        return "customer/support";
    }

    @PostMapping("/support")
    public String submitSupportTicket(@ModelAttribute SupportTicket supportTicket, Model model) {
        try {
            if (!"Urgent".equals(supportTicket.getStatus())) {
                supportTicket.setStatus("Open");
            }
            String apiUrl = backendUrl + "/api/admin/support/tickets";
            SupportTicket createdTicket = restTemplate.postForObject(apiUrl, supportTicket, SupportTicket.class);
            model.addAttribute("success", "Your ticket has been submitted successfully with Ticket ID: " + createdTicket.getTicketId());
            model.addAttribute("supportTicket", new SupportTicket());
        } catch (Exception e) {
            model.addAttribute("error", "Failed to submit ticket. Please try again. Error: " + e.getMessage());
        }
        return "customer/support";
    }

    @GetMapping("/admin/support")
    public String showAdminSupportPage(Model model) {
        System.out.println("Frontend: Entering /admin/support handler, fetching from " + backendUrl + "/api/admin/support/tickets");
        try {
            String apiUrl = backendUrl + "/api/admin/support/tickets";
            SupportTicket[] tickets = restTemplate.getForObject(apiUrl, SupportTicket[].class);
            System.out.println("Frontend: Received tickets: " + (tickets != null ? Arrays.toString(tickets) : "null"));
            List<SupportTicket> ticketList = Arrays.asList(tickets != null ? tickets : new SupportTicket[0]);
            model.addAttribute("tickets", ticketList);

            long openTickets = ticketList.stream().filter(t -> "Open".equals(t.getStatus()) || "Urgent".equals(t.getStatus())).count();
            long pendingTickets = ticketList.stream().filter(t -> "In Progress".equals(t.getStatus())).count();
            long closedTickets = ticketList.stream().filter(t -> "Closed".equals(t.getStatus())).count();

            model.addAttribute("openTickets", openTickets);
            model.addAttribute("pendingTickets", pendingTickets);
            model.addAttribute("closedTickets", closedTickets);
            model.addAttribute("backendUrl", backendUrl);
            model.addAttribute("currentPage", "support");
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Failed to load tickets. Error: " + e.getMessage());
            System.out.println("Error fetching tickets: " + e.getMessage());
        }
        return "admin/adminsupport";
    }

    @PostMapping("/admin/support/response")
    public String addResponse(@ModelAttribute TicketResponse ticketResponse, Model model) {
        try {
            String apiUrl = backendUrl + "/api/admin/support/tickets/response";
            restTemplate.postForObject(apiUrl, ticketResponse, SupportTicket.class);
            model.addAttribute("success", "Response sent successfully! Ticket has been marked as Closed.");
        } catch (Exception e) {
            model.addAttribute("error", "Failed to send response. Error: " + e.getMessage());
        }
        return "redirect:/admin/support";
    }

    @PostMapping("/admin/support/status")
    public String updateTicketStatus(@RequestParam String ticketId, @RequestParam String status, Model model) {
        try {
            String apiUrl = backendUrl + "/api/admin/support/tickets/" + ticketId + "/status";
            restTemplate.put(apiUrl, status);
            model.addAttribute("success", "Ticket status updated!");
        } catch (Exception e) {
            model.addAttribute("error", "Failed to update ticket status. Error: " + e.getMessage());
        }
        return "redirect:/admin/support";
    }
}