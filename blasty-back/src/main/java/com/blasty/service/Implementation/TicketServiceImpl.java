package com.blasty.service.Implementation;

import com.blasty.service.Interface.PlaceService;
import org.springframework.stereotype.Service;

import com.blasty.dto.request.TicketRequest;
import com.blasty.dto.response.TicketResponse;
import com.blasty.mapper.TicketMapper;
import com.blasty.model.Ticket;
import com.blasty.model.enums.StatutTicket;
import com.blasty.repository.TicketRepository;
import com.blasty.service.Interface.TicketService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final PlaceService placeService;

    @Override
    public TicketResponse createTicket(TicketRequest request) {
        if (!placeService.isPlaceAvailable(request.getPlaceId())) {
            throw new RuntimeException("Place non disponible");
        }
        Ticket ticket = ticketMapper.toEntity(request);
        ticket.setDateEmission(LocalDateTime.now());
        ticket.setDateExpiration(LocalDateTime.now().plusHours(1));
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        return ticketMapper.toResponse(ticket);
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse validateTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        if (ticket.getDateExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ticket expiré");
        }
        ticket.setStatut(StatutTicket.VALIDE);
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        ticket.setStatut(StatutTicket.ANNULE);
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse extendTicket(Long id, LocalDateTime newExpirationDate) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        ticket.setDateExpiration(newExpirationDate);
        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }
}