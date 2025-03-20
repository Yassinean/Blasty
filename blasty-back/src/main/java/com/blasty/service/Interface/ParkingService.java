package com.blasty.service.Interface;
import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingOccupancyResponse;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.dto.response.ParkingRevenueResponse;

import java.util.List;

public interface ParkingService {
    ParkingResponse createParking(ParkingRequest request);

    ParkingResponse getParkingById(Long id);

    List<ParkingResponse> getAllParkings();

    ParkingResponse updateParking(Long id, ParkingRequest request);

    int getAvailablePlaces(Long parkingId);

    void deleteParking(Long id);

    ParkingOccupancyResponse getParkingOccupancy(Long id);

    List<ParkingRevenueResponse> getAllParkingsRevenue(String period);

    ParkingRevenueResponse getParkingRevenue(Long id , String period);

    List<ParkingOccupancyResponse> getAllParkingsOccupancy();

    void incrementOccupiedSpaces(Long parkingId);

    void decrementOccupiedSpaces(Long parkingId);
}