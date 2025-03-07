package com.blasty.dto.response;

import com.blasty.model.enums.PlaceStatus;
import com.blasty.model.enums.TypePlace;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaceResponse {
    private Long id;
    private TypePlace type;
    private PlaceStatus etat;
    private double tarifHoraire;
    private Long parkingId;
}