package com.elitewheels.dto;

public class TicketResponse {

    private String ticketId;
    private String response;
    private boolean sendAsEmail;

    // No-argument constructor
    public TicketResponse() {
    }

    // All-argument constructor
    public TicketResponse(String ticketId, String response, boolean sendAsEmail) {
        this.ticketId = ticketId;
        this.response = response;
        this.sendAsEmail = sendAsEmail;
    }

    // Getters and setters
    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public boolean isSendAsEmail() {
        return sendAsEmail;
    }

    public void setSendAsEmail(boolean sendAsEmail) {
        this.sendAsEmail = sendAsEmail;
    }
}
