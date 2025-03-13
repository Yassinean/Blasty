package com.blasty.dto.response;

import com.blasty.model.enums.PlaceStatus;
import com.blasty.model.enums.TypePlace;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlaceResponse {
    private Long id;
    private Long numero;
    private TypePlace type;
    private PlaceStatus etat;
    private double tarifHoraire;
    private Long parkingId;
    private LocalDateTime reservedUntil;
}