package com.blasty.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingResponse {
    private Long id;
    private String name;
    private String address;
    private int totalCapacity;
    private int availablePlaces;
}