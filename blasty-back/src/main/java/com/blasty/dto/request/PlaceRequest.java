package com.blasty.dto.request;

import com.blasty.model.enums.TypePlace;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlaceRequest {
    @NotNull(message = "Le type de place est obligatoire")
    private TypePlace type;

    @NotNull(message = "Le tarif horaire est obligatoire")
    private Double tarifHoraire;

    @NotNull(message = "L'ID du parking est obligatoire")
    private Long parkingId;
}