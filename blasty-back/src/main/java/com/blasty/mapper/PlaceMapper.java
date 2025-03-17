package com.blasty.mapper;

import com.blasty.dto.request.PlaceRequest;
import com.blasty.dto.response.PlaceResponse;
import com.blasty.model.Parking;
import com.blasty.model.Place;
import com.blasty.repository.ParkingRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;


@Mapper(componentModel = "spring")
public abstract class PlaceMapper{

    @Autowired
    private ParkingRepository parkingRepository;


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "etat", expression = "java(com.blasty.model.enums.PlaceStatus.DISPONIBLE)")
    public abstract Place toEntity(PlaceRequest request);


    @Mapping(target = "parkingId", source = "parking.id")
    public abstract PlaceResponse toResponse(Place place);

    // Méthode pour mapper un Long (ID) en une entité Parking
    protected Parking mapParking(Long parkingId) {
        return parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking non trouvé"));
    }
}
