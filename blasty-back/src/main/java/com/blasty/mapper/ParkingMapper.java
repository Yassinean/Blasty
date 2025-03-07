package com.blasty.mapper;

import com.blasty.model.enums.PlaceStatus;
import com.blasty.dto.request.ParkingRequest;
import com.blasty.dto.response.ParkingResponse;
import com.blasty.model.Parking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")

public interface ParkingMapper {

    ParkingMapper INSTANCE = Mappers.getMapper(ParkingMapper.class);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "places", ignore = true)
    @Mapping(target = "occupiedSpaces", expression = "java(0)")
    Parking toEntity(ParkingRequest request);

    @Mapping(target = "availablePlaces", expression = "java(parking.getAvailablePlaces())")
    ParkingResponse toResponse(Parking parking);
}
