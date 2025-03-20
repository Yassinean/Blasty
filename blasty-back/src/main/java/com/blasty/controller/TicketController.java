package com.blasty.controller;

import com.blasty.dto.response.TicketResponse;
import com.blasty.service.Interface.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Slf4j
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("/generate/{reservationId}")
    public ResponseEntity<TicketResponse> generateTicket(@PathVariable Long reservationId) {
        TicketResponse ticket = ticketService.generateTicket(reservationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        TicketResponse ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<TicketResponse> getTicketByNumber(@PathVariable String ticketNumber) {
        TicketResponse ticket = ticketService.getTicketByNumber(ticketNumber);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByClientId(@PathVariable Long clientId) {
        List<TicketResponse> tickets = ticketService.getTicketsByClientId(clientId);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/validate/{ticketNumber}")
    public ResponseEntity<TicketResponse> validateTicket(@PathVariable String ticketNumber) {
        TicketResponse ticket = ticketService.validateTicket(ticketNumber);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/use/{ticketNumber}")
    public ResponseEntity<Void> markTicketAsUsed(@PathVariable String ticketNumber) {
        ticketService.markTicketAsUsed(ticketNumber);
        return ResponseEntity.ok().build();
    }
}