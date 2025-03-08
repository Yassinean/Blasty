package com.blasty.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ParkingOccupancyResponse {
    private Long parkingId;
    private String parkingName;
    private int totalCapacity;
    private int occupiedSpaces;
    private double occupancyRate;
}
