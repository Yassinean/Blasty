package com.blasty.dto.request;

import com.blasty.model.enums.ParkingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ParkingRequest {
    @NotBlank(message = "Le nom du parking est obligatoire")
    private String name;

    @NotBlank(message = "L'adresse du parking est obligatoire")
    private String address;

    @NotNull(message = "La capacité totale est obligatoire")
    private Integer capacity;

    @NotNull(message = "Le statut du parking est obligatoire")
    private ParkingStatus status;

    private int occupiedSpaces;

    private Double latitude;
    private Double longitude;
}