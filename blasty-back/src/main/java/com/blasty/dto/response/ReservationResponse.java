package com.blasty.dto.response;

import com.blasty.model.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long parkingId;
    private String parkingName;
    private double tarif;
    private Long placeId;
    private String placeNumber;
    private Long vehicleId;
    private String vehicleImmatriculation;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ReservationStatus status;
}
