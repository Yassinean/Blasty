package com.blasty.controller;

import com.blasty.dto.request.TicketRequest;
import com.blasty.dto.response.TicketResponse;
import com.blasty.service.Interface.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketRequest request) {
        TicketResponse response = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        TicketResponse response = ticketService.getTicketById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> responses = ticketService.getAllTickets();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<TicketResponse> validateTicket(@PathVariable Long id) {
        TicketResponse response = ticketService.validateTicket(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<TicketResponse> cancelTicket(@PathVariable Long id) {
        TicketResponse response = ticketService.cancelTicket(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/extend")
    public ResponseEntity<TicketResponse> extendTicket(@PathVariable Long id, @RequestParam LocalDateTime newExpirationDate) {
        TicketResponse response = ticketService.extendTicket(id, newExpirationDate);
        return ResponseEntity.ok(response);
    }
}