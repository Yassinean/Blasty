package com.blasty.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
public class ReservationRequest {

    @NotNull(message = "L'ID du client est obligatoire")
    private Long clientId;

    @NotNull(message = "L'ID de la place est obligatoire")
    private Long placeId;

    @NotNull(message = "L'ID de la vehicule est obligatoire")
    private Long vehicleId;

    @NotNull(message="Veuillez entrer la date de reservation")
    private LocalDateTime reservationDate;

}