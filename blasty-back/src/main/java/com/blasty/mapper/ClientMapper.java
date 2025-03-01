package com.blasty.mapper;

import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.response.UserResponse;
import com.blasty.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    // Mappage de RegisterRequest vers Client
//    @Mapping(target = "role", source = "role")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "phone", source = "phone")
    Client toEntity(RegisterRequest request);

    // Mappage de Client vers UserResponse
    @Mapping(target = "role", source = "role")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "phone", source = "phone")
    UserResponse toResponse(Client client);
}