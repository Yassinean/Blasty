package com.blasty.service.Interface;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.dto.response.ReservationResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface PlaceService {
    PlaceResponse createPlace(Long parkingId,PlaceRequest request);
    PlaceResponse getPlaceById(Long id);
    List<PlaceResponse> getAllPlaces();
    PlaceResponse updatePlace(Long id, PlaceRequest request);
    void deletePlace(Long id);
    PlaceResponse reservePlace(Long placeId, LocalDateTime reservedUntil);
    public boolean isPlaceAvailable(Long placeId);
    boolean isPlaceAvailableInTime(Long placeId, LocalDateTime reservationDate);
    PlaceResponse occupyPlace(Long placeId);
    PlaceResponse freePlace(Long placeId);
}