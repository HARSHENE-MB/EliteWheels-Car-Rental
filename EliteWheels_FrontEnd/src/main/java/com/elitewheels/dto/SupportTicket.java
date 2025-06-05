package com.elitewheels.dto;

import java.time.LocalDate;

public class SupportTicket {

    private Long id;
    private String ticketId;
    private String name;
    private String email;
    private String phone;
    private String issueType;
    private String status;
    private LocalDate date;
    private String description;
    private String responses;

    // No-argument constructor
    public SupportTicket() {
    }

    // All-argument constructor
    public SupportTicket(Long id, String ticketId, String name, String email, String phone, String issueType,
                         String status, LocalDate date, String description, String responses) {
        this.id = id;
        this.ticketId = ticketId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.issueType = issueType;
        this.status = status;
        this.date = date;
        this.description = description;
        this.responses = responses;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getResponses() {
        return responses;
    }

    public void setResponses(String responses) {
        this.responses = responses;
    }
}
