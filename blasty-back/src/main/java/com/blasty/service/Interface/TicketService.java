package com.blasty.service.Interface;

import java.util.List;

import com.blasty.dto.response.TicketResponse;

public interface TicketService {
    TicketResponse generateTicket(Long reservationId);
    TicketResponse getTicketById(Long id);
    TicketResponse getTicketByNumber(String ticketNumber);
    List<TicketResponse> getTicketsByClientId(Long clientId);
    TicketResponse validateTicket(String ticketNumber);
    void markTicketAsUsed(String ticketNumber);
    void deleteTicket(Long id);
}
