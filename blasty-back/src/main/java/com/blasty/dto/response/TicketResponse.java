package com.blasty.dto.response;

import java.time.LocalDateTime;

import com.blasty.model.enums.StatutTicket;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String codeQR;
    private LocalDateTime dateEmission;
    private LocalDateTime dateExpiration;
    private StatutTicket statut;
    private Long clientId;
    private Long placeId;
}
