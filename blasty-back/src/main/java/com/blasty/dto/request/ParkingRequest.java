package com.blasty.dto.request;

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
    private Integer totalCapacity;
}