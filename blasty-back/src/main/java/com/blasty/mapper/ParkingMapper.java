package com.blasty.mapper;

import com.blasty.model.enums.PlaceStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.model.Parking;

@Mapper(componentModel = "spring")
public interface ParkingMapper extends GenericMapper<ParkingRequest, ParkingResponse, Parking> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "places", ignore = true)
    @Mapping(target = "availablePlaces", ignore = true)
    Parking toEntity(ParkingRequest request);

    @Override
    @Mapping(target = "availablePlaces", expression = "java(calculateAvailablePlaces(parking))")
    ParkingResponse toResponse(Parking parking);

    // Méthode par défaut pour calculer les places disponibles
    default int calculateAvailablePlaces(Parking parking) {
        if (parking.getPlaces() != null) {
            return (int) parking.getPlaces().stream()
                    .filter(place -> place.getEtat() == PlaceStatus.DISPONIBLE)
                    .count();
        }
        return parking.getTotalCapacity();
    }

}
