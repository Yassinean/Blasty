package com.blasty.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.blasty.model.enums.PlaceStatus;

import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParkingResponse {
    private Long id;
    private String name;
    private String address;
    private int totalCapacity;
    private int availablePlaces;
    private PlaceStatus placeStatus;
}