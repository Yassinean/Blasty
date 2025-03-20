package com.blasty.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private Long reservationId;
    private String clientName;
    private String vehicleImmatriculation;
    private Long placeId;
    private Long placeNumber;
    private String parkingName;
    private LocalDateTime issueDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private double price;
    private int durationHours;
    private boolean isUsed;
    private String accessCode;
}