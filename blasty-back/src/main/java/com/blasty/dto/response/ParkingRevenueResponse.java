package com.blasty.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParkingRevenueResponse {
    private Long parkingId;
    private String parkingName;
    private double totalRevenue;
    private String period;
}
