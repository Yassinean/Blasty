package com.blasty.mapper;

import com.blasty.dto.request.TicketRequest;
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
public abstract class TicketMapper implements GenericMapper<TicketRequest, TicketResponse, Ticket> {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PlaceRepository placeRepository;


    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "codeQR", expression = "java(java.util.UUID.randomUUID().toString())")
    @Mapping(target = "dateEmission", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "statut", expression = "java(com.blasty.model.enums.StatutTicket.VALIDE)")
    @Mapping(target = "client", source = "clientId")
    @Mapping(target = "place", source = "placeId")
    public abstract Ticket toEntity(TicketRequest request);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "placeId", source = "place.id")
    public abstract TicketResponse toResponse(Ticket ticket);

    protected Place mapIdToEntityPlace(Long placeId) {
        return placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place non trouvé"));
    }

    protected Client mapIdToEntityClient(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }
}