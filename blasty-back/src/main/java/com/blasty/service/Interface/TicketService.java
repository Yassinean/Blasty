package com.blasty.service.Interface;

import java.time.LocalDateTime;
import java.util.List;

import com.blasty.dto.request.TicketRequest;
import com.blasty.dto.response.TicketResponse;

public interface TicketService {
    TicketResponse createTicket(TicketRequest request);

    TicketResponse getTicketById(Long id);

    List<TicketResponse> getAllTickets();

    TicketResponse validateTicket(Long id);

    TicketResponse cancelTicket(Long id);

    TicketResponse extendTicket(Long id, LocalDateTime newExpirationDate);
}
