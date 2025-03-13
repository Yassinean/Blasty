package com.blasty.mapper;


import com.blasty.dto.request.ReservationRequest;
import com.blasty.dto.response.ReservationResponse;
import com.blasty.model.Client;
import com.blasty.model.Place;
import com.blasty.model.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    ReservationMapper INSTANCE = Mappers.getMapper(ReservationMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservationDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "status", expression = "java(com.blasty.model.enums.ReservationStatus.PENDING)")
    @Mapping(target = "client", source = "clientId")
    @Mapping(target = "place", source = "placeId")
      Reservation toEntity(ReservationRequest request);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "placeId", source = "place.id")
    ReservationResponse toResponse(Reservation reservation);

    @Mapping(target = "id", source = "clientId")
    Client toClient(Long clientId);

    @Mapping(target = "id", source = "placeId")
    Place toPlace(Long placeId);
}
