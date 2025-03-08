package com.blasty.service.Interface;
import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ParkingService {
    ParkingResponse createParking(ParkingRequest request);
    ParkingResponse getParkingById(Long id);
    List<ParkingResponse> getAllParkings(Pageable pageable);
    ParkingResponse updateParking(Long id, ParkingRequest request);
    int getAvailablePlaces(Long parkingId);
    void deleteParking(Long id);
}