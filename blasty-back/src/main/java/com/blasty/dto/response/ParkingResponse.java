package com.blasty.dto.response;

import com.blasty.model.enums.ParkingStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

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
    private int width;
    private int length;
    private double surface;
}
