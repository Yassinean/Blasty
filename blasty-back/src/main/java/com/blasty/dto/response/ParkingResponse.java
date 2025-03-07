package com.blasty.dto.response;

import com.blasty.model.enums.ParkingStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private int capacity;
    private int occupiedSpaces;
    private int availablePlaces;
    private ParkingStatus status;
    private Double latitude;
    private Double longitude;
}