package com.blasty.mapper;

import com.blasty.dto.response.TicketResponse;
import com.blasty.model.Client;
import com.blasty.model.Place;
import com.blasty.model.Ticket;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.PlaceRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping(target = "reservationId" , source = "reservation.id")
    @Mapping(target = "clientName" , source = "reservation.client.name")
    @Mapping(target = "vehicleImmatriculation" , source = "reservation.vehicle.immatriculation")
    @Mapping(target = "placeId" , source = "reservation.place.id")
    @Mapping(target = "placeNumber" , source = "reservation.place.numero")
    @Mapping(target = "parkingName" , source = "reservation.parking.name")
    @Mapping(target = "startDate" , source = "reservation.startDate")
    @Mapping(target = "endDate" , source = "reservation.endDate")
    TicketResponse toResponse(Ticket ticket);
}