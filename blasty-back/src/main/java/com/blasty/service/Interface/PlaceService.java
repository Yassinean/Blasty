package com.blasty.service.Interface;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;

import java.util.List;

public interface PlaceService {
    PlaceResponse createPlace(Long parkingId,PlaceRequest request);
    PlaceResponse getPlaceById(Long id);
    List<PlaceResponse> getAllPlaces();
    PlaceResponse updatePlace(Long id, PlaceRequest request);
    void deletePlace(Long id);
}