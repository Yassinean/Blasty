package com.blasty.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingOccupancyResponse {
    private Long parkingId;
    private String parkingName;
    private int totalCapacity;
    private int occupiedSpaces;
    private double occupancyRate;
}
