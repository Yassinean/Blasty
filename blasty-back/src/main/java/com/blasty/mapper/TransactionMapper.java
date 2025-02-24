package com.blasty.mapper;

import com.blasty.model.Ticket;
import com.blasty.repository.TicketRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.blasty.dto.request.TransactionRequest;
import com.blasty.dto.response.TransactionResponse;
import com.blasty.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")

public abstract class TransactionMapper implements GenericMapper<TransactionRequest, TransactionResponse, Transaction> {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "date", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "ticket", source = "ticketId")
    public abstract Transaction toEntity(TransactionRequest request);

    @Override
    @Mapping(target = "ticketId", source = "ticket.id")
    public abstract TransactionResponse toResponse(Transaction transaction);

    // Méthode pour mapper un Long (ID) en une entité Ticket
    protected Ticket mapIdToEntity(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
    }
}