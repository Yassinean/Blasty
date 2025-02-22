package com.blasty.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.model.Parking;

@Mapper(componentModel = "spring")
public interface ParkingMapper {
    ParkingMapper INSTANCE = Mappers.getMapper(ParkingMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "places", ignore = true)
    Parking toEntity(ParkingRequest request);

    @Mapping(target = "availablePlaces", expression = "java(parking.getPlaces() != null ? (int) parking.getPlaces().stream().filter(place -> place.getEtat() == PlaceStatus.DISPONIBLE).count() : 0)")
    ParkingResponse toResponse(Parking parking);

}
