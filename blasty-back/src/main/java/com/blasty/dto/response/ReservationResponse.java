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
    private double amount;
    private LocalDateTime reservationDate;
    private LocalDateTime endTime;
    private ReservationStatus status;
}