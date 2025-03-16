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
    private Long placeId;
    private Long vehicleId;
    private LocalDateTime reservationDate;
    private LocalDateTime endDate;
    private ReservationStatus status;
}